import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Icon3D from "@/components/ui/icon-3d";
import { useSubscription } from "@/contexts/SubscriptionContext";

const EARLY_BIRD_LIMIT = 100;
const BADGE_LIMIT = 20;

export default function EarlyBirdBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const navigate = useNavigate();
  const { plan } = useSubscription();

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("early_bird_dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => {
        setUserCount(count || 0);
      });
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("early_bird_dismissed", "true");
  };

  // Don't show if dismissed, still loading, past limit, or already subscribed
  if (dismissed || userCount === null || userCount > EARLY_BIRD_LIMIT || plan === "pro" || plan === "business") {
    return null;
  }

  const spotsLeft = EARLY_BIRD_LIMIT - userCount;
  const badgeSpotsLeft = Math.max(0, BADGE_LIMIT - userCount);
  const showBadgePromo = badgeSpotsLeft > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="relative overflow-hidden rounded-xl border border-primary/20 mb-6"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.08), hsl(var(--background)))",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="shrink-0">
            <Icon3D icon={Zap} color="gold" size="lg" animated />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-responsive-lg">
                <Icon3D icon={Zap} color="gold" size="xs" animated /> Early Bird — 50% OFF
              </h3>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold moss-gradient text-primary-foreground"
              >
                <Clock className="h-3 w-3" />
                {spotsLeft} vagas restantes
              </motion.span>
            </div>

            <p className="text-responsive-sm text-muted-foreground">
              Os <strong>primeiros 100 usuários</strong> ganham <strong>50% de desconto</strong> em qualquer plano.
              {showBadgePromo && (
                <>
                  {" "}Os <strong>primeiros 20</strong> ganham a insígnia exclusiva{" "}
                  <span className="inline-flex items-center gap-1">
                    <Icon3D icon={Gift} color="gold" size="xs" animated />
                    <strong>Early Adopter</strong>
                  </span>
                  {" "}— restam apenas <strong>{badgeSpotsLeft}</strong>!
                </>
              )}
            </p>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate("/planos")}
            className="shrink-0 moss-gradient text-primary-foreground hover:opacity-90 font-semibold"
          >
            Ver Planos
          </Button>
        </div>

        {/* Progress bar */}
        <div className="px-4 sm:px-6 pb-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mb-1">
            <span>{userCount} de {EARLY_BIRD_LIMIT} vagas preenchidas</span>
            <span>{Math.round((userCount / EARLY_BIRD_LIMIT) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((userCount / EARLY_BIRD_LIMIT) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full moss-gradient"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
