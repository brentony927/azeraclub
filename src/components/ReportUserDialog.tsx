import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REASONS = [
  "Perfil falso",
  "Fraude / Golpe",
  "Spam",
  "Comportamento abusivo",
  "Conteúdo inadequado",
];

interface ReportUserDialogProps {
  reportedUserId: string;
  reportedUserName: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ReportUserDialog({ reportedUserId, reportedUserName, trigger, open: controlledOpen, onOpenChange }: ReportUserDialogProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => { onOpenChange?.(v); setInternalOpen(v); };
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!user || !reason) return;
    setSending(true);
    const { error } = await supabase.from("user_reports").insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      reason,
      details: details.trim() || null,
    });
    setSending(false);
    if (error) {
      toast({ title: "Erro ao enviar denúncia", variant: "destructive" });
    } else {
      toast({ title: "Denúncia enviada", description: "Nossa equipa irá analisar." });
      setOpen(false);
      setReason("");
      setDetails("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
            <Flag className="h-3 w-3 mr-1" /> Denunciar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Denunciar {reportedUserName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Motivo</Label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    reason === r ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Detalhes (opcional)</Label>
            <Textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              rows={3}
              maxLength={500}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!reason || sending}
            className="w-full"
            variant="destructive"
          >
            {sending ? "Enviando..." : "Enviar Denúncia"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
