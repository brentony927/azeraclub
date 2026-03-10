import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Trash2, Plus, PanelLeftClose, PanelLeft, ArrowLeft, Lock, Brain, X, Smile, CloudSun, Lightbulb, Frown, Flame, Briefcase } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

const MEMORY_EXTRACT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

type Msg = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; mood: string | null; created_at: string; updated_at: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const DAILY_LIMIT_BASIC = 20;

const MOODS = [
  { id: "feliz", label: "Feliz", icon: Smile, color: "green" as const },
  { id: "calmo", label: "Calmo", icon: CloudSun, color: "blue" as const },
  { id: "focado", label: "Focado", icon: Lightbulb, color: "gold" as const },
  { id: "triste", label: "Triste", icon: Frown, color: "silver" as const },
  { id: "motivado", label: "Motivado", icon: Flame, color: "red" as const },
  { id: "ceo", label: "CEO Mode", icon: Briefcase, color: "gold" as const, minTier: "business" as const },
];

const SUGGESTIONS = [
  "Analise minha semana",
  "Planeje minha semana",
  "Gere ideias de negócio",
  "Estratégia de networking",
  "Dicas de produtividade",
];

function moodSystemPrompt(moodId: string | null): string | undefined {
  if (!moodId) return undefined;
  if (moodId === "ceo") {
    return `ATIVE O CEO MODE. Você agora é um conselheiro executivo de altíssimo nível. Seja EXTREMAMENTE estratégico, direto e sem rodeios. Foque em: decisões de negócios, produtividade máxima, delegação inteligente, crescimento acelerado. Tom: assertivo, confiante, sem floreios. Cada resposta deve ter: 1) Análise rápida 2) Decisão recomendada 3) Próximos passos concretos. Pense como um CEO de uma empresa bilionária.`;
  }
  const mood = MOODS.find((m) => m.id === moodId);
  if (!mood) return undefined;
  return `O usuário está se sentindo ${mood.label.toLowerCase()}. Adapte suas respostas ao tom emocional dele, sendo empático e adequado ao humor atual.`;
}

async function streamChat({ messages, systemPrompt, onDelta, onDone }: { messages: Msg[]; systemPrompt?: string; onDelta: (t: string) => void; onDone: () => void }) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Faça login para usar o chat.");

  const systemMsg = systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : [];
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages: [...systemMsg, ...messages], includeContext: true }),
  });
  if (!resp.ok) { const d = await resp.json().catch(() => ({})); throw new Error(d.error || `Erro ${resp.status}`); }
  if (!resp.body) throw new Error("Sem corpo de resposta");
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "", done = false;
  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) onDelta(c); }
      catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

export default function AI() {
  const { user } = useAuth();
  const { plan, canAccess } = useSubscription();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [dailyCount, setDailyCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [memories, setMemories] = useState<{ id: string; content: string; category: string; created_at: string }[]>([]);
  const [showMemories, setShowMemories] = useState(false);

  const isBasicPlan = !canAccess("pro");
  const remainingMessages = DAILY_LIMIT_BASIC - dailyCount;
  const isLimitReached = isBasicPlan && dailyCount >= DAILY_LIMIT_BASIC;

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  // Count today's messages for Basic plan limit
  useEffect(() => {
    if (!user || !isBasicPlan) return;
    const today = format(new Date(), "yyyy-MM-dd");
    supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user")
      .gte("created_at", `${today}T00:00:00`)
      .then(({ count }) => { if (count !== null) setDailyCount(count); });
  }, [user, isBasicPlan]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (data) setConversations(data as Conversation[]);
  }, [user]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Load memories
  const loadMemories = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ai_memories")
      .select("id, content, category, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setMemories(data as any);
  }, [user]);

  useEffect(() => { loadMemories(); }, [loadMemories]);

  const deleteMemory = async (id: string) => {
    await supabase.from("ai_memories").delete().eq("id", id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const triggerMemoryExtraction = async (conv: Msg[], convId: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      await fetch(MEMORY_EXTRACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ extractMemories: true, conversation: conv, conversationId: convId }),
      });
      loadMemories();
    } catch (e) { console.error("Memory extraction failed:", e); }
  };

  const loadConversation = async (convId: string) => {
    setActiveConvId(convId);
    const conv = conversations.find((c) => c.id === convId);
    if (conv?.mood) setActiveMood(conv.mood);
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })));
    }
    if (isMobile) setSidebarOpen(false);
  };

  const deleteConversation = async (convId: string) => {
    await supabase.from("ai_conversations").delete().eq("id", convId);
    if (activeConvId === convId) { setActiveConvId(null); setMessages([]); setActiveMood(null); }
    loadConversations();
  };

  const newConversation = () => { setActiveConvId(null); setMessages([]); setActiveMood(null); setInput(""); };

  const send = async (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text || isLoading || !user) return;

    if (isLimitReached) {
      toast.error("Você atingiu o limite diário de inteligência.", {
        description: "Faça upgrade para o Pro para mensagens ilimitadas.",
        action: { label: "Fazer Upgrade", onClick: () => navigate("/planos") },
      });
      return;
    }

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    if (isBasicPlan) setDailyCount((c) => c + 1);

    let convId = activeConvId;
    if (!convId) {
      const title = text.length > 50 ? text.slice(0, 50) + "…" : text;
      const { data } = await supabase.from("ai_conversations").insert({ user_id: user.id, title, mood: activeMood }).select().single();
      if (data) { convId = data.id; setActiveConvId(data.id); loadConversations(); }
    }

    if (convId) {
      await supabase.from("chat_messages").insert({ user_id: user.id, content: text, role: "user", conversation_id: convId });
    }

    const systemPrompt = moodSystemPrompt(activeMood);
    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        systemPrompt,
        onDelta: upsert,
        onDone: async () => {
          setIsLoading(false);
          if (convId && assistantSoFar) {
            await supabase.from("chat_messages").insert({ user_id: user!.id, content: assistantSoFar, role: "assistant", conversation_id: convId });
            await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
            // Fire-and-forget memory extraction
            triggerMemoryExtraction([...messages, userMsg, { role: "assistant", content: assistantSoFar }], convId);
          }
        },
      });
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e.message || "Erro ao comunicar com AZR AI");
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col border-r border-border/40 bg-card/50 overflow-hidden shrink-0 ${isMobile ? "absolute inset-0 z-50 bg-background" : ""}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h2 className="text-[13px] font-semibold text-foreground">Histórico</h2>
              <div className="flex items-center gap-1">
                <button onClick={newConversation} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Nova conversa">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {conversations.length === 0 && (
                <p className="text-[11px] text-muted-foreground text-center mt-8 px-4">Nenhuma conversa ainda.</p>
              )}
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-[13px] ${
                    activeConvId === conv.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{conv.title}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 max-md:opacity-70 p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all shrink-0 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Excluir conversa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Memories section */}
            <div className="border-t border-border/30 p-3">
              <button
                onClick={() => setShowMemories(!showMemories)}
                className="flex items-center justify-between w-full text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5" />
                  Memórias
                  {memories.length > 0 && (
                    <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">{memories.length}</span>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {showMemories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
                      {memories.length === 0 && (
                        <p className="text-[10px] text-muted-foreground/60 text-center py-2">A IA ainda não aprendeu fatos sobre você.</p>
                      )}
                      {memories.map((mem) => (
                        <div key={mem.id} className="group flex items-start gap-1.5 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-foreground/80 leading-tight">{mem.content}</p>
                            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{mem.category}</p>
                          </div>
                          <button
                            onClick={() => deleteMemory(mem.id)}
                            className="opacity-0 group-hover:opacity-100 max-md:opacity-70 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <PanelLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button onClick={() => navigate("/dashboard")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-[13px] font-semibold text-foreground">AZR AI</span>
          {activeMood && (
            <span className="text-[11px] text-muted-foreground ml-2 flex items-center gap-1">
              <Icon3D icon={MOODS.find((m) => m.id === activeMood)?.icon || Smile} color={MOODS.find((m) => m.id === activeMood)?.color || "gold"} size="xs" />
              {MOODS.find((m) => m.id === activeMood)?.label}
            </span>
          )}
          {isBasicPlan && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              {remainingMessages > 0 ? `${remainingMessages} mensagens restantes hoje` : "Limite atingido"}
            </span>
          )}
        </div>

        {/* Messages or empty state */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-center"
              >
                O que posso fazer
                <br />
                por você?
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl mt-8"
              >
                <form onSubmit={(e) => { e.preventDefault(); send(); }}
                  className="flex items-end gap-2 rounded-2xl border border-border bg-background px-4 py-3 focus-within:border-ring/50 transition-colors"
                  style={{ boxShadow: "0 2px 12px 0 hsla(0,0%,0%,0.06)" }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Pergunte ao AZR AI..."
                    rows={1}
                    className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed min-h-[24px] max-h-[120px]"
                    disabled={isLoading || isLimitReached}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || isLimitReached}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-30 hover:opacity-80 transition-opacity shrink-0"
                  >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </form>
              </motion.div>

              {/* Limit reached banner */}
              {isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl border border-[hsl(42,50%,56%)]/30 bg-[hsl(42,50%,56%)]/10 text-center max-w-xl"
                >
                  <p className="text-sm font-medium text-foreground mb-1">Você atingiu o limite diário de inteligência 🔒</p>
                  <p className="text-xs text-muted-foreground mb-3">Faça upgrade para o Pro para mensagens ilimitadas.</p>
                  <button onClick={() => navigate("/planos")} className="text-xs font-medium px-4 py-2 rounded-full bg-[hsl(42,50%,56%)] text-[hsl(0,0%,4%)] hover:opacity-90 transition-opacity">
                    Fazer Upgrade para Pro
                  </button>
                </motion.div>
              )}

              {/* Suggestions */}
              {!isLimitReached && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-2 mt-4">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-[12px] px-3.5 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all hover:bg-secondary/50">
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Moods */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap justify-center gap-2 mt-6">
                {MOODS.map((mood) => {
                  const locked = mood.minTier && !canAccess(mood.minTier);
                  return (
                    <button
                      key={mood.id}
                      onClick={() => {
                        if (locked) { toast.error(`${mood.label} disponível no plano ${mood.minTier === "business" ? "Business" : "Pro"} ou superior.`, { action: { label: "Ver Planos", onClick: () => navigate("/planos") } }); return; }
                        setActiveMood(activeMood === mood.id ? null : mood.id);
                      }}
                      className={`text-[12px] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                        locked ? "opacity-50 cursor-not-allowed" :
                        activeMood === mood.id
                          ? "bg-foreground text-background"
                          : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon3D icon={mood.icon} color={mood.color} size="xs" /> {mood.label}
                      {locked && <Lock className="h-3 w-3 ml-0.5" />}
                    </button>
                  );
                })}
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-[16px] rounded-br-[4px]"
                      : "bg-secondary text-foreground rounded-[16px] rounded-bl-[4px]"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-secondary px-4 py-2.5 rounded-[16px] rounded-bl-[4px]">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom input (when chatting) */}
        {hasMessages && (
          <div className="px-4 py-3 border-t border-border/30 pb-safe mb-16 md:mb-0">
            {isLimitReached ? (
              <div className="max-w-3xl mx-auto p-3 rounded-xl border border-[hsl(42,50%,56%)]/30 bg-[hsl(42,50%,56%)]/10 text-center">
                <p className="text-xs font-medium text-foreground mb-1">Limite diário atingido 🔒</p>
                <button onClick={() => navigate("/planos")} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[hsl(42,50%,56%)] text-[hsl(0,0%,4%)] hover:opacity-90 transition-opacity">
                  Upgrade para Pro
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={(e) => { e.preventDefault(); send(); }}
                  className="max-w-3xl mx-auto flex items-end gap-2 rounded-2xl border border-border bg-background px-4 py-3 focus-within:border-ring/50 transition-colors"
                  style={{ boxShadow: "0 1px 4px 0 hsla(0,0%,0%,0.04)" }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Pergunte ao AZR AI..."
                    rows={1}
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed min-h-[24px] max-h-[120px]"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-30 hover:opacity-80 transition-opacity shrink-0"
                  >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </form>
                <div className="max-w-3xl mx-auto flex flex-wrap gap-2 mt-2 justify-center">
                  {MOODS.map((mood) => {
                    const locked = mood.minTier && !canAccess(mood.minTier);
                    return (
                      <button
                        key={mood.id}
                        onClick={() => {
                          if (locked) { toast.error(`${mood.label} disponível no plano ${mood.minTier === "business" ? "Business" : "Pro"} ou superior.`); return; }
                          setActiveMood(activeMood === mood.id ? null : mood.id);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                          locked ? "opacity-50 cursor-not-allowed" :
                          activeMood === mood.id
                            ? "bg-foreground text-background"
                            : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Icon3D icon={mood.icon} color={mood.color} size="xs" /> {mood.label}
                        {locked && <Lock className="h-2.5 w-2.5 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
