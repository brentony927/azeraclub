import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Lock, MoreVertical, Trash2, Ban, Flag, AlertTriangle, UserPlus } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportUserDialog from "@/components/ReportUserDialog";

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
  onBlock?: (userId: string) => void;
  onDeleteConversation?: (userId: string) => void;
  isOtherOwner?: boolean;
  isMeOwner?: boolean;
  otherUserAvatar?: string | null;
}

const WEEKLY_LIMIT = 10;

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default function FounderChat({ otherUserId, otherUserName, onBlock, onDeleteConversation, isOtherOwner, isMeOwner, otherUserAvatar }: FounderChatProps) {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  const [addToGroupOpen, setAddToGroupOpen] = useState(false);
  const [myGroups, setMyGroups] = useState<{ id: string; name: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isFounder = !canAccess("pro");
  const remaining = Math.max(0, WEEKLY_LIMIT - weeklyCount);

  useEffect(() => {
    if (!user) return;
    supabase.from("founder_profiles").select("avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.avatar_url) setMyAvatar(data.avatar_url); });
  }, [user]);

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
    if (isFounder && weeklyCount >= WEEKLY_LIMIT) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-founder-message", {
        body: { to_user_id: otherUserId, content: newMsg.trim() },
      });

      if (error) {
        console.error("Failed to send message:", error);
        setSending(false);
        return;
      }

      if (data?.blocked) {
        toast({ title: "Bloqueado", description: "Não é possível enviar mensagens para este utilizador.", variant: "destructive" });
        setSending(false);
        return;
      }

      if (data?.limit_reached) {
        setWeeklyCount(WEEKLY_LIMIT);
        setSending(false);
        return;
      }

      if (data?.message) {
        setMessages(prev => [...prev, data.message]);
        if (isFounder) setWeeklyCount(prev => prev + 1);
      }
      setNewMsg("");
    } catch (err) {
      console.error("Send message error:", err);
    }
    setSending(false);
  };

  const handleDeleteConversation = async () => {
    if (!user) return;
    await supabase
      .from("founder_messages")
      .delete()
      .eq("from_user_id", user.id)
      .eq("to_user_id", otherUserId);

    setMessages([]);
    toast({ title: "Conversa apagada", description: "As suas mensagens foram removidas." });
    onDeleteConversation?.(otherUserId);
  };

  const handleBlock = async () => {
    if (!user) return;
    const { error } = await supabase.from("user_blocks").insert({
      blocker_id: user.id,
      blocked_id: otherUserId,
    });

    if (error && error.code === "23505") {
      toast({ title: "Já bloqueado", description: "Este utilizador já está bloqueado." });
    } else if (!error) {
      toast({ title: "Utilizador bloqueado", description: `${otherUserName} foi bloqueado.` });
      onBlock?.(otherUserId);
    }
  };

  const loadMyGroups = async () => {
    if (!user) return;
    const { data: memberRows } = await (supabase.from("message_group_members") as any)
      .select("group_id")
      .eq("user_id", user.id)
      .or("role.eq.admin,role.eq.admin");

    if (!memberRows || memberRows.length === 0) { setMyGroups([]); return; }

    const groupIds = memberRows.map((r: any) => r.group_id);
    const { data: groupsData } = await (supabase.from("message_groups") as any)
      .select("id, name")
      .in("id", groupIds);

    setMyGroups((groupsData || []) as { id: string; name: string }[]);
  };

  const handleAddToGroup = async (groupId: string) => {
    const { error } = await (supabase.from("message_group_members") as any).insert({
      group_id: groupId,
      user_id: otherUserId,
      role: "member",
    });

    if (error && error.code === "23505") {
      toast({ title: "Já é membro", description: `${otherUserName} já está neste grupo.` });
    } else if (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar ao grupo.", variant: "destructive" });
    } else {
      toast({ title: "Adicionado!", description: `${otherUserName} foi adicionado ao grupo.` });
    }
    setAddToGroupOpen(false);
  };

  const limitReached = isFounder && weeklyCount >= WEEKLY_LIMIT;

  return (
    <div className="flex flex-col h-full">
      {/* Header with actions */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <button
          onClick={() => navigate(`/founder-profile/${otherUserId}`)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-8 w-8">
            {otherUserAvatar ? <AvatarImage src={otherUserAvatar} /> : null}
            <AvatarFallback className="text-xs">{otherUserName?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-foreground">{otherUserName}</h3>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/founder-profile/${otherUserId}`)}>
              Ver Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { loadMyGroups(); setAddToGroupOpen(true); }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar a Grupo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteConversation} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Apagar Conversa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBlock} className="text-destructive focus:text-destructive">
              <Ban className="h-4 w-4 mr-2" />
              Bloquear Utilizador
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setReportOpen(true)}>
              <Flag className="h-4 w-4 mr-2" />
              Denunciar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-start gap-2">
        <Icon3D icon={AlertTriangle} color="silver" size="xs" className="mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground">Cuidado com informações pessoais. A AZERA não verifica identidades nem se responsabiliza por interações entre utilizadores.</p>
      </div>

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
          const isOwnerMsg = isMine ? isMeOwner : isOtherOwner;
          const avatar = isMine ? myAvatar : otherUserAvatar;
          const initials = isMine ? "Eu" : otherUserName?.charAt(0)?.toUpperCase() || "?";
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
              {!isMine && (
                <button onClick={() => navigate(`/founder-profile/${otherUserId}`)} className="shrink-0 hover:opacity-80 transition-opacity">
                  <Avatar className="h-6 w-6">
                    {avatar ? <AvatarImage src={avatar} /> : null}
                    <AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              )}
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                isOwnerMsg
                  ? "owner-message rounded-br-md"
                  : isMine
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isOwnerMsg ? "text-white/60" : isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {format(new Date(msg.created_at), "HH:mm")}
                </p>
              </div>
              {isMine && (
                <Avatar className="h-6 w-6 shrink-0">
                  {avatar ? <AvatarImage src={avatar} /> : null}
                  <AvatarFallback className="text-[9px]">Eu</AvatarFallback>
                </Avatar>
              )}
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

      {/* Report dialog */}
      <ReportUserDialog
        reportedUserId={otherUserId}
        reportedUserName={otherUserName}
        open={reportOpen}
        onOpenChange={setReportOpen}
        trigger={<span className="hidden" />}
      />

      {/* Add to group dialog */}
      <Dialog open={addToGroupOpen} onOpenChange={setAddToGroupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar {otherUserName} a um grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {myGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Você não administra nenhum grupo.</p>
            ) : (
              myGroups.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleAddToGroup(g.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors text-foreground"
                >
                  {g.name}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
