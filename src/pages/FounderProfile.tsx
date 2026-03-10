import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, UserPlus, MessageCircle, ArrowLeft, Loader2, Eye, ShieldCheck,
  Sparkles, Rocket, Users, Briefcase, Lightbulb, Bookmark, Send, Check, X,
  RefreshCw, TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { COMMITMENT_LABELS } from "@/data/founderConstants";
import { calculateMatchScore, getMatchColor } from "@/lib/founderMatch";
import { useFounderScore, LEVEL_COLORS, SCORE_BADGES } from "@/lib/founderScore";
import { lazy, Suspense } from "react";
const FounderParticlesBackground = lazy(() => import("@/components/FounderParticlesBackground"));
import BookmarkButton from "@/components/BookmarkButton";
import ReportUserDialog from "@/components/ReportUserDialog";
import { sendNotification } from "@/lib/sendNotification";
import FounderPostCard from "@/components/FounderPostCard";

/* ---------- badge mapping ---------- */
function getFounderBadge(profile: any): string {
  const skills: string[] = profile.skills || [];
  const c = profile.commitment;
  if (c === "full_business") return "Fundador";
  if (c === "startup_idea") return "Co-Fundador";
  if (skills.some((s: string) => /develop|dev|code/i.test(s))) return "Desenvolvedor";
  if (skills.some((s: string) => /design/i.test(s))) return "Designer";
  if (skills.some((s: string) => /market/i.test(s))) return "Estrategista";
  if (skills.some((s: string) => /financ|invest/i.test(s))) return "Investidor";
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

  // Founder Score hook — we'll set userId once profile loads
  const [profileUserId, setProfileUserId] = useState<string | undefined>();
  const { score: founderScore, loading: scoreLoading, recalculate } = useFounderScore(profileUserId);
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      // Try username first, then fallback to uuid
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let prof: any = null;
      if (!isUuid) {
        const { data } = await supabase.from("founder_profiles").select("*").eq("username", id as any).maybeSingle();
        prof = data;
      }
      if (!prof) {
        const { data } = await supabase.from("founder_profiles").select("*").eq("id", id as any).maybeSingle();
        prof = data;
      }
      if (!prof) { setLoading(false); return; }
      setProfile(prof);
      setProfileUserId(prof.user_id);

      // Record visit in profile_visits + increment views (dedup: 1 per visitor per day)
      if (user && prof.user_id !== user.id) {
        // Insert visit (unique per day via DB constraint, ignore conflict)
        await supabase.from("profile_visits" as any).insert({
          profile_user_id: prof.user_id,
          visitor_user_id: user.id,
        }).then(() => {});

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
          await supabase.from("founder_profiles").update({ profile_views: (prof.profile_views || 0) + 1 }).eq("id", prof.id);
          const { data: visitorProfile } = await supabase.from("founder_profiles").select("name, username").eq("user_id", user.id).maybeSingle();
          await sendNotification({ user_id: prof.user_id, type: "profile_view", title: `${visitorProfile?.name || visitorProfile?.username || "Alguém"} visualizou seu perfil 👀`, related_user_id: user.id });
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
      await sendNotification({ user_id: profile.user_id, type: "connection", title: `${myProfile?.name || myProfile?.username || "Alguém"} quer se conectar` });
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
      await sendNotification({
        user_id: profile.user_id,
        type: "connection",
        title: `${myProfile?.name || myProfile?.username || "Alguém"} aceitou sua conexão! 🎉`,
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
  const isSiteOwner = !!(profile as any).is_site_owner;

  // shared interests
  const myInterests: string[] = myProfile?.interests || [];
  const theirInterests: string[] = profile.interests || [];
  const sharedInterests = myInterests.filter(i => theirInterests.includes(i));

  const stageLabel: Record<string, string> = { idea: "Ideia", prototype: "Protótipo", mvp: "MVP", building: "Startup Inicial", active: "Crescimento", scaling: "Escalando" };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 relative space-y-6 ${isSiteOwner ? "owner-profile-wrapper p-6" : ""}`}>
      <Suspense fallback={null}><FounderParticlesBackground /></Suspense>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* === 1. HEADER === */}
      <Card className={`border-border/50 bg-card/80 backdrop-blur-sm ${isSiteOwner ? "owner-card-inner" : ""}`}>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className={`w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 ring-3 ${isSiteOwner ? "ring-[hsl(0,100%,50%)] owner-avatar-ring" : "ring-primary/20"}`}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full object-cover" loading="lazy" />
              ) : (
                <span className="text-2xl font-bold text-foreground">{initials}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className={`text-2xl font-bold ${isSiteOwner ? "owner-name" : "text-foreground"}`}>{profile.name}</h1>
                {profile.is_verified && <ShieldCheck className="h-5 w-5 text-primary" />}
                {isSiteOwner && (
                  <Badge className="owner-badge text-[10px] font-bold">👑 DONO · AZERA</Badge>
                )}
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">{founderBadge}</Badge>
              </div>
              {profile.username && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-sm text-muted-foreground font-mono">@{profile.username}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/founder-profile/${profile.username}`);
                      toast({ title: "Link copiado! 📋" });
                    }}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Copiar
                  </button>
                </div>
              )}
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
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {profile.profile_views || 0} visualizações</span>
              </div>
              {/* Founder Score */}
              <div className={`pt-2 ${isSiteOwner ? "owner-progress" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Founder Score
                  </h3>
                  <div className="flex items-center gap-2">
                    {founderScore && (
                      <span className={`text-xs font-bold ${isSiteOwner ? "text-[hsl(0,100%,50%)]" : LEVEL_COLORS[founderScore.level] || "text-foreground"}`}>
                        {founderScore.level}
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${isSiteOwner ? "text-[hsl(0,100%,55%)]" : "text-foreground"}`}>{founderScore?.total_score ?? repScore}/100</span>
                  </div>
                </div>
                <Progress value={founderScore?.total_score ?? repScore} className="h-2" />
                {founderScore && (
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {[
                      { label: "Perfil", value: founderScore.profile_points, max: 15 },
                      { label: "Rede", value: founderScore.network_points, max: 25 },
                      { label: "Projetos", value: founderScore.project_points, max: 25 },
                      { label: "Atividade", value: founderScore.activity_points, max: 20 },
                      { label: "Influência", value: founderScore.influence_points, max: 15 },
                    ].map(p => (
                      <div key={p.label} className="text-center">
                        <p className="text-[9px] text-muted-foreground">{p.label}</p>
                        <p className="text-[11px] font-bold text-foreground">{p.value}/{p.max}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Badges */}
                {founderScore && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {SCORE_BADGES.filter(b => b.check(founderScore)).map(b => (
                      <Badge key={b.key} variant="secondary" className="text-[10px] gap-1">
                        {b.icon} {b.label}
                      </Badge>
                    ))}
                  </div>
                )}
                {isOwn && (
                  <Button variant="ghost" size="sm" className="mt-2 text-xs h-7" onClick={recalculate} disabled={scoreLoading}>
                    <RefreshCw className={`h-3 w-3 mr-1 ${scoreLoading ? "animate-spin" : ""}`} /> Atualizar Score
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === 2. SOCIAL PROOF === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Conexões", value: connectionsCount, icon: Users },
          { label: "Ventures", value: venturesCount, icon: Rocket },
          { label: "Projetos", value: projectsJoined, icon: Briefcase },
          { label: "Oportunidades", value: oppsCount, icon: Lightbulb },
        ].map(s => (
          <Card key={s.label} className={`border-border/50 bg-card/80 backdrop-blur-sm ${isSiteOwner ? "owner-stat-card" : ""}`}>
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <s.icon className={`h-4 w-4 ${isSiteOwner ? "text-[hsl(0,100%,55%)]" : "text-muted-foreground"}`} />
              <span className="text-xl font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* === 3. BIO === */}
      {profile.building && (
        <Card className={`border-border/50 bg-card/80 backdrop-blur-sm ${isSiteOwner ? "owner-card-inner" : ""}`}>
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
            <Rocket className="h-3.5 w-3.5" /> Venture Atual
          </h3>
          {currentVenture ? (
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{currentVenture.name}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {currentVenture.industry && <Badge variant="outline">{currentVenture.industry}</Badge>}
                <Badge variant="secondary">{stageLabel[currentVenture.status] || currentVenture.status}</Badge>
                <Badge variant="outline">Equipe: {currentVentureTeamSize}</Badge>
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
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Procurando</h3>
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
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Habilidades</h3>
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
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interesses</h3>
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
              <Sparkles className="h-3.5 w-3.5" /> Compatibilidade
            </h3>
            <div className="flex items-center gap-4">
              <span className={`text-3xl font-bold ${getMatchColor(matchScore)}`}>{matchScore}%</span>
              {sharedInterests.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Interesses em Comum</p>
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

      {/* === 10. TABS: Activity & Publications === */}
      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="posts">Publicações</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {activity.length > 0 && (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
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
        </TabsContent>

        <TabsContent value="posts">
          <FounderProfilePosts userId={profile.user_id} />
        </TabsContent>
      </Tabs>

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
                  {connectionStatus === "accepted" ? "Conectado" : connectionStatus === "pending" ? "Pendente" : "Conectar"}
                </Button>
              )}
              {connectionStatus === "accepted" && (
                <Button variant="outline" onClick={() => navigate("/founder-messages", { state: { userId: profile.user_id, userName: profile.name } })}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Mensagem
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/venture-builder")}>
                <Send className="h-4 w-4 mr-2" /> Convidar para Venture
              </Button>
              <BookmarkButton itemId={profile.id} itemType="founder" />
              <ReportUserDialog reportedUserId={profile.user_id} reportedUserName={profile.name} />
            </div>
          </CardContent>
        </Card>
      )}

      {!isOwn && (
        <p className="text-[10px] text-muted-foreground text-center px-4">
          ⚠️ A AZERA não verifica identidades nem garante a veracidade das informações dos perfis. Interaja com cautela.
        </p>
      )}
    </div>
  );
}

/* === Publications sub-component for profile === */
function FounderProfilePosts({ userId }: { userId: string }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<Record<string, any>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("founder_posts" as any).select("*").eq("user_id", userId).order("created_at", { ascending: false });
    const postsList = (data || []) as unknown as any[];
    setPosts(postsList);

    if (postsList.length === 0) { setLoading(false); return; }

    const postIds = postsList.map(p => p.id);
    const { data: profile } = await supabase.from("founder_profiles").select("user_id, name, avatar_url, username").eq("user_id", userId).maybeSingle();
    if (profile) setAuthors({ [userId]: { name: profile.name, avatar: profile.avatar_url, username: profile.username } });

    const [likesRes, myLikesRes, commentsRes] = await Promise.all([
      supabase.from("founder_post_likes" as any).select("post_id").in("post_id", postIds),
      user ? supabase.from("founder_post_likes" as any).select("post_id").eq("user_id", user.id).in("post_id", postIds) : Promise.resolve({ data: [] }),
      supabase.from("founder_post_comments" as any).select("*").in("post_id", postIds).order("created_at", { ascending: true }),
    ]);

    const lc: Record<string, number> = {};
    ((likesRes.data || []) as unknown as any[]).forEach((l: any) => { lc[l.post_id] = (lc[l.post_id] || 0) + 1; });
    setLikes(lc);

    const ml = new Set<string>();
    ((myLikesRes.data || []) as unknown as any[]).forEach((l: any) => ml.add(l.post_id));
    setMyLikes(ml);

    const cm: Record<string, any[]> = {};
    const cc: Record<string, number> = {};
    ((commentsRes.data || []) as unknown as any[]).forEach((c: any) => {
      if (!cm[c.post_id]) cm[c.post_id] = [];
      cm[c.post_id].push(c);
      cc[c.post_id] = (cc[c.post_id] || 0) + 1;
    });
    setComments(cm);
    setCommentCounts(cc);
    setLoading(false);
  }, [userId, user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (posts.length === 0) return <p className="text-center py-8 text-sm text-muted-foreground">Nenhuma publicação ainda.</p>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <FounderPostCard
          key={post.id}
          post={post}
          authorName={authors[post.user_id]?.name || "Founder"}
          authorAvatar={authors[post.user_id]?.avatar || null}
          authorUsername={authors[post.user_id]?.username || null}
          likesCount={likes[post.id] || 0}
          commentsCount={commentCounts[post.id] || 0}
          isLiked={myLikes.has(post.id)}
          comments={comments[post.id] || []}
          onRefresh={fetchPosts}
        />
      ))}
    </div>
  );
}
