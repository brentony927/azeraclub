import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Plus, Home } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useUserData";
import EmptyState from "@/components/EmptyState";
import AddPropertyDialog from "@/components/AddPropertyDialog";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

export default function Properties() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: properties = [], isLoading } = useProperties();

  const totalValue = properties.reduce((s, p) => s + Number(p.valuation || 0), 0);
  const totalExpenses = properties.reduce((s, p) => s + Number(p.monthly_expense || 0), 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Gestão de <span className="gold-text">Propriedades</span></h1>
          <p className="text-muted-foreground mt-1">Portfólio imobiliário e valorização patrimonial.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gold-gradient text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" />Adicionar
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : properties.length === 0 ? (
        <EmptyState icon={<Icon3D icon={Home} color="silver" size="lg" animated />} title="Nenhuma propriedade cadastrada" description="Adicione suas propriedades para gerenciar seu portfólio imobiliário." actionLabel="Adicionar Propriedade" onAction={() => setDialogOpen(true)} />
      ) : (
        <>
          <motion.div variants={item} className="grid sm:grid-cols-3 gap-4">
            <div className="stat-card"><p className="text-xs text-muted-foreground mb-1">Valor Total</p><p className="text-xl font-serif font-bold gold-text">{formatCurrency(totalValue)}</p></div>
            <div className="stat-card"><p className="text-xs text-muted-foreground mb-1">Custo Mensal</p><p className="text-xl font-serif font-bold">{formatCurrency(totalExpenses)}</p></div>
            <div className="stat-card"><p className="text-xs text-muted-foreground mb-1">Propriedades</p><p className="text-xl font-serif font-bold">{properties.length}</p></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {properties.map((prop) => (
              <motion.div key={prop.id} variants={item} className="glass-card-hover overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  {prop.image ? (
                    <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center"><Icon3D icon={Home} color="silver" size="lg" animated /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-serif font-bold">{prop.name}</h3>
                    <p className="text-xs text-muted-foreground">{[prop.city, prop.country].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-[11px] text-muted-foreground uppercase">Avaliação</p><p className="text-sm font-semibold gold-text">{formatCurrency(Number(prop.valuation || 0))}</p></div>
                    <div><p className="text-[11px] text-muted-foreground uppercase flex items-center justify-center gap-1"><Building2 className="h-3 w-3" /> Tipo</p><p className="text-sm font-semibold">{prop.type || "—"}</p></div>
                    <div><p className="text-[11px] text-muted-foreground uppercase flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Staff</p><p className="text-sm font-semibold">{prop.staff || 0}</p></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AddPropertyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </motion.div>
  );
}
