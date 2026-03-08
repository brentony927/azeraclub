import { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

type ChatMsg = { id: string; venture_id: string; user_id: string; content: string; is_ai: boolean; created_at: string };
type VentureContext = { name: string; industry: string | null; problem: string | null; solution: string | null; goal: string | null };

export default function VentureChatTab({ ventureId, venture }: { ventureId: string; venture: VentureContext }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data } = await supabase.from("venture_chat").select("*").eq("venture_id", ventureId).order("created_at", { ascending: true });
    setMessages((data as ChatMsg[]) || []);
  };

  useEffect(() => { fetchMessages(); }, [ventureId]);

  useEffect(() => {
    const channel = supabase.channel(`venture-chat-${ventureId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "venture_chat", filter: `venture_id=eq.${ventureId}` },
        (payload) => setMessages(prev => [...prev, payload.new as ChatMsg])
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ventureId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!user || !text.trim()) return;
    await supabase.from("venture_chat").insert({ venture_id: ventureId, user_id: user.id, content: text });
    setText("");
  };

  // Note: venture_activity notifications for chat are handled by the generate-notifications edge function to avoid spam

  const askAI = async () => {
    if (!user) return;
    setAiLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const recentMsgs = messages.slice(-10).map(m => `${m.is_ai ? "AI" : "User"}: ${m.content}`).join("\n");
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `Você é o AI Co-Founder da startup "${venture.name}". Indústria: ${venture.industry || "N/A"}. Problema: ${venture.problem || "N/A"}. Solução: ${venture.solution || "N/A"}. Objetivo: ${venture.goal || "N/A"}. Responda como um consultor estratégico de startups, dando conselhos práticos e acionáveis.` },
            { role: "user", content: `Conversa recente da equipe:\n${recentMsgs}\n\nComo AI Co-Founder, dê sua análise e sugestões.` }
          ],
        }),
      });
      let aiText = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try { const j = JSON.parse(line.slice(6)); aiText += j.choices?.[0]?.delta?.content || ""; } catch {}
          }
        }
      }
      if (aiText) {
        await supabase.from("venture_chat").insert({ venture_id: ventureId, user_id: user.id, content: aiText, is_ai: true });
      }
    } catch { toast.error("Erro ao consultar AI Co-Founder"); }
    setAiLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Chat da Equipe</h3>
        <Button size="sm" variant="outline" onClick={askAI} disabled={aiLoading}>
          {aiLoading ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-1" /> : <Bot className="h-3.5 w-3.5 mr-1" />}
          Perguntar ao Co-Fundador IA
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 p-3 rounded-lg bg-muted/30 border border-border/30">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.user_id === user?.id && !msg.is_ai ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              msg.is_ai ? "bg-primary/10 border border-primary/20" :
              msg.user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}>
              {msg.is_ai && <Badge variant="outline" className="text-[9px] mb-1 gap-1"><Bot className="h-2.5 w-2.5" />Co-Fundador IA</Badge>}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] opacity-50 mt-1">{new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-3">
        <Input placeholder="Mensagem..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <Button onClick={sendMessage} disabled={!text.trim()}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
