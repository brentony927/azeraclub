import {
  ArrowRight,
  Plane,
  MapPin,
  Globe,
  Star,
  Compass,
  Palmtree,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ListItem {
  icon: React.ReactNode;
  title: string;
  category: string;
  description: string;
}

interface ListSectionProps {
  heading?: string;
  items?: ListItem[];
}

const defaultItems: ListItem[] = [
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Destinos Visitados",
    category: "Milestones",
    description: "12 países em 3 continentes diferentes.",
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Experiências 5 Estrelas",
    category: "Luxo",
    description: "Hotéis e resorts de classe mundial.",
  },
  {
    icon: <Plane className="h-5 w-5" />,
    title: "Voos Executivos",
    category: "Transporte",
    description: "First class e jatos privados.",
  },
  {
    icon: <Compass className="h-5 w-5" />,
    title: "Aventuras Exclusivas",
    category: "Experiências",
    description: "Safari, mergulho e expedições polares.",
  },
  {
    icon: <Palmtree className="h-5 w-5" />,
    title: "Ilhas Privadas",
    category: "Destinos",
    description: "Retiros exclusivos no Caribe e Maldivas.",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Roteiros Personalizados",
    category: "Concierge",
    description: "Itinerários curados sob medida.",
  },
];

export function ListSection({
  heading = "Achievements & Destinations",
  items = defaultItems,
}: ListSectionProps) {
  return (
    <section className="py-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold">
          {heading}
        </h2>

        <div className="space-y-0">
          <Separator className="bg-border/50" />
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center justify-between py-4 group">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-accent shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <span className="text-[11px] text-muted-foreground">{item.category}</span>
                  </div>
                </div>

                <p className="hidden sm:block text-xs text-muted-foreground max-w-[200px] text-right mr-4">
                  {item.description}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-accent shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="bg-border/50" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
