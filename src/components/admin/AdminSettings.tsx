import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: any;
}

const DEFAULT_SETTINGS = [
  { key: "affiliate_commission_rate", label: "Comissão Afiliados (%)", type: "number", defaultValue: 25 },
  { key: "max_ventures_free", label: "Max Ventures (Free)", type: "number", defaultValue: 2 },
  { key: "max_ventures_pro", label: "Max Ventures (Pro)", type: "number", defaultValue: 10 },
  { key: "max_ideas_free", label: "Max Ideias (Free)", type: "number", defaultValue: 20 },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("platform_settings").select("*");
    const map: Record<string, any> = {};
    (data || []).forEach((s: any) => { map[s.key] = s.value; });

    // Fill defaults
    DEFAULT_SETTINGS.forEach(ds => {
      if (!(ds.key in map)) map[ds.key] = ds.defaultValue;
    });

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
      await supabase.from("platform_settings").upsert(row, { onConflict: "key" });
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
        <CardContent className="p-6 space-y-4">
          {DEFAULT_SETTINGS.map((ds) => (
            <div key={ds.key} className="space-y-1">
              <Label className="text-sm">{ds.label}</Label>
              <Input
                type={ds.type}
                value={settings[ds.key] ?? ds.defaultValue}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  [ds.key]: ds.type === "number" ? Number(e.target.value) : e.target.value,
                }))}
              />
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving} className="mt-4">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
