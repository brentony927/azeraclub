import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddSocialEvent } from "@/hooks/useUserData";

export default function AddSocialEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [description, setDescription] = useState("");
  const add = useAddSocialEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add.mutate({ title, type: type || undefined, date: date || undefined, location: location || undefined, attendees: attendees ? Number(attendees) : undefined, description: description || undefined }, {
      onSuccess: () => { onOpenChange(false); setTitle(""); setType(""); setDate(""); setLocation(""); setAttendees(""); setDescription(""); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle className="font-serif">Novo Evento Social</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Título *</Label><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Jantar de Networking" className="bg-secondary/50 border-border/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Tipo</Label><Input value={type} onChange={e => setType(e.target.value)} placeholder="Conferência, Gala..." className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Data</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Local</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Cidade, País" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Convidados</Label><Input type="number" value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="0" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes do evento..." className="bg-secondary/50 border-border/50" /></div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground border-0" disabled={add.isPending}>{add.isPending ? "Salvando..." : "Adicionar Evento"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
