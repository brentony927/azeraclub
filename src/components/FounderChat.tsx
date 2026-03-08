import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Lock } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface FounderChatProps {
  otherUserId: string;
  otherUserName: string;
}

const WEEKLY_LIMIT = 10;

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default function FounderChat({ otherUserId, otherUserName }: FounderChatProps) {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isFounder = !canAccess("pro");
  const remaining = Math.max(0, WEEKLY_LIMIT - weeklyCount);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("founder_messages")
        .select("*")
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };

    const fetchWeeklyCount = async () => {
      if (!isFounder) return;
      const weekStart = getWeekStart();
      const { data } = await supabase
        .from("weekly_message_limits")
        .select("message_count")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .maybeSingle();
      setWeeklyCount(data?.message_count || 0);
    };

    fetchMessages();
    fetchWeeklyCount();

    // Mark unread as read
    supabase
      .from("founder_messages")
      .update({ read: true })
      .eq("from_user_id", otherUserId)
      .eq("to_user_id", user.id)
      .eq("read", false)
      .then();

    const channel = supabase
      .channel(`chat-${[user.id, otherUserId].sort().join("-")}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "founder_messages",
        filter: `to_user_id=eq.${user.id}`,
      }, (payload) => {
        const msg = payload.new as Message;
        if (msg.from_user_id === otherUserId) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || sending) return;

    // Check weekly limit for Founder
    if (isFounder && weeklyCount >= WEEKLY_LIMIT) return;

    setSending(true);

    // Insert message
    const { data: inserted } = await supabase.from("founder_messages").insert({
      from_user_id: user.id,
      to_user_id: otherUserId,
      content: newMsg.trim(),
    }).select().single();

    if (inserted) {
      setMessages(prev => [...prev, inserted]);
    }

    // Update weekly count for Founder
    if (isFounder) {
      const weekStart = getWeekStart();
      const newCount = weeklyCount + 1;
      await supabase.from("weekly_message_limits").upsert({
        user_id: user.id,
        week_start: weekStart,
        message_count: newCount,
      }, { onConflict: "user_id,week_start" });
      setWeeklyCount(newCount);
    }

    setNewMsg("");
    setSending(false);
  };

  const limitReached = isFounder && weeklyCount >= WEEKLY_LIMIT;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">{otherUserName}</h3>
      </div>
      <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
        <p className="text-[10px] text-muted-foreground">⚠️ Cuidado com informações pessoais. A AZERA não verifica identidades nem se responsabiliza por interações entre utilizadores.</p>
      </div>

      {/* Weekly limit indicator for Founder */}
      {isFounder && (
        <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {remaining > 0 ? `${remaining}/${WEEKLY_LIMIT} mensagens restantes esta semana` : "Limite semanal atingido"}
          </span>
          {remaining <= 3 && (
            <button onClick={() => navigate("/planos")} className="text-[10px] text-primary font-semibold hover:underline">
              Upgrade → Ilimitado
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isMine = msg.from_user_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                isMine
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {format(new Date(msg.created_at), "HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border/50">
        {limitReached ? (
          <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-secondary/50">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Limite semanal atingido.</span>
            <button onClick={() => navigate("/planos")} className="text-xs text-primary font-semibold hover:underline">
              Fazer Upgrade
            </button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMsg.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
