import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Settings, Users, UserMinus, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface GroupMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  name?: string;
}

interface Props {
  groupId: string;
  groupName: string;
  ownerUserId?: string;
}

export default function GroupChat({ groupId, groupName, ownerUserId }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myRole, setMyRole] = useState<string>("member");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchAll = async () => {
    const [msgsRes, membersRes] = await Promise.all([
      supabase.from("group_messages" as any).select("*").eq("group_id", groupId).order("created_at", { ascending: true }),
      supabase.from("message_group_members" as any).select("*").eq("group_id", groupId),
    ]);

    const msgs = (msgsRes.data || []) as unknown as GroupMessage[];
    const mems = (membersRes.data || []) as unknown as GroupMember[];
    setMessages(msgs);
    setMembers(mems);

    const me = mems.find(m => m.user_id === user?.id);
    if (me) setMyRole(me.role);

    const userIds = [...new Set([...msgs.map(m => m.user_id), ...mems.map(m => m.user_id)])];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", userIds);
      const map: Record<string, string> = {};
      profiles?.forEach(p => { map[p.user_id] = p.name; });
      setNames(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel(`group-${groupId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !input.trim()) return;
    setSending(true);
    await supabase.from("group_messages" as any).insert({
      group_id: groupId,
      user_id: user.id,
      content: input.trim(),
    });
    setInput("");
    setSending(false);
    fetchAll();
  };

  const handleToggleAdmin = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    await supabase.from("message_group_members" as any).update({ role: newRole }).eq("id", memberId);
    fetchAll();
    toast({ title: `Função atualizada para ${newRole}` });
  };

  const handleRemoveMember = async (memberId: string) => {
    await supabase.from("message_group_members" as any).delete().eq("id", memberId);
    fetchAll();
    toast({ title: "Membro removido" });
  };

  const isAdmin = myRole === "admin";

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/30 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-foreground">{groupName}</p>
          <p className="text-[10px] text-muted-foreground">{members.length} membros</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Membros</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{names[m.user_id] || "Founder"}</span>
                    {m.role === "admin" && <Badge variant="secondary" className="text-[9px]">Admin</Badge>}
                  </div>
                  {isAdmin && m.user_id !== user?.id && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggleAdmin(m.id, m.role)}>
                        <ShieldCheck className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveMember(m.id)}>
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(m => {
          const isMe = m.user_id === user?.id;
          const isOwnerMsg = ownerUserId && m.user_id === ownerUserId;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                isOwnerMsg
                  ? "owner-message"
                  : isMe ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}>
                {!isMe && <p className={`text-[10px] font-medium mb-0.5 ${isOwnerMsg ? "text-white/70" : "opacity-70"}`}>{names[m.user_id] || "Founder"}</p>}
                <p>{m.content}</p>
                <p className={`text-[9px] mt-0.5 ${isOwnerMsg ? "text-white/60" : isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/30 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Mensagem..."
          maxLength={2000}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <Button size="icon" onClick={handleSend} disabled={sending || !input.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
