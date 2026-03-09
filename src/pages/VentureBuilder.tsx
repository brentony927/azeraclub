import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Rocket, Users, FileText, Map, Loader2, Trash2, MessageSquare, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import FeatureLock from "@/components/FeatureLock";
import BookmarkButton from "@/components/BookmarkButton";
import VentureTasksTab from "@/components/venture/VentureTasksTab";
import VentureChatTab from "@/components/venture/VentureChatTab";
import VentureRoadmapTab from "@/components/venture/VentureRoadmapTab";
import { sendNotification } from "@/lib/sendNotification";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

type Venture = {
  id: string; name: string; industry: string | null; problem: string | null; solution: string | null;
  target_market: string | null; business_model: string | null; ai_roadmap: string | null;
  status: string; created_at: string; goal: string | null; total_score: number;
};
type VentureMember = { id: string; venture_id: string; user_id: string; role: string; status: string; invited_at: string };
type VentureNote = { id: string; venture_id: string; user_id: string; content: string; created_at: string };

export default function VentureBuilder() {
  const { user } = useAuth();
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [selected, setSelected] = useState<Venture | null>(null);
  const [members, setMembers] = useState<VentureMember[]>([]);
  const [notes, setNotes] = useState<VentureNote[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [form, setForm] = useState({ name: "", industry: "", problem: "", solution: "", target_market: "", business_model: "", goal: "" });
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteRole, setInviteRole] = useState("co-founder");
  const [foundProfiles, setFoundProfiles] = useState<any[]>([]);

  const fetchVentures = async () => {
    if (!user) return;
    const { data } = await supabase.from("ventures").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setVentures((data as Venture[]) || []);
  };

  useEffect(() => { fetchVentures(); }, [user]);

  useEffect(() => {
    if (!selected) return;
    supabase.from("venture_members").select("*").eq("venture_id", selected.id).then(({ data }) => setMembers((data as VentureMember[]) || []));
    supabase.from("venture_notes").select("*").eq("venture_id", selected.id).order("created_at", { ascending: false }).then(({ data }) => setNotes((data as VentureNote[]) || []));
  }, [selected]);

  const createVenture = async () => {
    if (!user || !form.name.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.from("ventures").insert({ user_id: user.id, ...form }).select().single();
    if (error) { toast.error("Erro ao criar venture"); } else {
      toast.success("Venture criada!");
      setOpen(false);
      setForm({ name: "", industry: "", problem: "", solution: "", target_market: "", business_model: "", goal: "" });
      fetchVentures();
      setSelected(data as Venture);
    }
    setLoading(false);
  };

  const buildWithAI = async () => {
    if (!selected || !user) return;
    setAiLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(CHAT_URL, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Você é um consultor de startups. Gere um roadmap detalhado, primeiras ações e riscos para a venture descrita." },
            { role: "user", content: `Startup: ${selected.name}\nIndústria: ${selected.industry}\nProblema: ${selected.problem}\nSolução: ${selected.solution}\nMercado-alvo: ${selected.target_market}\nModelo de Negócio: ${selected.business_model}\nObjetivo: ${selected.goal}\n\nGere:\n1. Roadmap do projeto (fases com meses)\n2. Primeiras 5 ações prioritárias\n3. Possíveis riscos e mitigações` }
          ],
        }),
      });
      let roadmap = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try { const j = JSON.parse(line.slice(6)); roadmap += j.choices?.[0]?.delta?.content || ""; } catch {}
          }
        }
      }
      await supabase.from("ventures").update({ ai_roadmap: roadmap, status: "active" }).eq("id", selected.id);
      setSelected({ ...selected, ai_roadmap: roadmap, status: "active" });
      toast.success("Roadmap gerado com IA!");
    } catch { toast.error("Erro ao gerar roadmap"); }
    setAiLoading(false);
  };

  const addNote = async () => {
    if (!selected || !user || !noteText.trim()) return;
    await supabase.from("venture_notes").insert({ venture_id: selected.id, user_id: user.id, content: noteText });
    setNoteText("");
    supabase.from("venture_notes").select("*").eq("venture_id", selected.id).order("created_at", { ascending: false }).then(({ data }) => setNotes((data as VentureNote[]) || []));
  };

  const searchFounders = async () => {
    if (!inviteSearch.trim()) return;
    const { data } = await supabase.from("founder_profiles").select("user_id, name, avatar_url").ilike("name", `%${inviteSearch}%`).limit(5);
    setFoundProfiles(data || []);
  };

  const inviteMember = async (userId: string) => {
    if (!selected || !user) return;
    await supabase.from("venture_members").insert({ venture_id: selected.id, user_id: userId, role: inviteRole });
    // Send team_invitation notification
    await sendNotification({
      user_id: userId,
      type: "team_invitation",
      title: `Você foi convidado para a equipe "${selected.name}"`,
      body: `Função: ${inviteRole}`,
      action_url: "/venture-builder",
    });
    toast.success("Convite enviado!");
    supabase.from("venture_members").select("*").eq("venture_id", selected.id).then(({ data }) => setMembers((data as VentureMember[]) || []));
    setFoundProfiles([]);
    setInviteSearch("");
  };

  const deleteVenture = async (id: string) => {
    await supabase.from("ventures").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    fetchVentures();
    toast.success("Venture removida");
  };

  return (
    <FeatureLock minTier="pro" featureName="Venture Builder">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2"><Rocket className="h-7 w-7 text-primary" /> Venture Builder</h1>
            <p className="text-muted-foreground text-sm mt-1">Crie e desenvolva startups com inteligência artificial</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Criar Venture</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Nova Venture</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Nome da Startup" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Indústria" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
                <Textarea placeholder="Problema" value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} />
                <Textarea placeholder="Solução" value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} />
                <Input placeholder="Mercado Alvo" value={form.target_market} onChange={e => setForm({ ...form, target_market: e.target.value })} />
                <Input placeholder="Modelo de Negócio" value={form.business_model} onChange={e => setForm({ ...form, business_model: e.target.value })} />
                <Input placeholder="Objetivo" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
                <Button onClick={createVenture} disabled={loading || !form.name.trim()} className="w-full">{loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Criar Venture"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Minhas Ventures</h2>
            {ventures.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma venture criada ainda.</p>}
            {ventures.map(v => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`cursor-pointer transition-all hover:border-primary/40 ${selected?.id === v.id ? "border-primary bg-primary/5" : ""}`} onClick={() => setSelected(v)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{v.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {v.industry && <Badge variant="secondary" className="text-xs">{v.industry}</Badge>}
                        <Badge variant={v.status === "active" ? "default" : "outline"} className="text-xs">{v.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookmarkButton itemType="venture" itemId={v.id} />
                      <button onClick={e => { e.stopPropagation(); deleteVenture(v.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {!selected ? (
              <Card className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Selecione ou crie uma venture</p></Card>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{selected.name}</CardTitle>
                  {!selected.ai_roadmap && (
                    <Button onClick={buildWithAI} disabled={aiLoading} variant="default">
                      {aiLoading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Gerando...</> : <><Rocket className="h-4 w-4 mr-2" /> Construir com IA</>}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-4 flex-wrap">
                      <TabsTrigger value="overview"><FileText className="h-3.5 w-3.5 mr-1" /> Visão Geral</TabsTrigger>
                      <TabsTrigger value="roadmap"><Map className="h-3.5 w-3.5 mr-1" /> Roadmap</TabsTrigger>
                      <TabsTrigger value="tasks"><CheckSquare className="h-3.5 w-3.5 mr-1" /> Tarefas</TabsTrigger>
                      <TabsTrigger value="chat"><MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat</TabsTrigger>
                      <TabsTrigger value="team"><Users className="h-3.5 w-3.5 mr-1" /> Equipe</TabsTrigger>
                      <TabsTrigger value="notes"><FileText className="h-3.5 w-3.5 mr-1" /> Notas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-3">
                      {[{ l: "Indústria", v: selected.industry }, { l: "Problema", v: selected.problem }, { l: "Solução", v: selected.solution }, { l: "Mercado", v: selected.target_market }, { l: "Modelo", v: selected.business_model }, { l: "Objetivo", v: selected.goal }].map(i => i.v && (
                        <div key={i.l}><p className="text-xs text-muted-foreground font-semibold uppercase">{i.l}</p><p className="text-sm text-foreground">{i.v}</p></div>
                      ))}
                    </TabsContent>

                    <TabsContent value="roadmap">
                      <VentureRoadmapTab roadmap={selected.ai_roadmap} onBuildWithAI={buildWithAI} aiLoading={aiLoading} />
                    </TabsContent>

                    <TabsContent value="tasks">
                      <VentureTasksTab ventureId={selected.id} members={members.map(m => ({ user_id: m.user_id, role: m.role }))} />
                    </TabsContent>

                    <TabsContent value="chat">
                      <VentureChatTab ventureId={selected.id} venture={{ name: selected.name, industry: selected.industry, problem: selected.problem, solution: selected.solution, goal: selected.goal }} />
                    </TabsContent>

                    <TabsContent value="team" className="space-y-4">
                      <div className="flex gap-2">
                        <Input placeholder="Buscar founder..." value={inviteSearch} onChange={e => setInviteSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchFounders()} />
                        <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="rounded-md border border-input bg-background px-3 text-sm">
                          <option value="co-founder">Co-fundador</option>
                          <option value="developer">Desenvolvedor</option>
                          <option value="designer">Designer</option>
                          <option value="marketing">Marketing</option>
                          <option value="investor">Investidor</option>
                        </select>
                        <Button variant="outline" onClick={searchFounders}>Buscar</Button>
                      </div>
                      {foundProfiles.map(p => (
                        <div key={p.user_id} className="flex items-center justify-between p-2 border rounded-md">
                          <span className="text-sm text-foreground">{p.name}</span>
                          <Button size="sm" onClick={() => inviteMember(p.user_id)}>Convidar</Button>
                        </div>
                      ))}
                      <h3 className="text-sm font-semibold text-muted-foreground mt-4">Membros ({members.length})</h3>
                      {members.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2 border rounded-md">
                          <Badge variant="outline">{m.role}</Badge>
                          <Badge variant={m.status === "accepted" ? "default" : "secondary"}>{m.status}</Badge>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-3">
                      <div className="flex gap-2">
                        <Textarea placeholder="Adicionar nota..." value={noteText} onChange={e => setNoteText(e.target.value)} className="min-h-[60px]" />
                        <Button onClick={addNote} disabled={!noteText.trim()}>Salvar</Button>
                      </div>
                      {notes.map(n => (
                        <Card key={n.id}><CardContent className="p-3"><p className="text-sm text-foreground">{n.content}</p><p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("pt-BR")}</p></CardContent></Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </FeatureLock>
  );
}
