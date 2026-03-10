import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Loader2, DollarSign, ImagePlus, X, Play, Trash2, MessageCircle, AlertTriangle } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import FeatureLock from "@/components/FeatureLock";
import { sendNotification } from "@/lib/sendNotification";
import { lazy, Suspense } from "react";
const FounderParticlesBackground = lazy(() => import("@/components/FounderParticlesBackground"));

const LOOKING_OPTIONS = ["Co-fundador", "Desenvolvedor", "Investidor", "Parceiro de Marketing", "Designer"];

interface Opportunity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project: string | null;
  equity_available: boolean | null;
  looking_for: string[];
  created_at: string;
  media_urls: string[] | null;
  media_type: string | null;
}

export default function FounderOpportunities() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const navigate = useNavigate();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", project: "", equity: false, looking_for: [] as string[] });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("founder_opportunities").select("*").order("created_at", { ascending: false }).then(async ({ data }) => {
      if (data) {
        setOpps(data as Opportunity[]);
        const userIds = [...new Set(data.map(o => o.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("founder_profiles")
            .select("user_id, name")
            .in("user_id", userIds);
          if (profiles) {
            const map: Record<string, string> = {};
            profiles.forEach(p => { map[p.user_id] = p.name; });
            setAuthorNames(map);
          }
        }
      }
      setLoading(false);
    });
  }, []);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 5) {
      toast({ title: "Máximo 5 arquivos", variant: "destructive" });
      return;
    }
    setMediaFiles(prev => [...prev, ...files]);
    setMediaPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);

    // Upload media files
    let media_urls: string[] = [];
    let media_type: string | null = null;

    if (mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("opportunity-media").upload(path, file);
        if (!error) {
          const { data: urlData } = supabase.storage.from("opportunity-media").getPublicUrl(path);
          media_urls.push(urlData.publicUrl);
        }
      }
      const hasVideo = mediaFiles.some(f => f.type.startsWith("video/"));
      media_type = hasVideo ? "mixed" : "image";
    }

    const { data, error } = await supabase.from("founder_opportunities").insert({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      equity_available: form.equity,
      looking_for: form.looking_for,
      media_urls: media_urls.length > 0 ? media_urls : null,
      media_type,
    }).select().single();

    setSaving(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      if (data) setOpps(prev => [data as Opportunity, ...prev]);
      setForm({ title: "", description: "", project: "", equity: false, looking_for: [] });
      setMediaFiles([]);
      setMediaPreviews([]);
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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("founder_opportunities").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setOpps(prev => prev.filter(o => o.id !== id));
      toast({ title: "Oportunidade excluída ✓" });
    }
  };

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Suspense fallback={null}><FounderParticlesBackground /></Suspense>
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
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label>Fotos / Vídeos (máx. 5)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaSelect}
                  />
                  <div className="flex flex-wrap gap-2">
                    {mediaPreviews.map((preview, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                        {mediaFiles[i]?.type.startsWith("video/") ? (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Play className="h-6 w-6 text-muted-foreground" />
                          </div>
                        ) : (
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(i)}
                          className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {mediaFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors"
                      >
                        <ImagePlus className="h-5 w-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
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

      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
        <p className="text-[10px] text-muted-foreground">⚠️ As oportunidades publicadas não são verificadas pela AZERA. Avalie cuidadosamente antes de participar ou investir.</p>
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
                  <div>
                    <h3 className="font-semibold text-foreground">{opp.title}</h3>
                    {authorNames[opp.user_id] && (
                      <p className="text-xs text-muted-foreground mt-0.5">Publicado por {authorNames[opp.user_id]}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {opp.equity_available && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <DollarSign className="h-3 w-3 mr-0.5" /> Equity
                      </Badge>
                    )}
                    {user && opp.user_id !== user.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          sendNotification({
                            user_id: opp.user_id,
                            type: "opportunity_reply",
                            title: `Alguém respondeu à sua oportunidade "${opp.title.slice(0, 50)}" 🎯`,
                            action_url: "/founder-messages",
                          });
                          navigate("/founder-messages", {
                            state: {
                              selectedUser: opp.user_id,
                              selectedUserName: authorNames[opp.user_id] || "Founder",
                              opportunityContext: opp.title,
                            }
                          });
                        }}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" /> Responder
                      </Button>
                    )}
                    {opp.user_id === user?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir oportunidade?</AlertDialogTitle>
                            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(opp.id)} disabled={deletingId === opp.id}>
                              {deletingId === opp.id ? "Excluindo..." : "Excluir"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                {opp.project && <p className="text-sm text-muted-foreground mt-1">Projeto: {opp.project}</p>}
                {opp.description && <p className="text-sm text-foreground/80 mt-2">{opp.description}</p>}

                {/* Media display */}
                {opp.media_urls && opp.media_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {opp.media_urls.map((url, i) => (
                      <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                        {isVideo(url) ? (
                          <video src={url} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={url} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(url, "_blank")} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {opp.looking_for && opp.looking_for.length > 0 && (
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
