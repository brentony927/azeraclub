import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, UserPlus, Loader2 } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "opportunity" | "profile";
  text: string;
  created_at: string;
}

export default function FounderActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const [opps, profiles] = await Promise.all([
        supabase.from("founder_opportunities").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("founder_profiles").select("id, name, looking_for, created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(5),
      ]);

      const activities: ActivityItem[] = [];

      opps.data?.forEach(o => {
        activities.push({ id: o.id, type: "opportunity", text: `Nova oportunidade: ${o.title}`, created_at: o.created_at });
      });

      profiles.data?.forEach(p => {
        const lookingStr = (p.looking_for as string[])?.length > 0 ? ` — procurando ${(p.looking_for as string[])[0]}` : "";
        activities.push({ id: p.id, type: "profile", text: `${p.name} entrou no Founder Match${lookingStr}`, created_at: p.created_at });
      });

      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setItems(activities.slice(0, 8));
      setLoading(false);
    };

    fetchActivity();
  }, []);

  if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />;

  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Atividade Recente</h3>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma atividade recente.</p>
      ) : (
        items.map(item => (
          <div key={item.id + item.type} className="flex items-start gap-2 py-1.5">
            {item.type === "opportunity" ? (
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            ) : (
              <UserPlus className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            )}
            <p className="text-xs text-muted-foreground leading-snug">{item.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
