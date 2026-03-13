import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const NUMBER_SETTINGS = [
  { key: "affiliate_commission_rate", label: "Comissão Afiliados (%)", defaultValue: 25 },
  { key: "max_ventures_free", label: "Max Ventures (Free)", defaultValue: 2 },
  { key: "max_ventures_pro", label: "Max Ventures (Pro)", defaultValue: 10 },
  { key: "max_ideas_free", label: "Max Ideias (Free)", defaultValue: 20 },
  { key: "pro_price_monthly", label: "Preço Pro Mensal (£)", defaultValue: 19 },
  { key: "pro_price_yearly", label: "Preço Pro Anual (£)", defaultValue: 190 },
  { key: "business_price_monthly", label: "Preço Business Mensal (£)", defaultValue: 49 },
  { key: "business_price_yearly", label: "Preço Business Anual (£)", defaultValue: 490 },
  { key: "weekly_message_limit_free", label: "Limite Mensagens/Semana (Free)", defaultValue: 10 },
];

const TOGGLE_SETTINGS = [
  { key: "feature_global_map", label: "Global Founder Map", defaultValue: true },
  { key: "feature_ai_tools", label: "AI Tools", defaultValue: true },
  { key: "feature_affiliate_system", label: "Sistema de Afiliados", defaultValue: true },
  { key: "feature_founder_feed", label: "Founder Feed", defaultValue: true },
];

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await (supabase.from as any)("platform_settings").select("*");
    const map: Record<string, any> = {};
    (data || []).forEach((s: any) => { map[s.key] = s.value; });

    NUMBER_SETTINGS.forEach(ds => { if (!(ds.key in map)) map[ds.key] = ds.defaultValue; });
    TOGGLE_SETTINGS.forEach(ds => { if (!(ds.key in map)) map[ds.key] = ds.defaultValue; });

    setSettings(map);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === "object" ? value : value,
      updated_at: new Date().toISOString(),
    }));

    for (const row of rows) {
      await (supabase.from as any)("platform_settings").upsert(row, { onConflict: "key" });
    }

    if (user) {
      await (supabase.from as any)("admin_logs").insert({
        actor_id: user.id,
        action: "update_settings",
        target_type: "settings",
        details: settings,
      });
    }

    toast.success("Configurações salvas");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Ajustes da plataforma sem código</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Limites & Preços</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {NUMBER_SETTINGS.map((ds) => (
            <div key={ds.key} className="space-y-1">
              <Label className="text-sm">{ds.label}</Label>
              <Input
                type="number"
                value={settings[ds.key] ?? ds.defaultValue}
                onChange={(e) => setSettings(prev => ({ ...prev, [ds.key]: Number(e.target.value) }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Features Toggle</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {TOGGLE_SETTINGS.map((ds) => (
            <div key={ds.key} className="flex items-center justify-between">
              <Label className="text-sm">{ds.label}</Label>
              <Switch
                checked={settings[ds.key] ?? ds.defaultValue}
                onCheckedChange={(v) => setSettings(prev => ({ ...prev, [ds.key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Salvar Configurações
      </Button>
    </div>
  );
}
