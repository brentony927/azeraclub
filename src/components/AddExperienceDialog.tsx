import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddExperience } from "@/hooks/useUserData";

const categories = ["Gastronomia", "Arte", "Relógios", "Entretenimento", "Automotivo", "Outros"];

export default function AddExperienceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Outros");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const addExp = useAddExperience();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExp.mutate({ title, category, location: location || undefined, date: date || undefined, time: time || undefined, description: description || undefined, image: image || undefined }, {
      onSuccess: () => { onOpenChange(false); resetForm(); },
    });
  };

  const resetForm = () => { setTitle(""); setCategory("Outros"); setLocation(""); setDate(""); setTime(""); setDescription(""); setImage(""); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle className="font-serif">Nova Experiência</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Título *</Label><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Degustação de vinhos" className="bg-secondary/50 border-border/50" /></div>
          <div className="space-y-2"><Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Local</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Cidade, País" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Data</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Horário</Label><Input value={time} onChange={e => setTime(e.target.value)} placeholder="20:00" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Imagem (URL)</Label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da experiência..." className="bg-secondary/50 border-border/50" /></div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground border-0" disabled={addExp.isPending}>{addExp.isPending ? "Salvando..." : "Adicionar Experiência"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
