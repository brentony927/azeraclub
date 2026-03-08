import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FounderChat from "@/components/FounderChat";
import { Card } from "@/components/ui/card";
import { MessageCircle, Loader2 } from "lucide-react";
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
  const [selectedUser, setSelectedUser] = useState<{ userId: string; name: string } | null>(
    (location.state as any)?.userId ? { userId: (location.state as any).userId, name: (location.state as any).userName || "Fundador" } : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      // Get all messages involving this user
      const { data: msgs } = await supabase
        .from("founder_messages")
        .select("*")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!msgs) { setLoading(false); return; }

      // Group by other user
      const convMap = new Map<string, { lastMsg: string; lastAt: string; unread: number }>();
      const userIds = new Set<string>();

      msgs.forEach(m => {
        const otherId = m.from_user_id === user.id ? m.to_user_id : m.from_user_id;
        userIds.add(otherId);
        if (!convMap.has(otherId)) {
          convMap.set(otherId, { lastMsg: m.content, lastAt: m.created_at, unread: 0 });
        }
        if (m.to_user_id === user.id && !m.read) {
          const c = convMap.get(otherId)!;
          c.unread++;
        }
      });

      // Fetch names from founder_profiles
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

        // If navigated with state and user not in list, add it
        if (selectedUser && !convMap.has(selectedUser.userId)) {
          setConversations(prev => [{ userId: selectedUser.userId, name: selectedUser.name, lastMessage: "", lastAt: new Date().toISOString(), unread: 0 }, ...prev]);
        }
      }
      setLoading(false);
    };
    fetchConversations();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <FounderParticlesBackground />
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6" /> Mensagens
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Conversation list */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-y-auto">
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

        {/* Chat area */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm md:col-span-2 overflow-hidden">
          {selectedUser ? (
            <FounderChat otherUserId={selectedUser.userId} otherUserName={selectedUser.name} />
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
