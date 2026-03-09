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

const CONTEXT_INSTRUCTIONS = `

INSTRUÇÕES SOBRE O CONTEXTO DO USUÁRIO:
Você tem acesso aos dados reais do usuário no app AZERA. Use essas informações para personalizar suas respostas:
- Quando relevante, faça referências naturais aos objetivos, tarefas e projetos do usuário
- Sugira próximos passos baseados no contexto real (tarefas pendentes, objetivos ativos, etc.)
- Comente sobre progresso de hábitos e desafios quando fizer sentido
- Opine sobre ideias e projetos quando perguntada
- NÃO repita todo o contexto de volta — use-o naturalmente como conhecimento de fundo
- Se o usuário perguntar "o que você sabe sobre mim", resuma as informações de forma amigável
- Você também tem MEMÓRIAS de conversas anteriores — use-as naturalmente para demonstrar continuidade e personalização`;

const PRODUCT_MAP: Record<string, string> = {
  prod_U62xpa0u9xDiJO: "pro",
  prod_U62xPut1mfd9CG: "business",
};

const TIER_ORDER = ["free", "basic", "pro", "business"];
const DAILY_LIMIT_FREE = 20;

function tierIndex(tier: string): number {
  return TIER_ORDER.indexOf(tier);
}

function createServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );
}

async function getUserPlan(userId: string, email: string): Promise<string> {
  const serviceClient = createServiceClient();
  const { data: manualPlan } = await serviceClient
    .from("user_plans")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  if (manualPlan?.plan && manualPlan.plan !== "free") {
    const mapped = manualPlan.plan === "elite" ? "business" : manualPlan.plan;
    return mapped;
  }

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

async function getUserContext(userId: string, plan: string): Promise<string> {
  const sc = createServiceClient();

  const [
    profileRes,
    objectivesRes,
    tasksRes,
    journalRes,
    habitsRes,
    challengesRes,
    ideasRes,
    projectsRes,
    tripsRes,
    healthRes,
    socialRes,
    propertiesRes,
    founderProfileRes,
    connectionsRes,
    opportunitiesRes,
    notificationsRes,
  ] = await Promise.all([
    sc.from("profiles").select("display_name, bio, age, location, profession, interests").eq("user_id", userId).maybeSingle(),
    sc.from("objectives").select("title, status, progress, category, target_date").eq("user_id", userId).eq("status", "ativo").order("created_at", { ascending: false }).limit(10),
    sc.from("tasks").select("title, status, date, type").eq("user_id", userId).eq("status", "pending").order("date", { ascending: true }).limit(10),
    sc.from("journal_entries").select("content, mood, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    sc.from("habits").select("title, frequency, streak, status").eq("user_id", userId).eq("status", "active"),
    sc.from("challenges").select("title, status, current_day, duration_days").eq("user_id", userId).eq("status", "ativo"),
    sc.from("ideas").select("title, description, status, category").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    sc.from("projects").select("name, description, status").eq("user_id", userId),
    sc.from("trips").select("destination, country, dates, status").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    sc.from("health_appointments").select("provider, specialty, date, type").eq("user_id", userId).order("date", { ascending: true }).limit(5),
    sc.from("social_events").select("title, date, location, rsvp, type").eq("user_id", userId).order("date", { ascending: true }).limit(5),
    sc.from("properties").select("name, type, city, country, valuation").eq("user_id", userId),
    sc.from("founder_profiles").select("name, building, industry, skills, country, city, commitment, looking_for").eq("user_id", userId).maybeSingle(),
    sc.from("founder_connections").select("id", { count: "exact", head: true }).or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).eq("status", "accepted"),
    sc.from("founder_opportunities").select("title, description, project").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    sc.from("founder_notifications").select("title, type, read").eq("user_id", userId).eq("read", false).limit(10),
  ]);

  const lines: string[] = ["\n\n--- CONTEXTO DO USUÁRIO ---"];

  const p = profileRes.data;
  if (p) {
    const parts = [p.display_name || "Sem nome"];
    if (p.age) parts.push(`${p.age} anos`);
    if (p.location) parts.push(p.location);
    if (p.profession) parts.push(p.profession);
    lines.push(`PERFIL: ${parts.join(", ")}`);
    if (p.bio) lines.push(`Bio: ${p.bio}`);
    if (p.interests?.length) lines.push(`Interesses: ${p.interests.join(", ")}`);
  }

  lines.push(`PLANO: ${plan}`);

  const objs = objectivesRes.data;
  if (objs?.length) {
    lines.push("\nOBJETIVOS ATIVOS:");
    objs.forEach((o: any, i: number) => {
      lines.push(`${i + 1}. ${o.title} (${o.category}, progresso: ${o.progress}%${o.target_date ? `, prazo: ${o.target_date}` : ""})`);
    });
  }

  const tasks = tasksRes.data;
  if (tasks?.length) {
    lines.push("\nTAREFAS PENDENTES:");
    tasks.forEach((t: any, i: number) => {
      lines.push(`${i + 1}. ${t.title}${t.date ? ` (data: ${t.date})` : ""} [${t.type}]`);
    });
  }

  const habits = habitsRes.data;
  if (habits?.length) {
    lines.push("\nHÁBITOS ATIVOS:");
    habits.forEach((h: any, i: number) => {
      lines.push(`${i + 1}. ${h.title} (${h.frequency}, streak: ${h.streak} dias)`);
    });
  }

  const challenges = challengesRes.data;
  if (challenges?.length) {
    lines.push("\nDESAFIOS ATIVOS:");
    challenges.forEach((c: any, i: number) => {
      lines.push(`${i + 1}. ${c.title} (dia ${c.current_day}/${c.duration_days})`);
    });
  }

  const ideas = ideasRes.data;
  if (ideas?.length) {
    lines.push("\nIDEIAS:");
    ideas.forEach((id: any, i: number) => {
      lines.push(`${i + 1}. ${id.title} [${id.category}, ${id.status}]${id.description ? ` — ${id.description.slice(0, 80)}` : ""}`);
    });
  }

  const projects = projectsRes.data;
  if (projects?.length) {
    lines.push("\nPROJETOS:");
    projects.forEach((pr: any, i: number) => {
      lines.push(`${i + 1}. ${pr.name} [${pr.status}]${pr.description ? ` — ${pr.description.slice(0, 80)}` : ""}`);
    });
  }

  const trips = tripsRes.data;
  if (trips?.length) {
    lines.push("\nVIAGENS:");
    trips.forEach((t: any, i: number) => {
      lines.push(`${i + 1}. ${t.destination}${t.country ? `, ${t.country}` : ""} [${t.status}]${t.dates ? ` (${t.dates})` : ""}`);
    });
  }

  const health = healthRes.data;
  if (health?.length) {
    lines.push("\nCONSULTAS DE SAÚDE:");
    health.forEach((h: any, i: number) => {
      lines.push(`${i + 1}. ${h.provider}${h.specialty ? ` (${h.specialty})` : ""} [${h.type}]${h.date ? ` em ${h.date}` : ""}`);
    });
  }

  const social = socialRes.data;
  if (social?.length) {
    lines.push("\nEVENTOS SOCIAIS:");
    social.forEach((s: any, i: number) => {
      lines.push(`${i + 1}. ${s.title}${s.date ? ` (${s.date})` : ""}${s.location ? ` — ${s.location}` : ""} [RSVP: ${s.rsvp}]`);
    });
  }

  const props = propertiesRes.data;
  if (props?.length) {
    lines.push("\nPROPRIEDADES:");
    props.forEach((p: any, i: number) => {
      lines.push(`${i + 1}. ${p.name}${p.type ? ` (${p.type})` : ""}${p.city ? `, ${p.city}` : ""}${p.country ? `, ${p.country}` : ""}${p.valuation ? ` — valor: R$${p.valuation}` : ""}`);
    });
  }

  const journal = journalRes.data;
  if (journal?.length) {
    lines.push("\nÚLTIMAS ENTRADAS DO DIÁRIO:");
    journal.forEach((j: any, i: number) => {
      const date = j.created_at?.slice(0, 10) || "";
      lines.push(`${i + 1}. ${date}${j.mood ? ` [humor: ${j.mood}]` : ""}: ${j.content.slice(0, 100)}...`);
    });
  }

  const fp = founderProfileRes.data;
  if (fp) {
    lines.push("\nPERFIL FOUNDER:");
    lines.push(`Nome: ${fp.name}, Construindo: ${fp.building || "N/A"}`);
    if (fp.industry?.length) lines.push(`Indústrias: ${fp.industry.join(", ")}`);
    if (fp.skills?.length) lines.push(`Skills: ${fp.skills.join(", ")}`);
    if (fp.looking_for?.length) lines.push(`Buscando: ${fp.looking_for.join(", ")}`);
    lines.push(`Compromisso: ${fp.commitment || "N/A"}`);
  }

  const connCount = connectionsRes.count ?? 0;
  if (connCount > 0) lines.push(`\nCONEXÕES FOUNDER: ${connCount} conexões aceitas`);

  const opps = opportunitiesRes.data;
  if (opps?.length) {
    lines.push("\nOPORTUNIDADES PUBLICADAS:");
    opps.forEach((o: any, i: number) => {
      lines.push(`${i + 1}. ${o.title}${o.project ? ` (projeto: ${o.project})` : ""}`);
    });
  }

  const notifs = notificationsRes.data;
  if (notifs?.length) {
    lines.push(`\nNOTIFICAÇÕES NÃO LIDAS: ${notifs.length}`);
  }

  lines.push("--- FIM DO CONTEXTO ---");

  return lines.join("\n");
}

async function getUserMemories(userId: string): Promise<string> {
  const sc = createServiceClient();
  const { data } = await sc
    .from("ai_memories")
    .select("content, category, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (!data || data.length === 0) return "";

  const lines: string[] = ["\n\n--- MEMÓRIAS DA IA (fatos aprendidos em conversas anteriores) ---"];
  data.forEach((m: any, i: number) => {
    lines.push(`${i + 1}. [${m.category || "fato"}] ${m.content}`);
  });
  lines.push("--- FIM DAS MEMÓRIAS ---");
  lines.push("Use essas memórias naturalmente nas suas respostas. Não liste todas — apenas use quando relevante.");

  return lines.join("\n");
}

async function extractAndSaveMemories(userId: string, conversation: any[], conversationId: string | null): Promise<{ saved: number }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return { saved: 0 };

  // Get last 6 messages for extraction
  const recentMsgs = conversation.slice(-6);
  const conversationText = recentMsgs.map((m: any) => `${m.role}: ${m.content}`).join("\n");

  const extractionPrompt = `Analise a conversa abaixo e extraia FATOS IMPORTANTES sobre o usuário que devem ser lembrados em futuras conversas.

Exemplos de fatos úteis:
- Preferências pessoais ("prefere acordar às 5h", "gosta de café sem açúcar")
- Informações profissionais ("trabalha com IA", "startup é no setor de saúde")
- Decisões tomadas ("decidiu focar em marketing digital")
- Metas pessoais ("quer ler 50 livros este ano")
- Fatos sobre a vida ("tem 2 filhos", "mora em São Paulo")

NÃO extraia:
- Informações genéricas ou óbvias
- Perguntas que o usuário fez sem revelar algo sobre si
- Conteúdo que a IA gerou (foque no que o USUÁRIO disse)

Responda APENAS com um JSON array. Se não houver fatos relevantes, retorne [].
Formato: [{"content": "fato aqui", "category": "preferencia|fato|decisao|meta"}]

CONVERSA:
${conversationText}`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: extractionPrompt }],
        stream: false,
      }),
    });

    if (!resp.ok) return { saved: 0 };

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { saved: 0 };

    const facts = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(facts) || facts.length === 0) return { saved: 0 };

    const sc = createServiceClient();
    
    // Check for duplicates by comparing content
    const { data: existing } = await sc
      .from("ai_memories")
      .select("content")
      .eq("user_id", userId);
    
    const existingContents = new Set((existing || []).map((e: any) => e.content.toLowerCase().trim()));
    
    const newFacts = facts.filter((f: any) => 
      f.content && 
      typeof f.content === "string" && 
      f.content.length > 5 && 
      !existingContents.has(f.content.toLowerCase().trim())
    );

    if (newFacts.length === 0) return { saved: 0 };

    const rows = newFacts.slice(0, 5).map((f: any) => ({
      user_id: userId,
      content: f.content.slice(0, 500),
      category: ["preferencia", "fato", "decisao", "meta"].includes(f.category) ? f.category : "fato",
      source_conversation_id: conversationId || null,
    }));

    await sc.from("ai_memories").insert(rows);
    return { saved: rows.length };
  } catch (e) {
    console.error("Memory extraction error:", e);
    return { saved: 0 };
  }
}

async function fetchNewsArticles(query: string, pageSize = 6): Promise<string> {
  const apiKey = Deno.env.get("NEWSAPI_KEY");
  if (!apiKey) { console.error("NEWSAPI_KEY not configured"); return ""; }
  try {
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", query);
    url.searchParams.set("language", "pt");
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("apiKey", apiKey);
    const resp = await fetch(url.toString());
    if (!resp.ok) { const t = await resp.text(); console.error("NewsAPI error:", resp.status, t); return ""; }
    const data = await resp.json();
    if (!data.articles || data.articles.length === 0) return "";
    return data.articles
      .map((a: any, i: number) => `${i + 1}. **${a.title}** (${a.source?.name || "Fonte desconhecida"}, ${a.publishedAt?.slice(0, 10) || ""})\n   ${a.description || "Sem descrição."}\n   URL: ${a.url || ""}`)
      .join("\n\n");
  } catch (e) { console.error("NewsAPI fetch error:", e); return ""; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email ?? "";
    const body = await req.json();
    const { messages, requireTier, newsContext, newsQuery, includeContext, extractMemories, conversation, conversationId } = body;

    // --- MEMORY EXTRACTION ENDPOINT ---
    if (extractMemories && conversation) {
      const result = await extractAndSaveMemories(userId, conversation, conversationId || null);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- SUBSCRIPTION CHECK ---
    const plan = await getUserPlan(userId, userEmail);

    if (requireTier && tierIndex(plan) < tierIndex(requireTier)) {
      return new Response(JSON.stringify({ error: "Upgrade required to access this feature." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- DAILY LIMIT for free/basic users ---
    if (plan === "free" || plan === "basic") {
      const serviceClient = createServiceClient();
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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // --- USER CONTEXT (optional) ---
    let contextInjection = "";
    if (includeContext) {
      try {
        contextInjection = await getUserContext(userId, plan);
      } catch (e) {
        console.error("Error fetching user context:", e);
      }
    }

    // --- USER MEMORIES ---
    let memoriesInjection = "";
    if (includeContext) {
      try {
        memoriesInjection = await getUserMemories(userId);
      } catch (e) {
        console.error("Error fetching user memories:", e);
      }
    }

    // --- NEWS CONTEXT (optional) ---
    let newsInjection = "";
    if (newsContext && newsQuery) {
      const articles = await fetchNewsArticles(newsQuery);
      if (articles) {
        newsInjection = `\n\n--- NOTÍCIAS REAIS E ATUALIZADAS (use como base para sua resposta) ---\n${articles}\n--- FIM DAS NOTÍCIAS ---\n\nIMPORTANTE: Baseie sua resposta nas notícias reais acima. Cite fontes quando possível. Não invente informações.`;
      }
    }

    // --- BUILD MESSAGES ---
    const contextSuffix = (includeContext ? CONTEXT_INSTRUCTIONS : "") + contextInjection + memoriesInjection + newsInjection;

    const systemContent = messages[0]?.role === "system"
      ? messages[0].content + contextSuffix
      : SYSTEM_PROMPT + contextSuffix;

    const finalMessages = messages[0]?.role === "system"
      ? [{ role: "system", content: systemContent }, ...messages.slice(1)]
      : [{ role: "system", content: systemContent }, ...messages];

    // --- AI REQUEST ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        messages: finalMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("azera-ai error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
