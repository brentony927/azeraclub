import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Calendar, Filter, Plus, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import Icon3D from "@/components/ui/icon-3d";
import { Badge } from "@/components/ui/badge";
import { useExperiences, useToggleExperienceSaved } from "@/hooks/useUserData";
import EmptyState from "@/components/EmptyState";
import AddExperienceDialog from "@/components/AddExperienceDialog";
import MinimalDock from "@/components/ui/minimal-dock";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const categories = ["Todos", "Gastronomia", "Arte", "Relógios", "Entretenimento", "Automotivo", "Outros"];

export default function Experiences() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: experiences = [], isLoading } = useExperiences();
  const toggleSaved = useToggleExperienceSaved();

  const filtered = activeCategory === "Todos" ? experiences : experiences.filter((e) => e.category === activeCategory);

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 pb-24">
        <motion.div variants={item} className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Experiências <span className="gold-text">Exclusivas</span></h1>
            <p className="text-muted-foreground mt-1">Descubra experiências curadas para o seu estilo de vida.</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gold-gradient text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-2" />Adicionar
          </Button>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)}
              className={`text-xs ${activeCategory === cat ? "gold-gradient text-primary-foreground border-0" : "border-border/50 text-muted-foreground hover:text-foreground"}`}>{cat}</Button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Icon3D icon={Wine} color="red" size="lg" animated />} title="Nenhuma experiência ainda" description="Adicione suas primeiras experiências exclusivas e comece a personalizar sua agenda." actionLabel="Adicionar Experiência" onAction={() => setDialogOpen(true)} />
        ) : (
          <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((exp) => (
              <motion.div key={exp.id} variants={item} className="glass-card-hover overflow-hidden group">
                <div className="relative h-44 overflow-hidden">
                  {exp.image ? (
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center"><Icon3D icon={Wine} color="red" size="lg" animated /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-card/60 backdrop-blur text-xs text-foreground border-border/30">{exp.category}</Badge>
                  <button onClick={() => toggleSaved.mutate({ id: exp.id, saved: !exp.saved })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/60 backdrop-blur flex items-center justify-center transition-colors hover:bg-card/80">
                    <Bookmark className={`h-4 w-4 ${exp.saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-semibold text-base leading-tight">{exp.title}</h3>
                  {exp.description && <p className="text-xs text-muted-foreground line-clamp-2">{exp.description}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                    {exp.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>}
                    {exp.time && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{exp.time}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AddExperienceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </motion.div>

      <MinimalDock />
    </>
  );
}
