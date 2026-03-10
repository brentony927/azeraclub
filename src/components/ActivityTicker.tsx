import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TickerItem {
  id: string;
  text: string;
}

const FALLBACK_ITEMS: TickerItem[] = [
  { id: "f1", text: "🚀 Novo venture criado na comunidade" },
  { id: "f2", text: "🤝 2 founders conectaram-se hoje" },
  { id: "f3", text: "💡 Nova oportunidade publicada" },
  { id: "f4", text: "🌍 Founder de Lisboa entrou no ecossistema" },
  { id: "f5", text: "📈 Venture atingiu score 85" },
];

export default function ActivityTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    const fetchData = async () => {
      const [ventures, profiles] = await Promise.all([
        supabase.from("ventures").select("id, name, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("founder_profiles").select("id, name, city, created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(3),
      ]);

      const live: TickerItem[] = [];
      ventures.data?.forEach((v) => live.push({ id: `v-${v.id}`, text: `🚀 "${v.name}" foi criado` }));
      profiles.data?.forEach((p) => live.push({ id: `p-${p.id}`, text: `🌍 ${p.name}${p.city ? ` de ${p.city}` : ""} entrou no ecossistema` }));

      if (live.length > 0) setItems([...live, ...FALLBACK_ITEMS.slice(0, 3)]);
    };
    fetchData();
  }, []);

  const doubled = useMemo(() => [...items, ...items], [items]);
  const duration = items.length * 4;

  return (
    <div className="w-full overflow-hidden py-3 border-y border-border/20 bg-card/50 backdrop-blur-sm">
      <div
        className="flex gap-8 whitespace-nowrap ticker-scroll"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="text-sm text-muted-foreground flex items-center gap-2 shrink-0">
            {item.text}
            <span className="text-border/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
