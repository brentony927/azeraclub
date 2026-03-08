import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";

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

export default function FounderChat({ otherUserId, otherUserName }: FounderChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    fetchMessages();

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
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "founder_messages" }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.from_user_id === user.id && msg.to_user_id === otherUserId) ||
          (msg.from_user_id === otherUserId && msg.to_user_id === user.id)
        ) {
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
    setSending(true);
    await supabase.from("founder_messages").insert({
      from_user_id: user.id,
      to_user_id: otherUserId,
      content: newMsg.trim(),
    });
    setNewMsg("");
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">{otherUserName}</h3>
      </div>
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
      </div>
    </div>
  );
}
