import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Pencil, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  SKILL_OPTIONS, INDUSTRY_OPTIONS, LOOKING_FOR_OPTIONS,
  COMMITMENT_OPTIONS, CONTINENT_OPTIONS, BUSINESS_INTERESTS,
} from "@/data/founderConstants";

interface FounderFormData {
  name: string;
  username: string;
  age: number | null;
  country: string;
  city: string;
  continent: string;
  skills: string[];
  industry: string[];
  building: string;
  looking_for: string[];
  commitment: string;
  interests: string[];
  avatar_url?: string;
}

interface FounderProfileFormProps {
  initialData?: Partial<FounderFormData>;
  onSubmit: (data: FounderFormData) => void;
  loading?: boolean;
  submitLabel?: string;
  userId?: string;
}

export default function FounderProfileForm({ initialData, onSubmit, loading, submitLabel = "Publicar Perfil", userId }: FounderProfileFormProps) {
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + "_" + Math.floor(Math.random() * 1000);
  };

  const [form, setForm] = useState<FounderFormData>({
    name: initialData?.name || "",
    username: (initialData as any)?.username || "",
    age: initialData?.age || null,
    country: initialData?.country || "",
    city: initialData?.city || "",
    continent: initialData?.continent || "",
    skills: initialData?.skills || [],
    industry: initialData?.industry || [],
    building: initialData?.building || "",
    looking_for: initialData?.looking_for || [],
    commitment: initialData?.commitment || "startup_idea",
    interests: initialData?.interests || [],
  });

  const [interestSearch, setInterestSearch] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleArrayField = (field: "skills" | "industry" | "looking_for" | "interests", value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let avatar_url: string | undefined;

    if (avatarFile && userId) {
      setUploading(true);
      const ext = avatarFile.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }
      setUploading(false);
    }

    // Geocode city/country
    let latitude: number | undefined;
    let longitude: number | undefined;
    if (form.city && form.country) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.city + ", " + form.country)}&limit=1`,
          { headers: { "User-Agent": "AzeraClub/1.0" } }
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        }
      } catch {}
    }

    onSubmit({ ...form, avatar_url, ...(latitude != null && longitude != null ? { latitude, longitude } : {}) } as any);
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

  const filteredInterests = interestSearch
    ? BUSINESS_INTERESTS.filter(i => i.toLowerCase().includes(interestSearch.toLowerCase()))
    : BUSINESS_INTERESTS;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 rounded-full mx-auto mb-3 group overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors"
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Pencil className="h-5 w-5 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
              <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          )}
        </button>
        <p className="text-[11px] text-muted-foreground -mt-1 mb-2">
          {avatarPreview ? "Alterar foto" : "Adicionar Foto"}
        </p>
        <CardTitle className="text-xl font-bold">Crie seu Perfil de Fundador</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Conecte-se com co-fundadores, parceiros e colaboradores.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={e => {
                const newName = e.target.value;
                setForm(p => ({ ...p, name: newName, username: p.username || generateUsername(newName) }));
              }} required placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input type="number" value={form.age ?? ""} onChange={e => setForm(p => ({ ...p, age: e.target.value ? Number(e.target.value) : null }))} placeholder="25" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>País</Label>
              <Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="Brasil" />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="São Paulo" />
            </div>
            <div className="space-y-2">
              <Label>Continente</Label>
              <Select value={form.continent} onValueChange={v => setForm(p => ({ ...p, continent: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CONTINENT_OPTIONS.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          {/* Interests */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Interesses ({form.interests.length} selecionados)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={interestSearch}
                onChange={e => setInterestSearch(e.target.value)}
                placeholder="Buscar interesses..."
                className="pl-9 h-8 text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
              {filteredInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleArrayField("interests", interest)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    form.interests.includes(interest)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

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

          <Button type="submit" className="w-full" disabled={loading || uploading || !form.name.trim()}>
            {uploading ? "Enviando foto..." : loading ? "Publicando..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
