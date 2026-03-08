import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Crown, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EliteEvent { id: string; title: string; description: string | null; event_date: string | null; location: string | null; category: string; }
interface Invitation { event_id: string; status: string; }

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function EliteEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EliteEvent[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ev }, { data: inv }] = await Promise.all([
        (supabase.from("elite_events" as any).select("*") as any).order("event_date", { ascending: true }),
        (supabase.from("event_invitations" as any).select("event_id,status") as any).eq("user_id", user.id),
      ]);
      if (ev) setEvents(ev);
      if (inv) setInvitations(inv);
    })();
  }, [user]);

  const requestInvite = async (eventId: string) => {
    if (!user) return;
    const { error } = await (supabase.from("event_invitations" as any).insert as any)({ event_id: eventId, user_id: user.id });
    if (error) { toast.error("Erro ao solicitar convite"); return; }
    setInvitations(prev => [...prev, { event_id: eventId, status: "pending" }]);
    toast.success("Convite solicitado!");
  };

  const getInvStatus = (eventId: string) => invitations.find(i => i.event_id === eventId);

  return (
    <FeatureLock minTier="business" featureName="Eventos de Networking Exclusivos">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Eventos Exclusivos</h1>
          <p className="text-muted-foreground text-sm mt-1">Eventos privados de networking exclusivos</p>
        </motion.div>

        {events.length === 0 ? (
          <motion.div variants={item}>
            <Card className="p-12 text-center">
              <Crown className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum evento agendado no momento.</p>
              <p className="text-muted-foreground text-xs mt-1">Volte em breve para eventos exclusivos.</p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {events.map((ev) => {
              const inv = getInvStatus(ev.id);
              return (
                <motion.div key={ev.id} variants={item}>
                  <Card className="hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{ev.title}</p>
                          {ev.description && <p className="text-xs text-muted-foreground mt-1">{ev.description}</p>}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-[10px]">{ev.category}</Badge>
                            {ev.event_date && <span className="text-[11px] text-muted-foreground">{new Date(ev.event_date).toLocaleDateString("pt-BR")}</span>}
                            {ev.location && <span className="text-[11px] text-muted-foreground">📍 {ev.location}</span>}
                          </div>
                        </div>
                        {inv ? (
                          <Badge variant={inv.status === "approved" ? "default" : "secondary"} className="text-[10px]">
                            {inv.status === "approved" ? "Aprovado" : inv.status === "pending" ? "Pendente" : inv.status}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => requestInvite(ev.id)} className="gap-1 text-xs">
                            <Send className="h-3.5 w-3.5" /> Solicitar Convite
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
