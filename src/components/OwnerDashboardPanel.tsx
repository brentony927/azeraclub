import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { ChevronDown, Crown } from "lucide-react";
import AffiliateManagerPanel from "@/components/AffiliateManagerPanel";
import SuggestionsManagerPanel from "@/components/SuggestionsManagerPanel";

export default function OwnerDashboardPanel() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm mb-6 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Painel do Dono</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <AffiliateManagerPanel />
            <SuggestionsManagerPanel />
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
