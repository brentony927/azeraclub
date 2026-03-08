import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, UserPlus, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const COMMITMENT_LABELS: Record<string, string> = {
  side_project: "Side Project",
  startup_idea: "Startup Idea",
  full_business: "Full Business",
};

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase.from("founder_profiles").select("*").eq("id", id).single();
      if (data) {
        setProfile(data);
        if (user) {
          const { data: conn } = await supabase
            .from("founder_connections")
            .select("status")
            .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${data.user_id}),and(from_user_id.eq.${data.user_id},to_user_id.eq.${user.id})`)
            .maybeSingle();
          if (conn) setConnectionStatus(conn.status);
        }
      }
      setLoading(false);
    };
    fetch();
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
      toast({ title: "Solicitação enviada! 🤝" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!profile) {
    return <div className="text-center py-16 text-muted-foreground">Perfil não encontrado.</div>;
  }

  const initials = profile.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const isOwn = user?.id === profile.user_id;

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
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              {profile.country && (
                <div className="flex items-center gap-1 justify-center sm:justify-start mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{profile.country}</span>
                </div>
              )}
              {profile.commitment && (
                <Badge variant="outline" className="mt-2">{COMMITMENT_LABELS[profile.commitment] || profile.commitment}</Badge>
              )}
            </div>
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
