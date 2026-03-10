import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FounderChat from "@/components/FounderChat";
import GroupChat from "@/components/GroupChat";
import MessageGroupDialog from "@/components/MessageGroupDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Loader2, ArrowLeft, Pin, PinOff, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { lazy, Suspense } from "react";
const FounderParticlesBackground = lazy(() => import("@/components/FounderParticlesBackground"));

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  isPinned?: boolean;
  opportunityTitle?: string;
  avatarUrl?: string | null;
}

interface GroupConversation {
  id: string;
  name: string;
  photo_url: string | null;
  lastMessage: string;
  lastAt: string;
  isPinned?: boolean;
}

export default function FounderMessages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [pinnedUserIds, setPinnedUserIds] = useState<Set<string>>(new Set());
  const [pinnedGroupIds, setPinnedGroupIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<{ userId: string; name: string } | null>(
    (location.state as any)?.userId
      ? { userId: (location.state as any).userId, name: (location.state as any).userName || "Fundador" }
      : (location.state as any)?.selectedUser
        ? { userId: (location.state as any).selectedUser, name: (location.state as any).selectedUserName || "Fundador" }
        : null
  );
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [connectedUsers, setConnectedUsers] = useState<{ userId: string; name: string }[]>([]);
  const [ownerUserId, setOwnerUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch owner
      const { data: ownerData } = await (supabase.from("founder_profiles") as any).select("user_id").eq("is_site_owner", true).limit(1);
      if (ownerData && ownerData.length > 0) setOwnerUserId(ownerData[0].user_id);

      // Fetch blocked users, pins, messages, groups in parallel
      const [blocksRes, pinsRes, msgsRes, groupMembersRes] = await Promise.all([
        supabase.from("user_blocks").select("blocked_id").eq("blocker_id", user.id),
        supabase.from("pinned_conversations" as any).select("*").eq("user_id", user.id),
        supabase.from("founder_messages").select("*").or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`).order("created_at", { ascending: false }),
        supabase.from("message_group_members" as any).select("group_id").eq("user_id", user.id),
      ]);

      const blocked = new Set<string>(blocksRes.data?.map((b: any) => b.blocked_id) || []);
      setBlockedIds(blocked);

      // Pins
      const pinned = new Set<string>();
      const pinnedG = new Set<string>();
      ((pinsRes.data || []) as unknown as any[]).forEach((p: any) => {
        if (p.pinned_user_id) pinned.add(p.pinned_user_id);
        if (p.pinned_group_id) pinnedG.add(p.pinned_group_id);
      });
      setPinnedUserIds(pinned);
      setPinnedGroupIds(pinnedG);

      // Direct messages
      const msgs = msgsRes.data || [];
      const convMap = new Map<string, { lastMsg: string; lastAt: string; unread: number; opportunityTitle?: string }>();
      const userIds = new Set<string>();

      msgs.forEach((m: any) => {
        const otherId = m.from_user_id === user.id ? m.to_user_id : m.from_user_id;
        if (blocked.has(otherId)) return;
        userIds.add(otherId);
        if (!convMap.has(otherId)) {
          convMap.set(otherId, { lastMsg: m.content, lastAt: m.created_at, unread: 0, opportunityTitle: m.opportunity_id ? "Oportunidade" : undefined });
        }
        if (m.to_user_id === user.id && !m.read) {
          const c = convMap.get(otherId)!;
          c.unread++;
        }
      });

      if (userIds.size > 0) {
        const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name, avatar_url").in("user_id", Array.from(userIds));
        const nameMap = new Map<string, string>();
        const avatarMap = new Map<string, string | null>();
        profiles?.forEach(p => { nameMap.set(p.user_id, p.name); avatarMap.set(p.user_id, p.avatar_url); });

        const convList: Conversation[] = [];
        convMap.forEach((val, odId) => {
          convList.push({
            userId: odId,
            name: nameMap.get(odId) || "Fundador",
            avatarUrl: avatarMap.get(odId) || null,
            lastMessage: val.lastMsg,
            lastAt: val.lastAt,
            unread: val.unread,
            isPinned: pinned.has(odId),
            opportunityTitle: val.opportunityTitle,
          });
        });
        // Sort: pinned first, then by date
        convList.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
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

      // Groups
      const groupIds = ((groupMembersRes.data || []) as unknown as any[]).map((m: any) => m.group_id);
      if (groupIds.length > 0) {
        const { data: groupsData } = await supabase.from("message_groups" as any).select("*").in("id", groupIds);
        const groupList: GroupConversation[] = ((groupsData || []) as unknown as any[]).map((g: any) => ({
          id: g.id,
          name: g.name,
          photo_url: g.photo_url,
          lastMessage: "",
          lastAt: g.created_at,
          isPinned: pinnedG.has(g.id),
        }));
        groupList.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
        });
        setGroups(groupList);
      }

      // Connected users for group creation
      const { data: acceptedConns } = await supabase.from("founder_connections").select("from_user_id, to_user_id")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`).eq("status", "accepted");
      if (acceptedConns) {
        const connUserIds = acceptedConns.map(c => c.from_user_id === user.id ? c.to_user_id : c.from_user_id);
        if (connUserIds.length > 0) {
          const { data: connProfiles } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", connUserIds);
          setConnectedUsers((connProfiles || []).map(p => ({ userId: p.user_id, name: p.name })));
        }
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

  const togglePin = async (targetUserId: string) => {
    if (!user) return;
    if (pinnedUserIds.has(targetUserId)) {
      await supabase.from("pinned_conversations" as any).delete().eq("user_id", user.id).eq("pinned_user_id", targetUserId);
      setPinnedUserIds(prev => { const n = new Set(prev); n.delete(targetUserId); return n; });
      setConversations(prev => prev.map(c => c.userId === targetUserId ? { ...c, isPinned: false } : c));
    } else {
      await supabase.from("pinned_conversations" as any).insert({ user_id: user.id, pinned_user_id: targetUserId });
      setPinnedUserIds(prev => new Set(prev).add(targetUserId));
      setConversations(prev => prev.map(c => c.userId === targetUserId ? { ...c, isPinned: true } : c));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const showChatOnMobile = !!selectedUser || !!selectedGroup;
  const opportunityConversations = conversations.filter(c => c.opportunityTitle);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <Suspense fallback={null}><FounderParticlesBackground /></Suspense>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> Conversas
        </h1>
        <MessageGroupDialog onGroupCreated={() => window.location.reload()} connections={connectedUsers} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Sidebar */}
        <Card className={`border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col ${showChatOnMobile ? "hidden md:flex" : ""}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3 shrink-0">
              <TabsTrigger value="all" className="text-[11px]">Todas</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-[11px]">Oportunidades</TabsTrigger>
              <TabsTrigger value="groups" className="text-[11px]">Grupos</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 overflow-y-auto m-0">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma conversa ainda.</div>
              ) : (
                conversations.map(c => (
                  <ConversationItem key={c.userId} conv={c} isSelected={selectedUser?.userId === c.userId}
                    onSelect={() => { setSelectedUser({ userId: c.userId, name: c.name }); setSelectedGroup(null); }}
                    onTogglePin={() => togglePin(c.userId)} />
                ))
              )}
            </TabsContent>

            <TabsContent value="opportunities" className="flex-1 overflow-y-auto m-0">
              {opportunityConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma conversa de oportunidade.</div>
              ) : (
                opportunityConversations.map(c => (
                  <ConversationItem key={c.userId} conv={c} isSelected={selectedUser?.userId === c.userId}
                    onSelect={() => { setSelectedUser({ userId: c.userId, name: c.name }); setSelectedGroup(null); }}
                    onTogglePin={() => togglePin(c.userId)} />
                ))
              )}
            </TabsContent>

            <TabsContent value="groups" className="flex-1 overflow-y-auto m-0">
              {groups.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Nenhum grupo ainda.</div>
              ) : (
                groups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { setSelectedGroup({ id: g.id, name: g.name }); setSelectedUser(null); }}
                    className={`w-full text-left p-4 border-b border-border/30 hover:bg-secondary/50 transition-colors ${
                      selectedGroup?.id === g.id ? "bg-secondary/70" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                        {g.photo_url ? (
                          <img src={g.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-medium text-sm text-foreground truncate">{g.name}</p>
                    </div>
                  </button>
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Chat area */}
        <Card className={`border-border/50 bg-card/80 backdrop-blur-sm md:col-span-2 overflow-hidden ${!showChatOnMobile ? "hidden md:block" : ""}`}>
          {selectedGroup ? (
            <>
              <div className="md:hidden p-2 border-b border-border/30">
                <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(null)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              </div>
              <GroupChat groupId={selectedGroup.id} groupName={selectedGroup.name} ownerUserId={ownerUserId || undefined} />
            </>
          ) : selectedUser ? (
            <>
              <div className="md:hidden p-2 border-b border-border/30">
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              </div>
              <FounderChat
                otherUserId={selectedUser.userId}
                otherUserName={selectedUser.name}
                otherUserAvatar={conversations.find(c => c.userId === selectedUser.userId)?.avatarUrl}
                onBlock={handleBlock}
                onDeleteConversation={handleDeleteConversation}
                isOtherOwner={ownerUserId === selectedUser.userId}
                isMeOwner={ownerUserId === user?.id}
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

function ConversationItem({ conv, isSelected, onSelect, onTogglePin }: {
  conv: Conversation; isSelected: boolean; onSelect: () => void; onTogglePin: () => void;
}) {
  return (
    <div className={`flex items-center border-b border-border/30 hover:bg-secondary/50 transition-colors ${isSelected ? "bg-secondary/70" : ""}`}>
      <button onClick={onSelect} className="flex-1 text-left p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0">
              {conv.avatarUrl ? <AvatarImage src={conv.avatarUrl} /> : null}
              <AvatarFallback className="text-[10px]">{conv.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            {conv.isPinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
            <p className="font-medium text-sm text-foreground">{conv.name}</p>
          </div>
          {conv.unread > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">{conv.unread}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
      </button>
      <button onClick={onTogglePin} className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
        {conv.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
