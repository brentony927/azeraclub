import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, UserPlus, MessageCircle, ArrowLeft, Loader2, Eye, ShieldCheck,
  Sparkles, Rocket, Users, Briefcase, Lightbulb, Bookmark, Send, Check, X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { COMMITMENT_LABELS } from "@/data/founderConstants";
import { calculateMatchScore, getMatchColor } from "@/lib/founderMatch";
import FounderParticlesBackground from "@/components/FounderParticlesBackground";
import BookmarkButton from "@/components/BookmarkButton";

/* ---------- badge mapping ---------- */
function getFounderBadge(profile: any): string {
  const skills: string[] = profile.skills || [];
  const c = profile.commitment;
  if (c === "full_business") return "Founder";
  if (c === "startup_idea") return "Co-Founder";
  if (skills.some((s: string) => /develop|dev|code/i.test(s))) return "Developer";
  if (skills.some((s: string) => /design/i.test(s))) return "Designer";
  if (skills.some((s: string) => /market/i.test(s))) return "Marketer";
  if (skills.some((s: string) => /financ|invest/i.test(s))) return "Investor";
  return "Builder";
}

/* ---------- activity item ---------- */
interface ActivityItem { text: string; date: string; icon: "connection" | "venture" | "opportunity" }

/* ---------- main component ---------- */
export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isIncomingPending, setIsIncomingPending] = useState(false);

  // social proof
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [venturesCount, setVenturesCount] = useState(0);
  const [projectsJoined, setProjectsJoined] = useState(0);
  const [oppsCount, setOppsCount] = useState(0);

  // ventures & activity
  const [ventures, setVentures] = useState<any[]>([]);
  const [currentVenture, setCurrentVenture] = useState<any>(null);
  const [currentVentureTeamSize, setCurrentVentureTeamSize] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: prof } = await supabase.from("founder_profiles").select("*").eq("id", id).single();
      if (!prof) { setLoading(false); return; }
      setProfile(prof);

      // increment views (dedup: 1 per visitor per 24h)
      if (user && prof.user_id !== user.id) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: recentView } = await supabase.from("founder_notifications")
          .select("id")
          .eq("user_id", prof.user_id)
          .eq("type", "profile_view")
          .eq("related_user_id", user.id)
          .gte("created_at", oneDayAgo)
          .limit(1)
          .maybeSingle();
        if (!recentView) {
          await supabase.from("founder_profiles").update({ profile_views: (prof.profile_views || 0) + 1 }).eq("id", id);
          await supabase.from("founder_notifications").insert({ user_id: prof.user_id, type: "profile_view", title: "Alguém visualizou seu perfil", related_user_id: user.id });
        }
      }

      // parallel fetches
      const uid = prof.user_id;
      const [connRes, myRes, venturesRes, oppsRes, membersRes] = await Promise.all([
        user ? supabase.from("founder_connections").select("status, from_user_id, to_user_id").or(`and(from_user_id.eq.${user.id},to_user_id.eq.${uid}),and(from_user_id.eq.${uid},to_user_id.eq.${user.id})`).maybeSingle() : Promise.resolve({ data: null }),
        user ? supabase.from("founder_profiles").select("*").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from("ventures").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("founder_opportunities").select("id").eq("user_id", uid),
        supabase.from("venture_members").select("id").eq("user_id", uid),
      ]);

      if (connRes.data) {
        const conn = connRes.data as any;
        setConnectionStatus(conn.status);
        // Check if current user is the recipient of a pending request
        if (conn.status === "pending" && conn.to_user_id === user?.id) {
          setIsIncomingPending(true);
        }
      }
      if (myRes.data) setMyProfile(myRes.data);

      // connections count (accepted)
      const { count: accCount } = await supabase.from("founder_connections").select("id", { count: "exact", head: true })
        .or(`from_user_id.eq.${uid},to_user_id.eq.${uid}`).eq("status", "accepted");
      setConnectionsCount(accCount || 0);

      // ventures
      const v = venturesRes.data || [];
      setVentures(v);
      setVenturesCount(v.length);
      if (v.length > 0) {
        setCurrentVenture(v[0]);
        const { count: teamCount } = await supabase.from("venture_members").select("id", { count: "exact", head: true }).eq("venture_id", v[0].id);
        setCurrentVentureTeamSize((teamCount || 0) + 1); // +1 owner
      }

      setOppsCount(oppsRes.data?.length || 0);
      setProjectsJoined(membersRes.data?.length || 0);

      // activity feed
      const acts: ActivityItem[] = [];
      const { data: recentConns } = await supabase.from("founder_connections").select("created_at").or(`from_user_id.eq.${uid},to_user_id.eq.${uid}`).eq("status", "accepted").order("created_at", { ascending: false }).limit(3);
      recentConns?.forEach(c => acts.push({ text: "Nova conexão estabelecida", date: c.created_at, icon: "connection" }));
      v.slice(0, 2).forEach(vt => acts.push({ text: `Criou venture: ${vt.name}`, date: vt.created_at, icon: "venture" }));
      const { data: recentOpps } = await supabase.from("founder_opportunities").select("title, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(2);
      recentOpps?.forEach(o => acts.push({ text: `Postou oportunidade: ${o.title}`, date: o.created_at, icon: "opportunity" }));
      acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivity(acts.slice(0, 5));

      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleConnect = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("founder_connections").insert({ from_user_id: user.id, to_user_id: profile.user_id, status: "pending" });
    if (!error) {
      setConnectionStatus("pending");
      await supabase.from("founder_notifications").insert({ user_id: profile.user_id, type: "connection", title: `${myProfile?.name || "Alguém"} quer se conectar`, related_user_id: user.id });
      toast({ title: "Solicitação enviada! 🤝" });
    }
  };

  const handleAcceptConnection = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("founder_connections").update({ status: "accepted" })
      .eq("from_user_id", profile.user_id).eq("to_user_id", user.id).eq("status", "pending");
    if (!error) {
      setConnectionStatus("accepted");
      setIsIncomingPending(false);
      await supabase.from("founder_notifications").insert({
        user_id: profile.user_id,
        type: "connection",
        title: `${myProfile?.name || "Alguém"} aceitou sua conexão! 🎉`,
        related_user_id: user.id,
      });
      toast({ title: "Conexão aceita! 🤝" });
    }
  };

  const handleRejectConnection = async () => {
    if (!user || !profile) return;
    await supabase.from("founder_connections").delete()
      .eq("from_user_id", profile.user_id).eq("to_user_id", user.id).eq("status", "pending");
    setConnectionStatus(null);
    setIsIncomingPending(false);
    toast({ title: "Conexão recusada" });
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!profile) return <div className="text-center py-16 text-muted-foreground">Perfil não encontrado.</div>;

  const initials = profile.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const isOwn = user?.id === profile.user_id;
  const matchScore = myProfile && !isOwn ? calculateMatchScore(myProfile, profile) : null;
  const repScore = Math.min(100, profile.reputation_score || 0);
  const founderBadge = getFounderBadge(profile);

  // shared interests
  const myInterests: string[] = myProfile?.interests || [];
  const theirInterests: string[] = profile.interests || [];
  const sharedInterests = myInterests.filter(i => theirInterests.includes(i));

  const stageLabel: Record<string, string> = { idea: "Idea", prototype: "Prototype", mvp: "MVP", building: "Early Startup", active: "Growth", scaling: "Scaling" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative space-y-6">
      <FounderParticlesBackground />
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* === 1. HEADER === */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary/20">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-foreground">{initials}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                {profile.is_verified && <ShieldCheck className="h-5 w-5 text-primary" />}
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">{founderBadge}</Badge>
              </div>
              {(profile.country || profile.city) && (
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {profile.commitment && (
                <Badge variant="outline" className="text-xs">{COMMITMENT_LABELS[profile.commitment] || profile.commitment}</Badge>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground justify-center sm:justify-start">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {profile.profile_views || 0} views</span>
              </div>
              {/* Founder Score */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Founder Score</h3>
                  <span className="text-xs font-semibold text-foreground">{repScore}/100</span>
                </div>
                <Progress value={repScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === 2. SOCIAL PROOF === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Connections", value: connectionsCount, icon: Users },
          { label: "Ventures", value: venturesCount, icon: Rocket },
          { label: "Projects", value: projectsJoined, icon: Briefcase },
          { label: "Opportunities", value: oppsCount, icon: Lightbulb },
        ].map(s => (
          <Card key={s.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* === 3. BIO === */}
      {profile.building && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Bio</h3>
            <p className="text-sm text-foreground leading-relaxed">{profile.building}</p>
          </CardContent>
        </Card>
      )}

      {/* === 4. CURRENT VENTURE === */}
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Rocket className="h-3.5 w-3.5" /> Current Venture
          </h3>
          {currentVenture ? (
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{currentVenture.name}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {currentVenture.industry && <Badge variant="outline">{currentVenture.industry}</Badge>}
                <Badge variant="secondary">{stageLabel[currentVenture.status] || currentVenture.status}</Badge>
                <Badge variant="outline">Team: {currentVentureTeamSize}</Badge>
              </div>
              {currentVenture.problem && <p className="text-xs text-muted-foreground mt-1">{currentVenture.problem}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma venture ativa</p>
          )}
        </CardContent>
      </Card>

      {/* === 5. LOOKING FOR === */}
      {profile.looking_for?.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Looking For</h3>
            <div className="flex flex-wrap gap-2">
              {profile.looking_for.map((l: string) => <Badge key={l} className="bg-primary/10 text-primary border-primary/20">{l}</Badge>)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 6. SKILLS === */}
      {profile.skills?.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 7. INTERESTS === */}
      {profile.interests?.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((i: string) => (
                <Badge key={i} className="text-[10px] bg-accent text-accent-foreground border-border/30">{i}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 8. VENTURES PORTFOLIO === */}
      {ventures.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Ventures</h3>
            <div className="space-y-3">
              {ventures.map(v => (
                <div key={v.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.industry || "—"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{stageLabel[v.status] || v.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 9. COMPATIBILITY (visitors only) === */}
      {!isOwn && matchScore !== null && matchScore > 0 && (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Compatibility
            </h3>
            <div className="flex items-center gap-4">
              <span className={`text-3xl font-bold ${getMatchColor(matchScore)}`}>{matchScore}%</span>
              {sharedInterests.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shared Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {sharedInterests.slice(0, 6).map(i => (
                      <Badge key={i} className="text-[10px] bg-primary/10 text-primary border-primary/20">{i}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 10. ACTIVITY FEED === */}
      {activity.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Activity</h3>
            <div className="space-y-2.5">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  {a.icon === "connection" && <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                  {a.icon === "venture" && <Rocket className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                  {a.icon === "opportunity" && <Lightbulb className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-xs text-foreground">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(a.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === 11. ACTION BUTTONS === */}
      {!isOwn && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {isIncomingPending ? (
                <>
                  <Button onClick={handleAcceptConnection}>
                    <Check className="h-4 w-4 mr-2" /> Aceitar Conexão
                  </Button>
                  <Button variant="outline" onClick={handleRejectConnection}>
                    <X className="h-4 w-4 mr-2" /> Recusar
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect} disabled={!!connectionStatus}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {connectionStatus === "accepted" ? "Conectado" : connectionStatus === "pending" ? "Pendente" : "Connect"}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/founder-messages", { state: { userId: profile.user_id, userName: profile.name } })}>
                <MessageCircle className="h-4 w-4 mr-2" /> Message
              </Button>
              <Button variant="outline" onClick={() => navigate("/venture-builder")}>
                <Send className="h-4 w-4 mr-2" /> Invite to Venture
              </Button>
              <BookmarkButton itemId={profile.id} itemType="founder" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
