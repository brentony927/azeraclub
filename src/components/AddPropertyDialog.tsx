import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddProperty } from "@/hooks/useUserData";

export default function AddPropertyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [valuation, setValuation] = useState("");
  const [monthlyExpense, setMonthlyExpense] = useState("");
  const [staff, setStaff] = useState("");
  const [image, setImage] = useState("");
  const addProp = useAddProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProp.mutate({
      name, city: city || undefined, country: country || undefined, type: type || undefined,
      valuation: valuation ? Number(valuation) : undefined, monthly_expense: monthlyExpense ? Number(monthlyExpense) : undefined,
      staff: staff ? Number(staff) : undefined, image: image || undefined,
    }, {
      onSuccess: () => { onOpenChange(false); setName(""); setCity(""); setCountry(""); setType(""); setValuation(""); setMonthlyExpense(""); setStaff(""); setImage(""); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle className="font-serif">Nova Propriedade</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} required placeholder="Penthouse Knightsbridge" className="bg-secondary/50 border-border/50" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Cidade</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="Londres" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>País</Label><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Reino Unido" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Tipo</Label><Input value={type} onChange={e => setType(e.target.value)} placeholder="Penthouse, Villa..." className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Staff</Label><Input type="number" value={staff} onChange={e => setStaff(e.target.value)} placeholder="0" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Avaliação (USD)</Label><Input type="number" value={valuation} onChange={e => setValuation(e.target.value)} placeholder="0" className="bg-secondary/50 border-border/50" /></div>
            <div className="space-y-2"><Label>Custo Mensal (USD)</Label><Input type="number" value={monthlyExpense} onChange={e => setMonthlyExpense(e.target.value)} placeholder="0" className="bg-secondary/50 border-border/50" /></div>
          </div>
          <div className="space-y-2"><Label>Imagem (URL)</Label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border/50" /></div>
          <Button type="submit" className="w-full gold-gradient text-primary-foreground border-0" disabled={addProp.isPending}>{addProp.isPending ? "Salvando..." : "Adicionar Propriedade"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
