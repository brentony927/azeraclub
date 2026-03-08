import { useState, useEffect } from "react";
import { Star, Users, Rocket, Briefcase, TrendingUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Bookmark = { id: string; item_type: string; item_id: string; created_at: string };

export default function SavedItems() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [founders, setFounders] = useState<any[]>([]);
  const [ventures, setVentures] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    const { data: bks } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    const all = (bks || []) as Bookmark[];
    setBookmarks(all);

    const founderIds = all.filter(b => b.item_type === "founder").map(b => b.item_id);
    const ventureIds = all.filter(b => b.item_type === "venture").map(b => b.item_id);
    const oppIds = all.filter(b => b.item_type === "opportunity").map(b => b.item_id);
    const trendIds = all.filter(b => b.item_type === "trend").map(b => b.item_id);

    if (founderIds.length) {
      const { data } = await supabase.from("founder_profiles").select("*").in("id", founderIds);
      setFounders(data || []);
    }
    if (ventureIds.length) {
      const { data } = await supabase.from("ventures").select("*").in("id", ventureIds);
      setVentures(data || []);
    }
    if (oppIds.length) {
      const { data } = await supabase.from("founder_opportunities").select("*").in("id", oppIds);
      setOpportunities(data || []);
    }
    if (trendIds.length) {
      const { data } = await supabase.from("trend_scans").select("*").in("id", trendIds);
      setTrends(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [user]);

  const remove = async (itemType: string, itemId: string) => {
    await supabase.from("bookmarks").delete().eq("user_id", user!.id).eq("item_type", itemType).eq("item_id", itemId);
    toast.success("Removido dos salvos");
    fetchAll();
  };

  const counts = {
    founder: bookmarks.filter(b => b.item_type === "founder").length,
    venture: bookmarks.filter(b => b.item_type === "venture").length,
    opportunity: bookmarks.filter(b => b.item_type === "opportunity").length,
    trend: bookmarks.filter(b => b.item_type === "trend").length,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
        <Star className="h-7 w-7 text-yellow-500" /> Salvos
      </h1>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>
      ) : (
        <Tabs defaultValue="founder">
          <TabsList>
            <TabsTrigger value="founder"><Users className="h-3.5 w-3.5 mr-1" /> Founders ({counts.founder})</TabsTrigger>
            <TabsTrigger value="venture"><Rocket className="h-3.5 w-3.5 mr-1" /> Ventures ({counts.venture})</TabsTrigger>
            <TabsTrigger value="opportunity"><Briefcase className="h-3.5 w-3.5 mr-1" /> Oportunidades ({counts.opportunity})</TabsTrigger>
            <TabsTrigger value="trend"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Tendências ({counts.trend})</TabsTrigger>
          </TabsList>

          <TabsContent value="founder" className="mt-4 space-y-3">
            {founders.length === 0 ? <p className="text-muted-foreground text-sm text-center py-8">Nenhum founder salvo</p> :
              founders.map(f => (
                <Card key={f.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10"><AvatarImage src={f.avatar_url || ""} /><AvatarFallback className="bg-secondary text-foreground text-xs">{f.name?.[0]}</AvatarFallback></Avatar>
                    <div className="flex-1"><p className="font-semibold text-foreground">{f.name}</p>{f.building && <p className="text-xs text-muted-foreground">{f.building}</p>}</div>
                    <button onClick={() => remove("founder", f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="venture" className="mt-4 space-y-3">
            {ventures.length === 0 ? <p className="text-muted-foreground text-sm text-center py-8">Nenhuma venture salva</p> :
              ventures.map(v => (
                <Card key={v.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div><p className="font-semibold text-foreground">{v.name}</p>{v.industry && <Badge variant="secondary" className="text-xs mt-1">{v.industry}</Badge>}</div>
                    <button onClick={() => remove("venture", v.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="opportunity" className="mt-4 space-y-3">
            {opportunities.length === 0 ? <p className="text-muted-foreground text-sm text-center py-8">Nenhuma oportunidade salva</p> :
              opportunities.map(o => (
                <Card key={o.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div><p className="font-semibold text-foreground">{o.title}</p>{o.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{o.description}</p>}</div>
                    <button onClick={() => remove("opportunity", o.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="trend" className="mt-4 space-y-3">
            {trends.length === 0 ? <p className="text-muted-foreground text-sm text-center py-8">Nenhuma tendência salva</p> :
              trends.map(t => (
                <Card key={t.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div><p className="font-semibold text-foreground">{t.title}</p><div className="flex gap-2 mt-1">{t.category && <Badge variant="secondary" className="text-xs">{t.category}</Badge>}</div></div>
                    <button onClick={() => remove("trend", t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
