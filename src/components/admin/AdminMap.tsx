import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface LocationRow {
  id: string;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  name?: string;
  country?: string;
}

export default function AdminMap() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: locs } = await supabase.from("founder_locations").select("*");
    if (!locs) { setLoading(false); return; }

    const ids = locs.map(l => l.user_id);
    const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name, country").in("user_id", ids);
    const map = new Map((profiles || []).map(p => [p.user_id, p]));

    setLocations(locs.map(l => ({
      ...l,
      name: map.get(l.user_id)?.name || "?",
      country: map.get(l.user_id)?.country || "—",
    })));
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    await supabase.from("founder_locations").delete().eq("id", id);
    toast.success("Localização removida");
    loadData();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mapa Global</h1>
        <p className="text-sm text-muted-foreground">{locations.length} localizações registradas</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Coordenadas</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.country}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {l.latitude?.toFixed(2)}, {l.longitude?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemove(l.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
