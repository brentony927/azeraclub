import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, UserPlus, MessageCircle, ArrowLeft, Loader2, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { COMMITMENT_LABELS } from "@/data/founderConstants";
import { calculateMatchScore, getMatchColor } from "@/lib/founderMatch";

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      const { data } = await supabase.from("founder_profiles").select("*").eq("id", id).single();
      if (data) {
        setProfile(data);

        // Increment views
        if (user && data.user_id !== user.id) {
          await supabase.from("founder_profiles").update({ profile_views: (data.profile_views || 0) + 1 }).eq("id", id);
          // Notify owner
          await supabase.from("founder_notifications").insert({
            user_id: data.user_id,
            type: "profile_view",
            title: "Alguém visualizou seu perfil",
            related_user_id: user.id,
          });
        }

        if (user) {
          const [connRes, myRes] = await Promise.all([
            supabase.from("founder_connections").select("status")
              .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${data.user_id}),and(from_user_id.eq.${data.user_id},to_user_id.eq.${user.id})`)
              .maybeSingle(),
            supabase.from("founder_profiles").select("*").eq("user_id", user.id).maybeSingle(),
          ]);
          if (connRes.data) setConnectionStatus(connRes.data.status);
          if (myRes.data) setMyProfile(myRes.data);
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, [id, user]);

  const handleConnect = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("founder_connections").insert({
      from_user_id: user.id,
      to_user_id: profile.user_id,
      status: "pending",
    });
    if (!error) {
      setConnectionStatus("pending");
      await supabase.from("founder_notifications").insert({
        user_id: profile.user_id,
        type: "connection",
        title: `${myProfile?.name || "Alguém"} quer se conectar`,
      });
      toast({ title: "Solicitação enviada! 🤝" });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!profile) return <div className="text-center py-16 text-muted-foreground">Perfil não encontrado.</div>;

  const initials = profile.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const isOwn = user?.id === profile.user_id;
  const matchScore = myProfile && !isOwn ? calculateMatchScore(myProfile, profile) : null;
  const repScore = Math.min(100, profile.reputation_score || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-foreground">{initials}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                {profile.is_verified && (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
              </div>
              {(profile.country || profile.city) && (
                <div className="flex items-center gap-1 justify-center sm:justify-start mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                {profile.commitment && (
                  <Badge variant="outline">{COMMITMENT_LABELS[profile.commitment] || profile.commitment}</Badge>
                )}
                {matchScore !== null && matchScore > 0 && (
                  <Badge className={`border ${getMatchColor(matchScore)}`}>
                    <Sparkles className="h-3 w-3 mr-1" /> Match {matchScore}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground justify-center sm:justify-start">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {profile.profile_views || 0} visualizações</span>
              </div>
            </div>
          </div>

          {/* Reputation */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Founder Score</h3>
              <span className="text-xs font-semibold text-foreground">{repScore}/100</span>
            </div>
            <Progress value={repScore} className="h-2" />
          </div>

          {profile.building && (
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">O que está construindo</h3>
              <p className="text-sm text-foreground">{profile.building}</p>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
          )}

          {profile.industry?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Indústria</h3>
              <div className="flex flex-wrap gap-2">
                {profile.industry.map((i: string) => <Badge key={i} variant="outline">{i}</Badge>)}
              </div>
            </div>
          )}

          {profile.interests?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interesses</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((i: string) => (
                  <Badge key={i} className="text-[10px] bg-primary/10 text-primary border-primary/20">{i}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.looking_for?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Procurando</h3>
              <div className="flex flex-wrap gap-2">
                {profile.looking_for.map((l: string) => <Badge key={l} className="bg-primary/10 text-primary border-primary/20">{l}</Badge>)}
              </div>
            </div>
          )}

          {!isOwn && (
            <div className="flex gap-3 mt-8">
              <Button onClick={handleConnect} disabled={!!connectionStatus}>
                <UserPlus className="h-4 w-4 mr-2" />
                {connectionStatus === "accepted" ? "Conectado" : connectionStatus === "pending" ? "Pendente" : "Conectar"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/founder-messages", { state: { userId: profile.user_id, userName: profile.name } })}>
                <MessageCircle className="h-4 w-4 mr-2" /> Enviar Mensagem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
