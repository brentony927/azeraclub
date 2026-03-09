import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FounderChat from "@/components/FounderChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, ArrowLeft } from "lucide-react";
import FounderParticlesBackground from "@/components/FounderParticlesBackground";

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export default function FounderMessages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<{ userId: string; name: string } | null>(
    (location.state as any)?.userId
      ? { userId: (location.state as any).userId, name: (location.state as any).userName || "Fundador" }
      : (location.state as any)?.selectedUser
        ? { userId: (location.state as any).selectedUser, name: (location.state as any).selectedUserName || "Fundador" }
        : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch blocked users
      const { data: blocks } = await supabase
        .from("user_blocks")
        .select("blocked_id")
        .eq("blocker_id", user.id);

      const blocked = new Set<string>(blocks?.map(b => b.blocked_id) || []);
      setBlockedIds(blocked);

      // Fetch messages
      const { data: msgs } = await supabase
        .from("founder_messages")
        .select("*")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!msgs) { setLoading(false); return; }

      const convMap = new Map<string, { lastMsg: string; lastAt: string; unread: number }>();
      const userIds = new Set<string>();

      msgs.forEach(m => {
        const otherId = m.from_user_id === user.id ? m.to_user_id : m.from_user_id;
        if (blocked.has(otherId)) return; // Skip blocked users
        userIds.add(otherId);
        if (!convMap.has(otherId)) {
          convMap.set(otherId, { lastMsg: m.content, lastAt: m.created_at, unread: 0 });
        }
        if (m.to_user_id === user.id && !m.read) {
          const c = convMap.get(otherId)!;
          c.unread++;
        }
      });

      if (userIds.size > 0) {
        const { data: profiles } = await supabase
          .from("founder_profiles")
          .select("user_id, name")
          .in("user_id", Array.from(userIds));

        const nameMap = new Map<string, string>();
        profiles?.forEach(p => nameMap.set(p.user_id, p.name));

        const convList: Conversation[] = [];
        convMap.forEach((val, odId) => {
          convList.push({
            userId: odId,
            name: nameMap.get(odId) || "Fundador",
            lastMessage: val.lastMsg,
            lastAt: val.lastAt,
            unread: val.unread,
          });
        });

        setConversations(convList);

        if (selectedUser && !convMap.has(selectedUser.userId) && !blocked.has(selectedUser.userId)) {
          setConversations(prev => [
            { userId: selectedUser.userId, name: selectedUser.name, lastMessage: "", lastAt: new Date().toISOString(), unread: 0 },
            ...prev,
          ]);
        }
      } else if (selectedUser && !blocked.has(selectedUser.userId)) {
        setConversations([
          { userId: selectedUser.userId, name: selectedUser.name, lastMessage: "", lastAt: new Date().toISOString(), unread: 0 },
        ]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleBlock = (userId: string) => {
    setBlockedIds(prev => new Set(prev).add(userId));
    setConversations(prev => prev.filter(c => c.userId !== userId));
    if (selectedUser?.userId === userId) setSelectedUser(null);
  };

  const handleDeleteConversation = (userId: string) => {
    setConversations(prev => prev.filter(c => c.userId !== userId));
    if (selectedUser?.userId === userId) setSelectedUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const showChatOnMobile = !!selectedUser;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <FounderParticlesBackground />
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6" /> Mensagens
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        <Card className={`border-border/50 bg-card/80 backdrop-blur-sm overflow-y-auto ${showChatOnMobile ? "hidden md:block" : ""}`}>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma conversa ainda.</div>
          ) : (
            conversations.map(c => (
              <button
                key={c.userId}
                onClick={() => setSelectedUser({ userId: c.userId, name: c.name })}
                className={`w-full text-left p-4 border-b border-border/30 hover:bg-secondary/50 transition-colors ${
                  selectedUser?.userId === c.userId ? "bg-secondary/70" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-foreground">{c.name}</p>
                  {c.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">{c.unread}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
              </button>
            ))
          )}
        </Card>

        <Card className={`border-border/50 bg-card/80 backdrop-blur-sm md:col-span-2 overflow-hidden ${!showChatOnMobile ? "hidden md:block" : ""}`}>
          {selectedUser ? (
            <>
              <div className="md:hidden p-2 border-b border-border/30">
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              </div>
              <FounderChat
                otherUserId={selectedUser.userId}
                otherUserName={selectedUser.name}
                onBlock={handleBlock}
                onDeleteConversation={handleDeleteConversation}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Selecione uma conversa para começar.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
