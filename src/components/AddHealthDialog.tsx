import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddHealthAppointment } from "@/hooks/useUserData";

export default function AddHealthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [provider, setProvider] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("médico");
  const [contact, setContact] = useState("");
  const add = useAddHealthAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add.mutate({ provider, specialty: specialty || undefined, date: date || undefined, time: time || undefined, location: location || undefined, type, contact: contact || undefined }, {
      onSuccess: () => { onOpenChange(false); setProvider(""); setSpecialty(""); setDate(""); setTime(""); setLocation(""); setType("médico"); setContact(""); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle className="font-serif">Nova Consulta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Profissional *</Label><Input value={provider} onChange={e => setProvider(e.target.value)} required placeholder="Dr. Nome" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Especialidade</Label><Input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Cardiologista" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2"><Label>Data</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Horário</Label><Input value={time} onChange={e => setTime(e.target.value)} placeholder="14:00" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="médico">Médico</SelectItem>
                  <SelectItem value="personal_trainer">Personal</SelectItem>
                  <SelectItem value="spa">Spa</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Local</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Clínica, Cidade" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Contato</Label><Input value={contact} onChange={e => setContact(e.target.value)} placeholder="+55 11..." className="bg-secondary/50 border-border/50" /></div>
          </div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground border-0" disabled={add.isPending}>{add.isPending ? "Salvando..." : "Adicionar Consulta"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
