import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Hotel, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTrips } from "@/hooks/useUserData";
import EmptyState from "@/components/EmptyState";
import AddTripDialog from "@/components/AddTripDialog";
import { ListSection } from "@/components/ui/list-section";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const statusStyles: Record<string, string> = {
  confirmado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  concluído: "bg-muted text-muted-foreground border-border",
};

export default function Travel() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: trips = [], isLoading } = useTrips();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Concierge de <span className="gold-text">Viagens</span></h1>
          <p className="text-muted-foreground mt-1">Gerencie suas viagens, jatos e itinerários.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gold-gradient text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" />Adicionar
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : trips.length === 0 ? (
        <EmptyState icon="✈️" title="Nenhuma viagem planejada" description="Comece a planejar suas viagens exclusivas e gerencie seus itinerários." actionLabel="Adicionar Viagem" onAction={() => setDialogOpen(true)} />
      ) : (
        <div className="space-y-5">
          {trips.map((trip) => (
            <motion.div key={trip.id} variants={item} className="glass-card-hover overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                  {trip.image ? (
                    <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-4xl">✈️</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 hidden md:block" />
                </div>
                <div className="flex-1 p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-bold">{trip.destination}</h3>
                      {trip.country && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{trip.country}</p>}
                    </div>
                    <Badge className={`text-xs capitalize ${statusStyles[trip.status] || ""}`}>{trip.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {trip.dates && <div className="space-y-1"><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Datas</p><p className="text-sm font-medium">{trip.dates}</p></div>}
                    {trip.hotel && <div className="space-y-1"><p className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Hotel className="h-3 w-3" /> Hotel</p><p className="text-sm font-medium">{trip.hotel}</p></div>}
                    {trip.transport && <div className="space-y-1"><p className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Plane className="h-3 w-3" /> Transporte</p><p className="text-sm font-medium">{trip.transport}</p></div>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Achievements & Destinations */}
      <motion.div variants={item}>
        <ListSection />
      </motion.div>

      <AddTripDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </motion.div>
  );
}
