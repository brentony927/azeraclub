import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddTrip } from "@/hooks/useUserData";

export default function AddTripDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [dates, setDates] = useState("");
  const [hotel, setHotel] = useState("");
  const [transport, setTransport] = useState("");
  const [status, setStatus] = useState("pendente");
  const [image, setImage] = useState("");
  const addTrip = useAddTrip();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrip.mutate({ destination, country: country || undefined, dates: dates || undefined, hotel: hotel || undefined, transport: transport || undefined, status, image: image || undefined }, {
      onSuccess: () => { onOpenChange(false); setDestination(""); setCountry(""); setDates(""); setHotel(""); setTransport(""); setStatus("pendente"); setImage(""); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle className="font-serif">Nova Viagem</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Destino *</Label><Input value={destination} onChange={e => setDestination(e.target.value)} required placeholder="Maldivas" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>País</Label><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="País" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="space-y-2"><Label>Datas</Label><Input value={dates} onChange={e => setDates(e.target.value)} placeholder="15–22 Mar 2026" className="bg-secondary/50 border-border/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Hotel</Label><Input value={hotel} onChange={e => setHotel(e.target.value)} placeholder="Nome do hotel" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Transporte</Label><Input value={transport} onChange={e => setTransport(e.target.value)} placeholder="Jato privado" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Imagem (URL)</Label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border/50" /></div>
          </div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground border-0" disabled={addTrip.isPending}>{addTrip.isPending ? "Salvando..." : "Adicionar Viagem"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
