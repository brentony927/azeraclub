import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é AZERA AI, uma assistente pessoal inteligente e versátil.

Você pode ajudar com qualquer assunto — desde perguntas do dia-a-dia até temas complexos. Alguns exemplos:

- Responder perguntas sobre qualquer tema com base no seu conhecimento geral
- Ajudar com estudos, trabalho, criatividade e projetos pessoais
- Dar dicas de saúde, bem-estar e lifestyle
- Auxiliar com código, tecnologia e problemas técnicos
- Aconselhar sobre decisões pessoais e profissionais
- Planejar viagens, eventos e rotinas
- Explicar conceitos de forma simples e clara
- Conversar sobre cultura, ciência, história, atualidades e mais

PERSONALIDADE: Direta, simpática e inteligente. Você fala como uma amiga esperta — sem formalidade excessiva e sem jargão corporativo. Use humor natural quando fizer sentido. Seja honesta e útil acima de tudo.

IDIOMA: Responda sempre em português do Brasil, a menos que o usuário escreva em outro idioma.`;

const PRODUCT_MAP: Record<string, string> = {
  prod_U62xpa0u9xDiJO: "pro",
  prod_U62xPut1mfd9CG: "elite",
};

const TIER_ORDER = ["free", "basic", "pro", "elite"];

const DAILY_LIMIT_FREE = 20;

function tierIndex(tier: string): number {
  return TIER_ORDER.indexOf(tier);
}

async function getUserPlan(userId: string, email: string): Promise<string> {
  // Check manual plan override first
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );
  const { data: manualPlan } = await serviceClient
    .from("user_plans")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  if (manualPlan?.plan && manualPlan.plan !== "free") return manualPlan.plan;

  // Fall back to Stripe
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return "free";
  
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) return "free";

  const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "active", limit: 1 });
  if (subs.data.length === 0) return "free";

  const productId = subs.data[0].items.data[0].price.product as string;
  return PRODUCT_MAP[productId] || "free";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH: Validate JWT via getClaims ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;
    const { messages, requireTier } = await req.json();

    // --- SUBSCRIPTION CHECK ---
    const plan = await getUserPlan(userId, userEmail);

    // If a minimum tier is required (e.g. "pro" for Radars), enforce it
    if (requireTier && tierIndex(plan) < tierIndex(requireTier)) {
      return new Response(JSON.stringify({ error: "Upgrade required to access this feature." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- DAILY LIMIT for free users ---
    if (plan === "free" || plan === "basic") {
      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );
      const today = new Date().toISOString().slice(0, 10);
      const { count } = await serviceClient
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "user")
        .gte("created_at", `${today}T00:00:00Z`)
        .lte("created_at", `${today}T23:59:59Z`);

      if ((count ?? 0) >= DAILY_LIMIT_FREE) {
        return new Response(JSON.stringify({ error: "Daily AI message limit reached. Upgrade your plan for unlimited access." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // --- AI REQUEST ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("azera-ai error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
