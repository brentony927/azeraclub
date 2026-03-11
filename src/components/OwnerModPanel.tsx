import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Ban, VolumeX, AlertTriangle } from "lucide-react";

interface OwnerModPanelProps {
  targetUserId: string;
  targetName: string;
}

type ModAction = "ban" | "mute" | "warn";

export default function OwnerModPanel({ targetUserId, targetName }: OwnerModPanelProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ModAction>("warn");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const labels: Record<ModAction, { label: string; icon: typeof Ban; color: string }> = {
    ban: { label: "Banir", icon: Ban, color: "text-destructive" },
    mute: { label: "Silenciar (7 dias)", icon: VolumeX, color: "text-orange-500" },
    warn: { label: "Avisar", icon: AlertTriangle, color: "text-yellow-500" },
  };

  const handleAction = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const expiresAt = action === "mute"
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase.from("user_moderation").insert({
        user_id: targetUserId,
        action,
        reason: reason || null,
        moderator_id: user.id,
        expires_at: expiresAt,
      });

      if (error) throw error;

      // Send notification to target
      await supabase.from("founder_notifications").insert({
        user_id: targetUserId,
        type: "moderation",
        title: action === "ban"
          ? "⛔ Sua conta foi suspensa"
          : action === "mute"
          ? "🔇 Você foi silenciado por 7 dias"
          : `⚠️ Aviso da moderação: ${reason || "Conduta inadequada"}`,
        related_user_id: user.id,
      });

      toast({
        title: `${labels[action].label} aplicado`,
        description: `Ação aplicada a ${targetName}`,
      });
      setOpen(false);
      setReason("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openWith = (a: ModAction) => {
    setAction(a);
    setOpen(true);
  };

  const ActionIcon = labels[action].icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
            <Shield className="h-3 w-3" /> Moderar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openWith("warn")} className="gap-2 text-yellow-600">
            <AlertTriangle className="h-4 w-4" /> Avisar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openWith("mute")} className="gap-2 text-orange-500">
            <VolumeX className="h-4 w-4" /> Silenciar (7d)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openWith("ban")} className="gap-2 text-destructive">
            <Ban className="h-4 w-4" /> Banir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ActionIcon className={`h-5 w-5 ${labels[action].color}`} />
              {labels[action].label} — {targetName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Motivo (opcional)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="min-h-[44px]"
            />
            {action === "ban" && (
              <p className="text-xs text-destructive">⚠️ O utilizador será impedido de acessar a plataforma.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              variant={action === "ban" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? "Aplicando..." : `Confirmar ${labels[action].label}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
