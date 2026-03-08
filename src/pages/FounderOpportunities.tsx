import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Loader2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FeatureLock from "@/components/FeatureLock";
import FounderParticlesBackground from "@/components/FounderParticlesBackground";

const LOOKING_OPTIONS = ["Co-founder", "Developer", "Investor", "Marketing Partner", "Designer"];

interface Opportunity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project: string | null;
  equity_available: boolean | null;
  looking_for: string[];
  created_at: string;
}

export default function FounderOpportunities() {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", project: "", equity: false, looking_for: [] as string[] });

  useEffect(() => {
    supabase.from("founder_opportunities").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setOpps(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("founder_opportunities").insert({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      equity_available: form.equity,
      looking_for: form.looking_for,
    }).select().single();
    setSaving(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      if (data) setOpps(prev => [data, ...prev]);
      setForm({ title: "", description: "", project: "", equity: false, looking_for: [] });
      setDialogOpen(false);
      toast({ title: "Oportunidade publicada! 🎯" });
    }
  };

  const toggleLooking = (val: string) => {
    setForm(prev => ({
      ...prev,
      looking_for: prev.looking_for.includes(val) ? prev.looking_for.filter(v => v !== val) : [...prev.looking_for, val],
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <FounderParticlesBackground />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-6 w-6" /> Oportunidades
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Encontre ou publique oportunidades de colaboração.</p>
        </div>

        {canAccess("pro") ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Publicar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Nova Oportunidade</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Looking for a SaaS developer" />
                </div>
                <div className="space-y-2">
                  <Label>Projeto</Label>
                  <Input value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} placeholder="Ex: AI tool for agencies" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.equity} onCheckedChange={c => setForm(p => ({ ...p, equity: !!c }))} />
                  <Label className="text-sm">Equity disponível</Label>
                </div>
                <div className="space-y-2">
                  <Label>Procurando</Label>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleLooking(opt)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          form.looking_for.includes(opt) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={saving || !form.title.trim()} className="w-full">
                  {saving ? "Publicando..." : "Publicar Oportunidade"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <FeatureLock minTier="pro" featureName="Publicar Oportunidades">
            <Button disabled><Plus className="h-4 w-4 mr-2" /> Publicar</Button>
          </FeatureLock>
        )}
      </div>

      {opps.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma oportunidade publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opps.map(opp => (
            <Card key={opp.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-foreground">{opp.title}</h3>
                  {opp.equity_available && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <DollarSign className="h-3 w-3 mr-0.5" /> Equity
                    </Badge>
                  )}
                </div>
                {opp.project && <p className="text-sm text-muted-foreground mt-1">Projeto: {opp.project}</p>}
                {opp.description && <p className="text-sm text-foreground/80 mt-2">{opp.description}</p>}
                {opp.looking_for?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opp.looking_for.map(l => (
                      <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
