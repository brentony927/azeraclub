import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EliteBadge from "@/components/EliteBadge";

const INTEREST_OPTIONS = [
  "Viagens de Luxo",
  "Gastronomia",
  "Networking",
  "Arte & Cultura",
  "Bem-estar",
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name || "");
        setAge((data as any).age?.toString() || "");
        setLocation((data as any).location || "");
        setProfession((data as any).profession || "");
        setBio((data as any).bio || "");
        setInterests((data as any).interests || []);
        setAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(newUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: newUrl } as any)
        .eq("user_id", user.id);
      toast.success("Foto atualizada!");
    } catch (err: any) {
      toast.error(err.message || "Upload falhou");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          age: age ? parseInt(age) : null,
          location: location || null,
          profession: profession || null,
          bio: bio || null,
          interests: interests.length ? interests : null,
        } as any)
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Perfil salvo!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <h1 className="text-3xl font-serif font-bold moss-text mb-2">Perfil</h1>
        <EliteBadge className="mb-8" />

        <div className="glass-card p-6 md:p-8 space-y-8">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              className="relative w-28 h-28 rounded-full cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-2 border-primary/40" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/40">
                  <span className="text-2xl font-bold text-foreground">{initials}</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-accent" /> : <Camera className="h-6 w-6 text-accent" />}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <Label className="text-muted-foreground">Nome</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 bg-secondary/50 border-border/50 focus:border-primary/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Idade</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 bg-secondary/50 border-border/50 focus:border-primary/50" />
              </div>
              <div>
                <Label className="text-muted-foreground">Cidade</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="São Paulo, BR" className="mt-1 bg-secondary/50 border-border/50 focus:border-primary/50" />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Profissão</Label>
              <Input value={profession} onChange={(e) => setProfession(e.target.value)} className="mt-1 bg-secondary/50 border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <Label className="text-muted-foreground">Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Conte sobre você..." className="mt-1 bg-secondary/50 border-border/50 focus:border-primary/50 resize-none" />
            </div>

            {/* Interests */}
            <div>
              <Label className="text-muted-foreground mb-2 block">Interesses</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-1.5 text-sm font-medium transition-all border ${
                        selected
                          ? "bg-primary/20 border-primary text-accent"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Save */}
          <Button onClick={handleSave} disabled={saving} className="w-full moss-gradient text-primary-foreground font-semibold h-12 uppercase tracking-wider text-xs">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            SALVAR ALTERAÇÕES
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
