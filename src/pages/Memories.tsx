import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Flame, Image, Heart, Trash2, Calendar } from "lucide-react";
import { CardStack3D } from "@/components/ui/3d-flip-card";

interface Memory {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  memory_date: string | null;
  type: string;
  candle_message: string | null;
  created_at: string;
}

export default function Memories() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [candles, setCandles] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [candleDialogOpen, setCandleDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [candleTitle, setCandleTitle] = useState("");
  const [candleMessage, setCandleMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setMemories(data.filter((m: Memory) => m.type === "memory"));
      setCandles(data.filter((m: Memory) => m.type === "candle"));
    }
    setLoading(false);
  };

  const handleAddMemory = async () => {
    if (!title.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("memories").insert({
      user_id: user.id,
      title,
      description: description || null,
      image_url: imageUrl || null,
      memory_date: memoryDate || null,
      type: "memory",
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar memória");
    } else {
      toast.success("Memória salva!");
      setTitle(""); setDescription(""); setImageUrl(""); setMemoryDate("");
      setDialogOpen(false);
      fetchAll();
    }
  };

  const handleAddCandle = async () => {
    if (!candleTitle.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("memories").insert({
      user_id: user.id,
      title: candleTitle,
      candle_message: candleMessage || null,
      type: "candle",
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao acender vela");
    } else {
      toast.success("Vela acesa com carinho 🕯️");
      setCandleTitle(""); setCandleMessage("");
      setCandleDialogOpen(false);
      fetchAll();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (!error) {
      toast.success("Removido");
      fetchAll();
    }
  };

  const memoryImages = memories
    .filter((m) => m.image_url)
    .slice(0, 4)
    .map((m) => ({ src: m.image_url!, alt: m.title }));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Memórias & Velas</h1>
          <p className="text-muted-foreground mt-1">Guarde seus momentos e acenda velas para quem você ama</p>
        </div>
      </div>

      <Tabs defaultValue="memories" className="w-full">
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="memories" className="data-[state=active]:bg-primary/20 data-[state=active]:text-accent">
            <Image className="h-4 w-4 mr-2" /> Memórias
          </TabsTrigger>
          <TabsTrigger value="candles" className="data-[state=active]:bg-primary/20 data-[state=active]:text-accent">
            <Flame className="h-4 w-4 mr-2" /> Velas
          </TabsTrigger>
        </TabsList>

        {/* MEMÓRIAS TAB */}
        <TabsContent value="memories" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="moss-gradient text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" /> Nova Memória
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Memória</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-muted-foreground">Título</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Um momento especial..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Descrição</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Conte sobre essa memória..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">URL da Imagem</Label>
                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data</Label>
                    <Input type="date" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} className="bg-secondary/50 border-border/50" />
                  </div>
                  <Button onClick={handleAddMemory} disabled={saving || !title.trim()} className="w-full moss-gradient text-primary-foreground">
                    {saving ? "Salvando..." : "Salvar Memória"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 3D Card Stack Preview */}
          {memoryImages.length >= 2 && (
            <div className="flex justify-center py-8">
              <CardStack3D images={memoryImages} cardWidth={280} cardHeight={180} spacing={{ x: 40, y: 30 }} />
            </div>
          )}

          {/* Memory Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 animate-pulse h-48" />
              ))}
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma memória ainda. Crie a primeira!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {memories.map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card overflow-hidden group"
                  >
                    {memory.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img src={memory.image_url} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{memory.title}</h3>
                        <button onClick={() => handleDelete(memory.id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {memory.description && <p className="text-sm text-muted-foreground line-clamp-2">{memory.description}</p>}
                      {memory.memory_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(memory.memory_date).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* VELAS TAB */}
        <TabsContent value="candles" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Dialog open={candleDialogOpen} onOpenChange={setCandleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="moss-gradient text-primary-foreground">
                  <Flame className="h-4 w-4 mr-2" /> Acender Vela
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Acender uma Vela</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-muted-foreground">Para quem?</Label>
                    <Input value={candleTitle} onChange={(e) => setCandleTitle(e.target.value)} placeholder="Nome ou dedicatória..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Mensagem (opcional)</Label>
                    <Textarea value={candleMessage} onChange={(e) => setCandleMessage(e.target.value)} placeholder="Uma oração, pensamento ou desejo..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <Button onClick={handleAddCandle} disabled={saving || !candleTitle.trim()} className="w-full moss-gradient text-primary-foreground">
                    {saving ? "Acendendo..." : "Acender Vela 🕯️"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 animate-pulse h-40" />
              ))}
            </div>
          ) : candles.length === 0 ? (
            <div className="text-center py-16">
              <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma vela acesa ainda. Acenda a primeira!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {candles.map((candle) => (
                  <motion.div
                    key={candle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-6 text-center group relative"
                  >
                    <button onClick={() => handleDelete(candle.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Animated Candle */}
                    <div className="relative mx-auto w-16 h-24 mb-4">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-16 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-sm rounded-b-lg" />
                      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-600" />
                      <motion.div
                        className="absolute bottom-[72px] left-1/2 -translate-x-1/2"
                        animate={{
                          scale: [1, 1.2, 0.9, 1.1, 1],
                          opacity: [0.8, 1, 0.7, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full blur-[1px]" />
                        <div className="absolute inset-0 w-4 h-6 bg-gradient-to-t from-orange-400 to-transparent rounded-full opacity-50 blur-sm" />
                      </motion.div>
                      <motion.div
                        className="absolute bottom-[68px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-400/20 blur-xl"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>

                    <h3 className="font-semibold text-foreground">{candle.title}</h3>
                    {candle.candle_message && (
                      <p className="text-sm text-muted-foreground mt-2 italic">"{candle.candle_message}"</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(candle.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
