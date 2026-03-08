import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import FounderCard from "@/components/FounderCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SKILL_FILTERS = ["Developer", "Marketing", "AI", "Sales", "Designer", "Product"];
const LOOKING_FILTERS = ["Co-founder", "Developer", "Investor", "Marketing Partner", "Designer"];

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
}

export default function FounderFeed() {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [profiles, setProfiles] = useState<FounderProfile[]>([]);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [lookingFilter, setLookingFilter] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profilesRes, connectionsRes] = await Promise.all([
        supabase.from("founder_profiles").select("*").eq("is_published", true).neq("user_id", user.id),
        supabase.from("founder_connections").select("*").or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`),
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data);
      if (connectionsRes.data) {
        const map: Record<string, string> = {};
        connectionsRes.data.forEach(c => {
          const otherId = c.from_user_id === user.id ? c.to_user_id : c.from_user_id;
          map[otherId] = c.status;
        });
        setConnections(map);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

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
      toast({ title: "Solicitação enviada! 🤝" });
    }
  };

  const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  let filtered = profiles.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.building?.toLowerCase().includes(search.toLowerCase())) return false;
    if (skillFilter.length && !skillFilter.some(s => p.skills.includes(s))) return false;
    if (lookingFilter.length && !lookingFilter.some(l => p.looking_for.includes(l))) return false;
    return true;
  });

  // Business users first (check user_plans would need join — simplified: just sort by name for now)
  // In a real scenario we'd join with user_plans

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6" /> Founder Feed
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Encontre parceiros, co-fundadores e colaboradores.</p>
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

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {SKILL_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => toggleFilter(skillFilter, setSkillFilter, s)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  skillFilter.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Procurando</p>
          <div className="flex flex-wrap gap-1.5">
            {LOOKING_FILTERS.map(l => (
              <button
                key={l}
                onClick={() => toggleFilter(lookingFilter, setLookingFilter, l)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  lookingFilter.includes(l) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum fundador encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <FounderCard
              key={p.id}
              id={p.id}
              userId={p.user_id}
              name={p.name}
              avatarUrl={p.avatar_url}
              skills={p.skills}
              lookingFor={p.looking_for}
              country={p.country}
              building={p.building}
              commitment={p.commitment}
              onConnect={handleConnect}
              isConnected={connections[p.user_id] === "accepted"}
              isPending={connections[p.user_id] === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
