import { useState, useRef, memo } from "react";
import { MapPin, Eye, UserPlus, Sparkles } from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getMatchColor } from "@/lib/founderMatch";

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
  matchScore?: number;
  username?: string | null;
  founderLevel?: string | null;
}

const FounderCard = memo(function FounderCard({
  id, userId, name, avatarUrl, skills, lookingFor, country, building,
  commitment, isHighlighted, onConnect, isConnected, isPending, matchScore, username, founderLevel,
}: FounderCardProps) {
  const navigate = useNavigate();
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const cardRef = useRef<HTMLDivElement>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setMagnet({ x: (e.clientX - cx) * 0.02, y: (e.clientY - cy) * 0.02 });
  };

  const handleMouseLeave = () => setMagnet({ x: 0, y: 0 });

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
        isHighlighted
          ? "border-[hsl(42,50%,56%)]/40 bg-gradient-to-br from-[hsl(42,50%,56%)]/5 to-transparent shadow-[0_0_20px_hsl(42,50%,56%,0.1)]"
          : "border-border/50 bg-card/80 backdrop-blur-sm"
      }`}
      style={isHighlighted ? {
        borderImage: "linear-gradient(135deg, hsla(51,100%,50%,0.4), hsla(35,80%,50%,0.3), hsla(20,70%,50%,0.2)) 1",
      } : undefined}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <BookmarkButton itemType="founder" itemId={id} size={14} />
        {isHighlighted && (
          <Badge className="bg-[hsl(42,50%,56%)] text-[hsl(0,0%,4%)] text-[9px] font-bold">⭐ DESTAQUE</Badge>
        )}
      </div>

      {/* Business Founder badge with shimmer */}
      {isHighlighted && (
        <div className="absolute top-2 left-2">
          <Badge 
            className="text-[hsl(0,0%,4%)] text-[9px] font-bold border-0"
            style={{
              background: "linear-gradient(135deg, hsl(51,100%,50%), hsl(42,70%,55%), hsl(35,80%,50%))",
              backgroundSize: "200% 100%",
              animation: "shimmerBadge 3s linear infinite",
            }}
          >
            BUSINESS FOUNDER
          </Badge>
        </div>
      )}

      {matchScore !== undefined && matchScore > 0 && !isHighlighted && (
        <div className="absolute top-2 left-2">
          <Badge className={`text-[10px] font-bold border ${getMatchColor(matchScore)}`}>
            <Sparkles className="h-3 w-3 mr-0.5" /> Match {matchScore}%
          </Badge>
        </div>
      )}

      <CardContent className="p-4 sm:p-5 pt-8">
        <div className="flex items-start gap-4">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
              isHighlighted ? "ring-2 ring-[hsl(51,100%,50%)]/50 shadow-[0_0_14px_hsl(51,100%,50%,0.3)]" : "bg-secondary"
            }`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
            ) : (
              <span className="text-sm font-bold text-foreground">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {founderLevel && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0">{founderLevel}</Badge>
              )}
            </div>
            {building && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{building}</p>}
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
            className="flex-1 text-xs transition-transform duration-200"
            style={{ transform: `translate(${magnet.x}px, ${magnet.y}px)` }}
            onClick={() => navigate(`/founder-profile/${username || id}`)}
          >
            <Eye className="h-3 w-3 mr-1" /> Ver Perfil
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs transition-transform duration-200"
            style={{ transform: `translate(${magnet.x}px, ${magnet.y}px)` }}
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
});

export default FounderCard;
