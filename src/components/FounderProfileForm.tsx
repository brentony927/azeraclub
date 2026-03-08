import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

const SKILL_OPTIONS = ["Developer", "Marketing", "AI", "Sales", "Designer", "Product", "Finance", "Operations"];
const INDUSTRY_OPTIONS = ["SaaS", "AI", "E-commerce", "Fintech", "Education", "Health", "Web3", "Agency"];
const LOOKING_FOR_OPTIONS = ["Co-founder", "Developer", "Investor", "Marketing Partner", "Designer"];
const COMMITMENT_OPTIONS = [
  { value: "side_project", label: "Side Project" },
  { value: "startup_idea", label: "Startup Idea" },
  { value: "full_business", label: "Full Business" },
];

interface FounderFormData {
  name: string;
  age: number | null;
  country: string;
  skills: string[];
  industry: string[];
  building: string;
  looking_for: string[];
  commitment: string;
}

interface FounderProfileFormProps {
  initialData?: Partial<FounderFormData>;
  onSubmit: (data: FounderFormData) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function FounderProfileForm({ initialData, onSubmit, loading, submitLabel = "Publicar Perfil" }: FounderProfileFormProps) {
  const [form, setForm] = useState<FounderFormData>({
    name: initialData?.name || "",
    age: initialData?.age || null,
    country: initialData?.country || "",
    skills: initialData?.skills || [],
    industry: initialData?.industry || [],
    building: initialData?.building || "",
    looking_for: initialData?.looking_for || [],
    commitment: initialData?.commitment || "startup_idea",
  });

  const toggleArrayField = (field: "skills" | "industry" | "looking_for", value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const renderMultiSelect = (label: string, field: "skills" | "industry" | "looking_for", options: string[]) => (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleArrayField(field, opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              form[field].includes(opt)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Rocket className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">Crie seu Perfil de Fundador</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Conecte-se com co-fundadores, parceiros e colaboradores.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input type="number" value={form.age ?? ""} onChange={e => setForm(p => ({ ...p, age: e.target.value ? Number(e.target.value) : null }))} placeholder="25" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>País</Label>
            <Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="Brasil" />
          </div>

          {renderMultiSelect("Skills", "skills", SKILL_OPTIONS)}
          {renderMultiSelect("Indústria", "industry", INDUSTRY_OPTIONS)}

          <div className="space-y-2">
            <Label>O que você está construindo?</Label>
            <Textarea
              value={form.building}
              onChange={e => setForm(p => ({ ...p, building: e.target.value }))}
              placeholder="Ex: Building an AI automation agency for small businesses."
              rows={3}
            />
          </div>

          {renderMultiSelect("Procurando", "looking_for", LOOKING_FOR_OPTIONS)}

          <div className="space-y-2">
            <Label>Nível de Comprometimento</Label>
            <Select value={form.commitment} onValueChange={v => setForm(p => ({ ...p, commitment: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {COMMITMENT_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !form.name.trim()}>
            {loading ? "Publicando..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
