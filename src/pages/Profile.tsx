import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2, ArrowLeft, Search, Rocket, Shield, Eye, Users, Briefcase, Lightbulb, Lock, Trash2, AlertTriangle, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EliteBadge from "@/components/EliteBadge";
import BadgeShowcase from "@/components/BadgeShowcase";
import AffiliateSection from "@/components/AffiliateSection";
import ProfileBackgroundPicker from "@/components/ProfileBackgroundPicker";
import ProfileBackgroundRenderer from "@/components/ProfileBackgroundRenderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  SKILL_OPTIONS, INDUSTRY_OPTIONS, LOOKING_FOR_OPTIONS,
  COMMITMENT_OPTIONS, COMMITMENT_LABELS, CONTINENT_OPTIONS, BUSINESS_INTERESTS,
} from "@/data/founderConstants";

function getFounderBadge(commitment: string | null, skills: string[] | null): string {
  if (!commitment && (!skills || skills.length === 0)) return "Fundador";
  const s = (skills || []).map(x => x.toLowerCase());
  if (s.includes("desenvolvedor") || s.includes("ai")) return "Desenvolvedor";
  if (s.includes("designer")) return "Designer";
  if (s.includes("marketing") || s.includes("vendas")) return "Estrategista";
  if (s.includes("finanças")) return "Investidor";
  if (commitment === "full_business") return "Builder";
  if (commitment === "side_project") return "Co-Fundador";
  return "Fundador";
}

export default function Profile() {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // profiles table
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // founder_profiles table
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [continent, setContinent] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string[]>([]);
  const [building, setBuilding] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [commitment, setCommitment] = useState("startup_idea");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  // read-only stats
  const [founderScore, setFounderScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [profileViews, setProfileViews] = useState(0);
  const [hasFounderProfile, setHasFounderProfile] = useState(false);

  // profile background
  const [activeBackground, setActiveBackground] = useState("none");
  const [earnedBadgesCount, setEarnedBadgesCount] = useState(0);

  // social proof
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [venturesCount, setVenturesCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [currentVenture, setCurrentVenture] = useState<any>(null);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [profileRes, founderRes, connRes, ventRes, oppRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("founder_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("founder_connections").select("id", { count: "exact", head: true })
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`).eq("status", "accepted"),
      supabase.from("ventures").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("founder_opportunities").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);

    if (profileRes.data) {
      const p = profileRes.data;
      setAge(p.age?.toString() || "");
      setProfession(p.profession || "");
      setBio(p.bio || "");
      setAvatarUrl(p.avatar_url || null);
      // Use founder name as fallback if display_name is empty
      const founderName = founderRes.data?.name || "";
      setDisplayName(p.display_name || founderName || "");
    }

    if (founderRes.data) {
      const f = founderRes.data as any;
      setHasFounderProfile(true);
      setCountry(f.country || "");
      setCity(f.city || "");
      setContinent(f.continent || "");
      setSkills(f.skills || []);
      setIndustry(f.industry || []);
      setBuilding(f.building || "");
      setLookingFor(f.looking_for || []);
      setCommitment(f.commitment || "startup_idea");
      setInterests(f.interests || []);
      setFounderScore(f.reputation_score || 0);
      setIsVerified(f.is_verified || false);
      setProfileViews(f.profile_views || 0);
      setUsername(f.username || "");
      setIsOwner(f.is_site_owner || false);
    }

    setConnectionsCount(connRes.count || 0);
    setVenturesCount(ventRes.data?.length || 0);
    if (ventRes.data && ventRes.data.length > 0) setCurrentVenture(ventRes.data[0]);
    setOpportunitiesCount(oppRes.count || 0);

    // Fetch profile visit count
    const { count: vc } = await supabase.from("profile_visits")
      .select("id", { count: "exact", head: true })
      .eq("profile_user_id", user!.id);
    setVisitCount(vc || 0);

    // Fetch active background
    const { data: bgData } = await supabase.from("profile_backgrounds" as any)
      .select("active_background")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (bgData) setActiveBackground((bgData as any).active_background || "none");

    // Fetch earned badges count
    const { count: badgeCount } = await supabase.from("user_badges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id);
    setEarnedBadgesCount(badgeCount || 0);

    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(newUrl);
      await supabase.from("profiles").update({ avatar_url: newUrl }).eq("user_id", user.id);
      if (hasFounderProfile) {
        await supabase.from("founder_profiles").update({ avatar_url: newUrl }).eq("user_id", user.id);
      }
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
      // Upsert profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: user.id,
        display_name: displayName,
        age: age ? parseInt(age) : null,
        location: [city, country].filter(Boolean).join(", ") || null,
        profession: profession || null,
        bio: bio || null,
        interests: interests.length ? interests : null,
      }, { onConflict: "user_id" });
      if (profileError) throw profileError;

      // Geocode city/country
      let latitude: number | null = null;
      let longitude: number | null = null;
      if (city && country) {
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ", " + country)}&limit=1`,
            { headers: { "User-Agent": "AzeraClub/1.0" } }
          );
          const geoData = await geoRes.json();
          if (geoData.length > 0) {
            latitude = parseFloat(geoData[0].lat);
            longitude = parseFloat(geoData[0].lon);
          }
        } catch {}
      }

      // Upsert founder_profiles
      const founderData: any = {
        user_id: user.id,
        name: displayName || "Founder",
        age: age ? parseInt(age) : null,
        country: country || null,
        city: city || null,
        continent: continent || null,
        skills: skills.length ? skills : [],
        industry: industry.length ? industry : [],
        building: building || null,
        looking_for: lookingFor.length ? lookingFor : [],
        commitment,
        interests: interests.length ? interests : [],
        avatar_url: avatarUrl,
        is_published: true,
        username: username || null,
      };

      const { error: founderError } = await supabase.from("founder_profiles").upsert(founderData, { onConflict: "user_id" });
      if (founderError) throw founderError;
      setHasFounderProfile(true);

      // Save GPS to founder_locations (separate table for privacy)
      if (latitude != null && longitude != null) {
        await supabase.from("founder_locations").upsert({
          user_id: user.id,
          latitude,
          longitude,
        }, { onConflict: "user_id" });
      }

      toast.success("Perfil salvo!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const toggleArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "EXCLUIR") {
      toast.error("Digite EXCLUIR para confirmar");
      return;
    }
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      toast.success("Conta excluída com sucesso");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir conta");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setDeleteConfirmText("");
    }
  };

  const filteredInterests = interestSearch
    ? BUSINESS_INTERESTS.filter(i => i.toLowerCase().includes(interestSearch.toLowerCase()))
    : BUSINESS_INTERESTS;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = displayName ? displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const badge = getFounderBadge(commitment, skills);
  const scorePercent = Math.min((founderScore / 1000) * 100, 100);

  const renderChips = (label: string, options: string[], selected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggleArray(setter, opt)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[44px] ${
              selected.includes(opt)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >{opt}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-1">Perfil Completo</h1>
        <EliteBadge className="mb-6" />

        {/* Founder Score + Badge + Stats (read-only) */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full cursor-pointer group shrink-0"
                onClick={() => fileInputRef.current?.click()}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-primary/40" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/40">
                    <span className="text-2xl font-bold text-foreground">{initials}</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Camera className="h-5 w-5 text-primary" />}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">{displayName || "Seu Nome"}</h2>
                   {isVerified && <Shield className="h-4 w-4 text-primary" />}
                   {isOwner ? (
                     <Badge className="owner-profile-badge px-3 py-1 gap-1.5 text-sm">
                       <Crown className="w-4 h-4 fill-current" />
                       <span className="font-bold tracking-wider">BRENTONY OWNER</span>
                     </Badge>
                   ) : (
                     <Badge variant="secondary" className="text-xs">{badge}</Badge>
                   )}
                </div>
                {(city || country) && (
                  <p className="text-sm text-muted-foreground">{[city, country].filter(Boolean).join(", ")}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground justify-center sm:justify-start">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{profileViews} visualizações</span>
                  <span className="flex items-center gap-1"><Rocket className="h-3 w-3" />Score: {founderScore}</span>
                </div>
                <Progress value={scorePercent} className="h-1.5 max-w-48" />
              </div>
            </div>

            {/* Profile Visits Trigger */}
            <div className="mt-5 rounded-lg border border-border/50 p-4 bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{visitCount} pessoas visitaram seu perfil</span>
                </div>
                {!canAccess("pro") && !isOwner && (
                  <button onClick={() => navigate("/planos")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Ver quem
                  </button>
                )}
              </div>
            </div>

            {/* Social Proof / Analytics */}
            {canAccess("pro") || isOwner ? (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { icon: Users, label: "Conexões", value: connectionsCount },
                  { icon: Briefcase, label: "Ventures", value: venturesCount },
                  { icon: Lightbulb, label: "Oportunidades", value: opportunitiesCount },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                    <s.icon className="h-4 w-4 text-primary mb-1" />
                    <span className="text-lg font-bold text-foreground">{s.value}</span>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative mt-5">
                <div className="pointer-events-none opacity-30 blur-[2px] select-none grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: "Conexões", value: connectionsCount },
                    { icon: Briefcase, label: "Ventures", value: venturesCount },
                    { icon: Lightbulb, label: "Oportunidades", value: opportunitiesCount },
                  ].map(s => (
                    <div key={s.label} className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                      <s.icon className="h-4 w-4 text-primary mb-1" />
                      <span className="text-lg font-bold text-foreground">{s.value}</span>
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
                  <Lock className="h-4 w-4 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Upgrade para ver insights</p>
                  <button onClick={() => navigate("/planos")} className="text-xs text-primary font-semibold mt-1 hover:underline">
                    Fazer Upgrade
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badge Showcase */}
        {user && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
            <CardContent className="pt-6">
              <BadgeShowcase userId={user.id} showLocked />
            </CardContent>
          </Card>
        )}

        {/* Profile Background Picker */}
        <ProfileBackgroundPicker
          currentBackground={activeBackground}
          founderScore={founderScore}
          onSelect={setActiveBackground}
          isOwner={isOwner}
          earnedBadgesCount={earnedBadgesCount}
        />

        {/* Current Venture (read-only) */}
        {currentVenture && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" /> Venture Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-foreground">{currentVenture.name}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {currentVenture.industry && <Badge variant="outline" className="text-[10px]">{currentVenture.industry}</Badge>}
                <Badge variant="secondary" className="text-[10px]">{currentVenture.status}</Badge>
              </div>
              <Button variant="link" className="px-0 mt-1 text-xs h-auto" onClick={() => navigate("/venture-builder")}>
                Ver no Venture Builder →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Editable Fields */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Username field */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Nome de Utilizador (ID público)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <Input
                    value={username}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
                      setUsername(val);
                      setUsernameError("");
                      if (val && (val.length < 3 || !/^[a-z0-9_]{3,20}$/.test(val))) {
                        setUsernameError("Mínimo 3 caracteres (letras, números, _)");
                      }
                    }}
                    onBlur={async () => {
                      if (!username || username.length < 3) return;
                      setCheckingUsername(true);
                      const { data } = await supabase.from("founder_profiles").select("id").eq("username", username).neq("user_id", user!.id).maybeSingle();
                      if (data) setUsernameError("Nome já em uso");
                      setCheckingUsername(false);
                    }}
                    placeholder="ex: joao123"
                    className="pl-8"
                    maxLength={20}
                  />
                </div>
                {username && !usernameError && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/founder-profile/${username}`);
                      toast.success("Link copiado!");
                    }}
                  >
                    Copiar Link
                  </Button>
                )}
              </div>
              {usernameError && <p className="text-[11px] text-destructive">{usernameError}</p>}
              {checkingUsername && <p className="text-[11px] text-muted-foreground">Verificando...</p>}
              {username && !usernameError && !checkingUsername && username.length >= 3 && (
                <p className="text-[11px] text-primary">✓ Disponível — seu perfil: /founder-profile/{username}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Nome</Label>
                <Input value={displayName} onChange={e => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Idade</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">País</Label>
                <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Brasil" />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Cidade</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="São Paulo" />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Continente</Label>
                <Select value={continent} onValueChange={setContinent}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {CONTINENT_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Profissão</Label>
              <Input value={profession} onChange={e => setProfession(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} placeholder="Sobre você..." className="resize-none" />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Elevator Pitch — O que você está construindo? (250 chars)</Label>
              <Textarea value={building} onChange={e => setBuilding(e.target.value.slice(0, 250))} rows={2}
                placeholder="Ex: Building an AI automation agency for small businesses." className="resize-none" />
              <p className="text-[10px] text-muted-foreground text-right">{building.length}/250</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills, Industry, Looking For, Commitment */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Perfil de Founder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {renderChips("Skills", SKILL_OPTIONS, skills, setSkills)}
            {renderChips("Indústria", INDUSTRY_OPTIONS, industry, setIndustry)}
            {renderChips("Procurando", LOOKING_FOR_OPTIONS, lookingFor, setLookingFor)}

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Nível de Comprometimento</Label>
              <Select value={commitment} onValueChange={setCommitment}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COMMITMENT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Interesses ({interests.length} selecionados)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={interestSearch} onChange={e => setInterestSearch(e.target.value)}
                placeholder="Buscar interesses..." className="pl-9 h-8 text-xs" />
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-1">
              {filteredInterests.map(interest => (
                <button key={interest} type="button" onClick={() => toggleArray(setInterests, interest)}
                  className={`px-2.5 py-1 min-h-[44px] rounded-full text-[11px] font-medium transition-all flex items-center ${
                    interests.includes(interest)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >{interest}</button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Section */}
        <AffiliateSection />

        {/* Save */}
        <Button onClick={handleSave} disabled={saving} className="w-full h-12 font-semibold uppercase tracking-wider text-xs">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          SALVAR ALTERAÇÕES
        </Button>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5 mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Zona de Perigo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
            </p>
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Perfil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" /> Excluir conta permanentemente
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>Esta ação é <strong>irreversível</strong>. Todos os seus dados, incluindo perfil, ventures, conexões e mensagens serão permanentemente excluídos.</p>
                    <p>Para confirmar, digite <strong>EXCLUIR</strong> abaixo:</p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                      placeholder="Digite EXCLUIR"
                      className="mt-2"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>Cancelar</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "EXCLUIR" || deleting}
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Excluir Conta
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
