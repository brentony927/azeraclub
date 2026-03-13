import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Activity, Network, Trophy, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  userId: string;
  onClose: () => void;
}

interface ProfileData {
  name: string;
  country: string | null;
  city: string | null;
  building: string | null;
  reputation_score: number | null;
  is_verified: boolean | null;
  created_at: string;
  industry: string[] | null;
  skills: string[] | null;
}

interface DeepData {
  profile: ProfileData | null;
  plan: string;
  postsCount: number;
  commentsCount: number;
  opportunitiesCount: number;
  connectionsCount: number;
  messagesCount: number;
  badges: string[];
  suggestionsApproved: number;
  affiliateId: string | null;
  leadsCount: number;
}

export default function UserDeepProfile({ userId, onClose }: Props) {
  const [data, setData] = useState<DeepData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [userId]);

  const load = async () => {
    setLoading(true);
    const [
      profileRes, planRes, postsRes, commentsRes,
      oppsRes, connsRes, msgsRes, badgesRes, sugRes, affRes, leadsRes,
    ] = await Promise.all([
      supabase.from("founder_profiles").select("name, country, city, building, reputation_score, is_verified, created_at, industry, skills").eq("user_id", userId).maybeSingle(),
      supabase.from("user_plans").select("plan").eq("user_id", userId).maybeSingle(),
      supabase.from("founder_posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("founder_post_comments").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("founder_opportunities").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("founder_connections").select("id", { count: "exact", head: true }).or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).eq("status", "accepted"),
      supabase.from("founder_messages").select("id", { count: "exact", head: true }).eq("from_user_id", userId),
      supabase.from("user_badges").select("badge_key").eq("user_id", userId),
      supabase.from("suggestions").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "aprovado"),
      supabase.from("affiliate_profiles").select("affiliate_id").eq("user_id", userId).maybeSingle(),
      supabase.from("affiliate_leads").select("id", { count: "exact", head: true }),
    ]);

    setData({
      profile: profileRes.data as ProfileData | null,
      plan: planRes.data?.plan || "free",
      postsCount: postsRes.count || 0,
      commentsCount: commentsRes.count || 0,
      opportunitiesCount: oppsRes.count || 0,
      connectionsCount: connsRes.count || 0,
      messagesCount: msgsRes.count || 0,
      badges: (badgesRes.data || []).map(b => b.badge_key),
      suggestionsApproved: sugRes.count || 0,
      affiliateId: affRes.data?.affiliate_id || null,
      leadsCount: leadsRes.count || 0,
    });
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {loading ? "Carregando..." : data?.profile?.name || "Usuário"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : data?.profile ? (
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="atividade">Atividade</TabsTrigger>
              <TabsTrigger value="score">Score</TabsTrigger>
              <TabsTrigger value="afiliado">Afiliado</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="País" value={data.profile.country || "—"} />
                <InfoCard label="Cidade" value={data.profile.city || "—"} />
                <InfoCard label="Plano" value={data.plan.toUpperCase()} />
                <InfoCard label="Membro desde" value={new Date(data.profile.created_at).toLocaleDateString("pt-BR")} />
                <InfoCard label="Building" value={data.profile.building || "—"} />
                <InfoCard label="Verificado" value={data.profile.is_verified ? "Sim" : "Não"} />
              </div>
              {data.profile.industry && data.profile.industry.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Indústrias</p>
                  <div className="flex flex-wrap gap-1">
                    {data.profile.industry.map(i => <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>)}
                  </div>
                </div>
              )}
              {data.profile.skills && data.profile.skills.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {data.profile.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="atividade" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Posts" value={String(data.postsCount)} />
                <InfoCard label="Comentários" value={String(data.commentsCount)} />
                <InfoCard label="Oportunidades" value={String(data.opportunitiesCount)} />
                <InfoCard label="Conexões" value={String(data.connectionsCount)} />
                <InfoCard label="Mensagens Enviadas" value={String(data.messagesCount)} />
                <InfoCard label="Sugestões Aprovadas" value={String(data.suggestionsApproved)} />
              </div>
            </TabsContent>

            <TabsContent value="score" className="space-y-3 mt-3">
              <InfoCard label="Reputation Score" value={String(data.profile.reputation_score || 0)} />
              {data.badges.length > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Badges ({data.badges.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {data.badges.map(b => <Badge key={b} className="text-[10px]">{b}</Badge>)}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem badges</p>
              )}
            </TabsContent>

            <TabsContent value="afiliado" className="space-y-3 mt-3">
              {data.affiliateId ? (
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Affiliate ID" value={data.affiliateId} />
                  <InfoCard label="Leads Gerados" value={String(data.leadsCount)} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Não é afiliado</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-muted-foreground">Perfil não encontrado</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </CardContent>
    </Card>
  );
}
