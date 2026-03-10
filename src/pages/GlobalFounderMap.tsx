import { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Globe, MapPin, Search, Navigation, Filter, X, Users, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_OPTIONS, SKILL_OPTIONS, LOOKING_FOR_OPTIONS, COMMITMENT_OPTIONS } from "@/data/founderConstants";
import { sendNotification } from "@/lib/sendNotification";
import FeatureLock from "@/components/FeatureLock";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface FounderMapProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  skills: string[];
  industry: string[];
  looking_for: string[];
  building: string | null;
  commitment: string | null;
  country: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  reputation_score: number | null;
  is_verified: boolean | null;
  username: string | null;
  interests: string[];
}

function createPinIcon(tier: "business" | "pro" | "free") {
  const colors = {
    business: { bg: "#F59E0B", border: "#D97706", size: 16, glow: "0 0 12px rgba(245,158,11,0.6)" },
    pro: { bg: "#10B981", border: "#059669", size: 14, glow: "0 0 10px rgba(16,185,129,0.5)" },
    free: { bg: "#E5E7EB", border: "#9CA3AF", size: 12, glow: "none" },
  };
  const c = colors[tier];
  return L.divIcon({
    className: "custom-founder-pin",
    html: `<div style="
      width:${c.size}px;height:${c.size}px;
      background:${c.bg};border:2px solid ${c.border};
      border-radius:50%;box-shadow:${c.glow};
      transition:transform 0.2s;
    "></div>`,
    iconSize: [c.size, c.size],
    iconAnchor: [c.size / 2, c.size / 2],
  });
}

function FlyToLocation({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

export default function GlobalFounderMap() {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const isPro = canAccess("pro");
  const isBusiness = canAccess("business");
  const navigate = useNavigate();

  const [founders, setFounders] = useState<FounderMapProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [locating, setLocating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIndustry, setFilterIndustry] = useState<string[]>([]);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterLookingFor, setFilterLookingFor] = useState<string[]>([]);

  // Connections state
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [myProfile, setMyProfile] = useState<any>(null);

  useEffect(() => {
    loadFounders();
  }, [user]);

  const loadFounders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("founder_profiles")
      .select("id, user_id, name, avatar_url, skills, industry, looking_for, building, commitment, country, city, reputation_score, is_verified, username, interests")
      .eq("is_published", true);

    if (!error && data) {
      // Fetch rounded coordinates for each founder with location
      const foundersWithCoords: FounderMapProfile[] = [];
      for (const f of data) {
        const { data: coordData } = await supabase.rpc("get_rounded_coordinates", { p_user_id: f.user_id });
        const coords = coordData?.[0];
        if (coords?.latitude && coords?.longitude) {
          foundersWithCoords.push({
            ...f,
            latitude: coords.latitude,
            longitude: coords.longitude,
          } as FounderMapProfile);
        }
      }
      setFounders(foundersWithCoords);
    }

    if (user) {
      const { data: connData } = await supabase
        .from("founder_connections")
        .select("from_user_id, to_user_id, status")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);
      if (connData) {
        const map: Record<string, string> = {};
        connData.forEach((c: any) => {
          const other = c.from_user_id === user.id ? c.to_user_id : c.from_user_id;
          map[other] = c.status;
        });
        setConnections(map);
      }

      const { data: mp } = await supabase
        .from("founder_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setMyProfile(mp);
    }

    setLoading(false);
  };

  const handleConnect = async (targetUserId: string) => {
    if (!user) return;
    const { error } = await supabase.from("founder_connections").insert({
      from_user_id: user.id,
      to_user_id: targetUserId,
      status: "pending",
    });
    if (!error) {
      setConnections(prev => ({ ...prev, [targetUserId]: "pending" }));
      toast.success("Pedido de conexão enviado!");
      // Notification
      await sendNotification({
        user_id: targetUserId,
        title: "Nova solicitação de conexão",
        body: `${myProfile?.name || myProfile?.username || "Um founder"} quer se conectar com você.`,
        type: "connection",
        action_url: `/founder-profile/${user.id}`,
      });
    }
  };

  const handleFindNearMe = () => {
    if (!isPro) {
      toast.error("Recurso disponível para planos PRO e BUSINESS");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFlyTo({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 11 });
        setLocating(false);
        const nearby = founders.filter(f => {
          const dist = Math.sqrt(
            Math.pow(f.latitude - pos.coords.latitude, 2) +
            Math.pow(f.longitude - pos.coords.longitude, 2)
          ) * 111;
          return dist <= 50;
        });
        toast.success(`${nearby.length} founder${nearby.length !== 1 ? "s" : ""} dentro de 50km`);
      },
      () => {
        toast.error("Não foi possível obter localização");
        setLocating(false);
      }
    );
  };

  const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const filteredFounders = useMemo(() => {
    let result = founders.filter(f => f.user_id !== user?.id);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.country?.toLowerCase().includes(q) ||
        f.city?.toLowerCase().includes(q) ||
        f.building?.toLowerCase().includes(q)
      );
    }

    if (isPro && filterIndustry.length > 0) {
      result = result.filter(f => f.industry?.some(i => filterIndustry.includes(i)));
    }
    if (isPro && filterSkills.length > 0) {
      result = result.filter(f => f.skills?.some(s => filterSkills.includes(s)));
    }
    if (isPro && filterLookingFor.length > 0) {
      result = result.filter(f => f.looking_for?.some(l => filterLookingFor.includes(l)));
    }

    // Business founders first
    result.sort((a, b) => {
      const scoreA = (a.reputation_score || 0);
      const scoreB = (b.reputation_score || 0);
      return scoreB - scoreA;
    });

    return result;
  }, [founders, searchQuery, filterIndustry, filterSkills, filterLookingFor, isPro, user]);

  const uniqueCountries = useMemo(() => {
    const countries = new Set(filteredFounders.map(f => f.country).filter(Boolean));
    return countries.size;
  }, [filteredFounders]);

  const getFounderTier = (f: FounderMapProfile): "business" | "pro" | "free" => {
    // Since we don't have plan info on founder_profiles, use reputation as proxy
    // In production, you'd join with user_plans
    if ((f.reputation_score || 0) >= 80) return "business";
    if ((f.reputation_score || 0) >= 40) return "pro";
    return "free";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Globe className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm animate-pulse">Loading global founder network...</p>
        </motion.div>
        <div className="flex gap-6 mt-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border/50 bg-card/80 backdrop-blur-sm z-10"
      >
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Global Founder Map</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                <span className="font-semibold text-foreground">{filteredFounders.length}</span> Founders
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                <span className="font-semibold text-foreground">{uniqueCountries}</span> Countries
              </motion.span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search founders..."
              className="pl-8 h-8 w-48 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 text-xs gap-1"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button
            size="sm"
            onClick={handleFindNearMe}
            disabled={locating}
            className="h-8 text-xs gap-1"
          >
            <Navigation className="h-3.5 w-3.5" />
            {locating ? "Locating..." : "Near me"}
            {!isPro && <Lock className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Filters sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-md border-r border-border/50 z-20 overflow-y-auto p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filter Founders</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!isPro ? (
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center space-y-2">
                  <Lock className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Filtros avançados disponíveis no plano PRO</p>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/planos")}>
                    Upgrade
                  </Button>
                </div>
              ) : (
                <>
                  <FilterSection
                    label="Industry"
                    options={INDUSTRY_OPTIONS}
                    selected={filterIndustry}
                    onToggle={(val) => toggleFilter(filterIndustry, setFilterIndustry, val)}
                  />
                  <FilterSection
                    label="Skills"
                    options={SKILL_OPTIONS}
                    selected={filterSkills}
                    onToggle={(val) => toggleFilter(filterSkills, setFilterSkills, val)}
                  />
                  <FilterSection
                    label="Looking For"
                    options={LOOKING_FOR_OPTIONS}
                    selected={filterLookingFor}
                    onToggle={(val) => toggleFilter(filterLookingFor, setFilterLookingFor, val)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setFilterIndustry([]);
                      setFilterSkills([]);
                      setFilterLookingFor([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            zoomControl={true}
            minZoom={2}
            maxZoom={18}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {flyTo && <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} zoom={flyTo.zoom} />}
            {filteredFounders.map((founder) => {
              const tier = getFounderTier(founder);
              return (
                <Marker
                  key={founder.id}
                  position={[founder.latitude, founder.longitude]}
                  icon={createPinIcon(tier)}
                >
                  <Popup className="founder-popup" maxWidth={280} minWidth={240}>
                    <FounderPopupCard
                      founder={founder}
                      tier={tier}
                      connectionStatus={connections[founder.user_id]}
                      onConnect={() => handleConnect(founder.user_id)}
                      onViewProfile={() => navigate(`/founder-profile/${founder.username || founder.user_id}`)}
                      onMessage={() => navigate("/founder-messages")}
                    />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
          Business
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          PRO
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-300" />
          Founder
        </span>
      </div>
    </div>
  );
}

// Filter section component
function FilterSection({ label, options, selected, onToggle }: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
              selected.includes(opt)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Popup card component
function FounderPopupCard({ founder, tier, connectionStatus, onConnect, onViewProfile, onMessage }: {
  founder: FounderMapProfile;
  tier: "business" | "pro" | "free";
  connectionStatus?: string;
  onConnect: () => void;
  onViewProfile: () => void;
  onMessage: () => void;
}) {
  return (
    <div className="p-1 space-y-2 min-w-[220px]">
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 ${
          tier === "business" ? "border-amber-500" : tier === "pro" ? "border-emerald-500" : "border-border"
        }`}>
          {founder.avatar_url ? (
            <img src={founder.avatar_url} alt={founder.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-bold">
              {founder.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm truncate">{founder.name}</span>
            {tier === "business" && <span className="text-amber-500 text-xs">⭐</span>}
          </div>
          <p className="text-[10px] text-gray-400 truncate">
            {founder.industry?.slice(0, 2).join(" / ") || "Founder"}
          </p>
        </div>
      </div>

      {founder.reputation_score != null && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400">Score:</span>
          <span className="text-xs font-bold text-primary">{founder.reputation_score}</span>
        </div>
      )}

      {founder.looking_for && founder.looking_for.length > 0 && (
        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-400">Looking for:</span>
          <div className="flex flex-wrap gap-1">
            {founder.looking_for.slice(0, 2).map(l => (
              <span key={l} className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[9px]">{l}</span>
            ))}
          </div>
        </div>
      )}

      {founder.city && founder.country && (
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" />
          {founder.city}, {founder.country}
        </p>
      )}

      <div className="flex gap-1.5 pt-1">
        <button
          onClick={onViewProfile}
          className="flex-1 px-2 py-1 bg-primary text-primary-foreground rounded text-[10px] font-medium hover:opacity-90 transition"
        >
          View Profile
        </button>
        {connectionStatus === "accepted" ? (
          <button
            onClick={onMessage}
            className="flex-1 px-2 py-1 bg-secondary text-foreground rounded text-[10px] font-medium hover:opacity-90 transition"
          >
            Message
          </button>
        ) : connectionStatus === "pending" ? (
          <button disabled className="flex-1 px-2 py-1 bg-muted text-muted-foreground rounded text-[10px] font-medium cursor-not-allowed">
            Pending
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="flex-1 px-2 py-1 bg-secondary text-foreground rounded text-[10px] font-medium hover:opacity-90 transition"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
