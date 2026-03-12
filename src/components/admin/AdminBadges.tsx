import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { BADGE_DEFINITIONS } from "@/lib/badges";

interface UserBadge {
  id: string;
  user_id: string;
  badge_key: string;
  earned_at: string;
  userName?: string;
}

export default function AdminBadges() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [users, setUsers] = useState<{ user_id: string; name: string }[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [badgeRes, usersRes] = await Promise.all([
      supabase.from("user_badges").select("*").order("earned_at", { ascending: false }).limit(200),
      supabase.from("founder_profiles").select("user_id, name").order("name"),
    ]);

    const allBadges = (badgeRes.data || []) as UserBadge[];
    const allUsers = (usersRes.data || []);
    setUsers(allUsers);

    const nameMap = new Map(allUsers.map(u => [u.user_id, u.name]));
    setBadges(allBadges.map(b => ({ ...b, userName: nameMap.get(b.user_id) || "?" })));
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!selectedUser || !selectedBadge) return;
    setAdding(true);
    const { error } = await supabase.from("user_badges").upsert(
      { user_id: selectedUser, badge_key: selectedBadge },
      { onConflict: "user_id,badge_key" }
    );
    if (error) toast.error("Erro ao adicionar badge");
    else { toast.success("Badge adicionada"); loadData(); }
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    await supabase.from("user_badges").delete().eq("id", id);
    toast.success("Badge removida");
    loadData();
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insígnias</h1>
        <p className="text-sm text-muted-foreground">Dar ou remover badges manualmente</p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Atribuir Badge</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecionar utilizador" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="mb-2" />
                </div>
                {filteredUsers.slice(0, 50).map(u => (
                  <SelectItem key={u.user_id} value={u.user_id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBadge} onValueChange={setSelectedBadge}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecionar badge" />
              </SelectTrigger>
              <SelectContent>
                {BADGE_DEFINITIONS.map(b => (
                  <SelectItem key={b.key} value={b.key}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={adding || !selectedUser || !selectedBadge}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              Dar
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.map((b) => {
                  const def = BADGE_DEFINITIONS.find(d => d.key === b.badge_key);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{def?.name || b.badge_key}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(b.earned_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(b.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
