import { MapPin, Eye, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface FounderCardProps {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string | null;
  skills: string[];
  lookingFor: string[];
  country?: string | null;
  building?: string | null;
  commitment?: string | null;
  isHighlighted?: boolean;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
  isPending?: boolean;
}

export default function FounderCard({
  id,
  userId,
  name,
  avatarUrl,
  skills,
  lookingFor,
  country,
  building,
  commitment,
  isHighlighted,
  onConnect,
  isConnected,
  isPending,
}: FounderCardProps) {
  const navigate = useNavigate();
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
      isHighlighted
        ? "border-[hsl(42,50%,56%)]/40 bg-gradient-to-br from-[hsl(42,50%,56%)]/5 to-transparent shadow-[0_0_20px_hsl(42,50%,56%,0.1)]"
        : "border-border/50 bg-card/80 backdrop-blur-sm"
    }`}>
      {isHighlighted && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-[hsl(42,50%,56%)] text-[hsl(0,0%,4%)] text-[9px] font-bold">⭐ DESTAQUE</Badge>
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-foreground">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            {building && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{building}</p>
            )}
            {country && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{country}</span>
              </div>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 4).map(skill => (
              <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5">{skill}</Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">+{skills.length - 4}</Badge>
            )}
          </div>
        )}

        {lookingFor.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Procurando</p>
            <div className="flex flex-wrap gap-1">
              {lookingFor.map(item => (
                <Badge key={item} variant="outline" className="text-[10px] px-2 py-0.5 border-primary/30 text-primary">{item}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => navigate(`/founder-profile/${id}`)}
          >
            <Eye className="h-3 w-3 mr-1" /> Ver Perfil
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            disabled={isConnected || isPending}
            onClick={() => onConnect?.(userId)}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            {isConnected ? "Conectado" : isPending ? "Pendente" : "Conectar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
