import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, CalendarDays, Check, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSocialEvents, useUpdateSocialEventRsvp } from "@/hooks/useUserData";
import EmptyState from "@/components/EmptyState";
import AddSocialEventDialog from "@/components/AddSocialEventDialog";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const rsvpStyles: Record<string, string> = {
  confirmado: "bg-emerald-500/20 text-emerald-400",
  interessado: "bg-primary/20 text-primary",
  pendente: "bg-muted text-muted-foreground",
};

const typeIcons: Record<string, string> = {
  Conferência: "🎤", Networking: "🤝", Gala: "✨", VIP: "💎",
};

export default function Social() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: events = [], isLoading } = useSocialEvents();
  const updateRsvp = useUpdateSocialEventRsvp();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Radar <span className="gold-text">Social</span></h1>
          <p className="text-muted-foreground mt-1">Networking, conferências e eventos VIP.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gold-gradient text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" />Adicionar
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : events.length === 0 ? (
        <EmptyState icon="💎" title="Nenhum evento social" description="Adicione eventos de networking, conferências e galas ao seu radar social." actionLabel="Adicionar Evento" onAction={() => setDialogOpen(true)} />
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <motion.div key={ev.id} variants={item} className="glass-card-hover p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                  {typeIcons[ev.type || ""] || "📅"}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-semibold text-base">{ev.title}</h3>
                      <Badge className={`text-[10px] mt-1 ${rsvpStyles[ev.rsvp] || ""}`}>{ev.rsvp}</Badge>
                    </div>
                    {ev.type && <span className="text-xs text-muted-foreground shrink-0">{ev.type}</span>}
                  </div>
                  {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    {ev.date && <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(ev.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>}
                    {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                    {ev.attendees > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev.attendees} convidados</span>}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant={ev.rsvp === "confirmado" ? "default" : "outline"}
                      className={`text-xs ${ev.rsvp === "confirmado" ? "gold-gradient text-primary-foreground border-0" : "border-border/50"}`}
                      onClick={() => updateRsvp.mutate({ id: ev.id, rsvp: "confirmado" })}>
                      <Check className="h-3 w-3 mr-1" /> Confirmar
                    </Button>
                    <Button size="sm" variant={ev.rsvp === "interessado" ? "default" : "outline"}
                      className={`text-xs ${ev.rsvp === "interessado" ? "bg-primary/20 text-primary border-primary/30" : "border-border/50"}`}
                      onClick={() => updateRsvp.mutate({ id: ev.id, rsvp: "interessado" })}>
                      <Star className="h-3 w-3 mr-1" /> Interessado
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddSocialEventDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </motion.div>
  );
}
