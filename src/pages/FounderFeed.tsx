import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import FounderCard from "@/components/FounderCard";
import FounderCardSkeleton from "@/components/FounderCardSkeleton";
import FounderNotifications from "@/components/FounderNotifications";
import FounderActivityFeed from "@/components/FounderActivityFeed";
import FounderParticlesBackground from "@/components/FounderParticlesBackground";
import UpgradeTrigger from "@/components/UpgradeTrigger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Users, Filter, X, Lock, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendNotification } from "@/lib/sendNotification";
import { calculateMatchScore } from "@/lib/founderMatch";
import {
  SKILL_OPTIONS, LOOKING_FOR_OPTIONS, CONTINENT_OPTIONS, BUSINESS_INTERESTS,
} from "@/data/founderConstants";
import NumberFlow from "@number-flow/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FounderProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  skills: string[];
  looking_for: string[];
  country: string | null;
  building: string | null;
  commitment: string | null;
  industry: string[];
  interests: string[];
  age: number | null;
  city: string | null;
  continent: string | null;
  reputation_score: number | null;
  is_verified: boolean | null;
  username: string | null;
}

export default function FounderFeed() {
  const { user } = useAuth();
  const { plan, canAccess } = useSubscription();
  const isPro = canAccess("pro");
  const isBusiness = canAccess("business");
  const [profiles, setProfiles] = useState<FounderProfile[]>([]);
  const [myProfile, setMyProfile] = useState<FounderProfile | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [lookingFilter, setLookingFilter] = useState<string[]>([]);
  const [continentFilter, setContinentFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 65]);
  const [interestFilter, setInterestFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Founder plan user plans for Business priority
  const [userPlans, setUserPlans] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [profilesRes, connectionsRes, myRes] = await Promise.all([
      supabase.from("founder_profiles").select("*").eq("is_published", true).neq("user_id", user.id),
      supabase.from("founder_connections").select("*").or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`),
      supabase.from("founder_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    if (profilesRes.error) {
      toast({ title: "Erro ao carregar founders", description: profilesRes.error.message, variant: "destructive" });
    }
    if (profilesRes.data) setProfiles(profilesRes.data as FounderProfile[]);
    if (myRes.data) setMyProfile(myRes.data as FounderProfile);
    if (connectionsRes.data) {
      const map: Record<string, string> = {};
      connectionsRes.data.forEach(c => {
        const otherId = c.from_user_id === user.id ? c.to_user_id : c.from_user_id;
        map[otherId] = c.status;
      });
      setConnections(map);
    }
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription for new/updated profiles
  useEffect(() => {
    const channel = supabase
      .channel("founder-profiles-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "founder_profiles" },
        () => { fetchData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // Auto-refresh when tab regains focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleConnect = async (targetUserId: string) => {
    if (!user) return;
    const { error } = await supabase.from("founder_connections").insert({
      from_user_id: user.id,
      to_user_id: targetUserId,
      status: "pending",
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setConnections(prev => ({ ...prev, [targetUserId]: "pending" }));
      await sendNotification({
        user_id: targetUserId,
        type: "connection",
        title: `${myProfile?.name || "Alguém"} quer se conectar com você`,
        body: myProfile?.building || null,
      });
      toast({ title: "Solicitação enviada! 🤝" });
    }
  };

  const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const clearFilters = () => {
    setSkillFilter([]);
    setLookingFilter([]);
    setContinentFilter("");
    setCountryFilter("");
    setAgeRange([18, 65]);
    setInterestFilter([]);
    setSearch("");
  };

  const hasActiveFilters = skillFilter.length > 0 || lookingFilter.length > 0 || continentFilter || countryFilter || interestFilter.length > 0 || ageRange[0] !== 18 || ageRange[1] !== 65;

  let filtered = profiles.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.building?.toLowerCase().includes(search.toLowerCase()) && !p.username?.toLowerCase().includes(search.toLowerCase())) return false;
    // Founder: only city + interests filters work
    if (!isPro) {
      if (countryFilter && !p.country?.toLowerCase().includes(countryFilter.toLowerCase())) return false;
      if (interestFilter.length && !interestFilter.some(i => p.interests?.includes(i))) return false;
      return true;
    }
    // PRO+ filters
    if (skillFilter.length && !skillFilter.some(s => p.skills?.includes(s))) return false;
    if (lookingFilter.length && !lookingFilter.some(l => p.looking_for?.includes(l))) return false;
    if (continentFilter && p.continent !== continentFilter) return false;
    if (countryFilter && !p.country?.toLowerCase().includes(countryFilter.toLowerCase())) return false;
    if (p.age !== null && (p.age < ageRange[0] || p.age > ageRange[1])) return false;
    if (interestFilter.length && !interestFilter.some(i => p.interests?.includes(i))) return false;
    return true;
  });

  const withScores = filtered.map(p => ({
    ...p,
    matchScore: myProfile ? calculateMatchScore(myProfile, p) : 0,
  }));

  withScores.sort((a, b) => b.matchScore - a.matchScore);

  // For Founder: cap at 5
  const FOUNDER_LIMIT = 5;
  const totalResults = withScores.length;
  const displayResults = isPro ? withScores : withScores.slice(0, FOUNDER_LIMIT);
  const hiddenCount = isPro ? 0 : Math.max(0, totalResults - FOUNDER_LIMIT);

  const renderChipFilter = (label: string, options: string[], selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(s => (
          <button
            key={s}
            onClick={() => toggleFilter(selected, setSelected, s)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              selected.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );

  const renderLockedFilter = (label: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="opacity-50 cursor-not-allowed">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            {label} <Lock className="h-3 w-3" />
          </p>
          <div className="h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">PRO</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Disponível no plano Pro</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <FounderParticlesBackground />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" /> Founder Feed
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              <NumberFlow value={profiles.length} /> fundadores na AZERA CLUB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FounderNotifications />
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" /> Filtros
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar fundadores..."
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-card/80 border border-border/50 rounded-xl p-5 mb-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Filtros Avançados</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="h-3 w-3 mr-1" /> Limpar
                </Button>
              )}
            </div>

            {/* Founder: only country + interests. PRO+: all */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isPro ? (
                <div>
                  <Label className="text-xs text-muted-foreground">Continente</Label>
                  <Select value={continentFilter} onValueChange={setContinentFilter}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {CONTINENT_OPTIONS.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : renderLockedFilter("Continente")}
              <div>
                <Label className="text-xs text-muted-foreground">País</Label>
                <Input value={countryFilter} onChange={e => setCountryFilter(e.target.value)} placeholder="Ex: Brasil" className="h-8 text-xs" />
              </div>
              {isPro ? (
                <div>
                  <Label className="text-xs text-muted-foreground">Faixa Etária: {ageRange[0]} — {ageRange[1]}{ageRange[1] >= 65 ? "+" : ""}</Label>
                  <Slider
                    value={ageRange}
                    onValueChange={v => setAgeRange(v as [number, number])}
                    min={18}
                    max={65}
                    step={1}
                    className="mt-2"
                  />
                </div>
              ) : renderLockedFilter("Faixa Etária")}
            </div>

            {isPro ? renderChipFilter("Skills", SKILL_OPTIONS, skillFilter, setSkillFilter) : renderLockedFilter("Skills")}
            {isPro ? renderChipFilter("Procurando", LOOKING_FOR_OPTIONS, lookingFilter, setLookingFilter) : renderLockedFilter("Procurando")}

            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Interesses</p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {BUSINESS_INTERESTS.slice(0, 20).map(i => (
                  <button
                    key={i}
                    onClick={() => toggleFilter(interestFilter, setInterestFilter, i)}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                      interestFilter.includes(i) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {i}
                  </button>
                ))}
                {BUSINESS_INTERESTS.length > 20 && !interestFilter.length && (
                  <span className="text-[10px] text-muted-foreground self-center">+{BUSINESS_INTERESTS.length - 20} mais</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FounderCardSkeleton key={i} />
            ))}
          </div>
        ) : displayResults.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum fundador encontrado.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayResults.map(p => (
                <FounderCard
                  key={p.id}
                  id={p.id}
                  userId={p.user_id}
                  name={p.name}
                  avatarUrl={p.avatar_url}
                  skills={p.skills || []}
                  lookingFor={p.looking_for || []}
                  country={p.country}
                  building={p.building}
                  commitment={p.commitment}
                  onConnect={handleConnect}
                  isConnected={connections[p.user_id] === "accepted"}
                  isPending={connections[p.user_id] === "pending"}
                  matchScore={p.matchScore}
                  username={p.username}
                />
              ))}
            </div>

            {/* Founder radar limit upgrade trigger */}
            {hiddenCount > 0 && (
              <div className="mt-6">
                <UpgradeTrigger
                  stat={`+${hiddenCount}`}
                  message={`mais ${hiddenCount} founders combinam com os teus interesses. Desbloqueie o radar completo com PRO.`}
                  targetPlan="pro"
                />
              </div>
            )}
          </>
        )}

        {!loading && displayResults.length > 0 && (
          <div className="mt-8 p-4 bg-card/60 border border-border/50 rounded-xl">
            <FounderActivityFeed />
          </div>
        )}
      </div>
    </div>
  );
}
