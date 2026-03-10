import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Dumbbell, Stethoscope, Sparkles, Leaf, Plus } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHealthAppointments } from "@/hooks/useUserData";
import EmptyState from "@/components/EmptyState";
import AddHealthDialog from "@/components/AddHealthDialog";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const typeConfig: Record<string, { icon: typeof Dumbbell; color: string; label: string }> = {
  personal_trainer: { icon: Dumbbell, color: "text-orange-400 bg-orange-500/20", label: "Personal" },
  médico: { icon: Stethoscope, color: "text-blue-400 bg-blue-500/20", label: "Médico" },
  spa: { icon: Sparkles, color: "text-pink-400 bg-pink-500/20", label: "Spa" },
  wellness: { icon: Leaf, color: "text-emerald-400 bg-emerald-500/20", label: "Wellness" },
};

export default function Health() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: appointments = [], isLoading } = useHealthAppointments();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Assistente de <span className="gold-text">Saúde</span></h1>
          <p className="text-muted-foreground mt-1">Consultas, treinos e bem-estar organizado.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gold-gradient text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" />Adicionar
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : appointments.length === 0 ? (
        <EmptyState icon="💪" title="Nenhuma consulta agendada" description="Organize suas consultas médicas, treinos e sessões de bem-estar." actionLabel="Adicionar Consulta" onAction={() => setDialogOpen(true)} />
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const config = typeConfig[apt.type] || typeConfig.wellness;
            const Icon = config.icon;
            return (
              <motion.div key={apt.id} variants={item} className="glass-card-hover p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-sm">{apt.provider}</h3>
                        {apt.specialty && <p className="text-xs text-muted-foreground">{apt.specialty}</p>}
                      </div>
                      <Badge className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      {apt.date && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(apt.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                          {apt.time && ` às ${apt.time}`}
                        </span>
                      )}
                      {apt.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{apt.location}</span>}
                      {apt.contact && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{apt.contact}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AddHealthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </motion.div>
  );
}
