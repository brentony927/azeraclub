import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type PlanTier = "free" | "basic" | "pro" | "business";

interface SubscriptionContextType {
  plan: PlanTier;
  loading: boolean;
  subscriptionEnd: string | null;
  refresh: () => Promise<void>;
  canAccess: (minTier: PlanTier) => boolean;
  showUpgradeCelebration: boolean;
  dismissCelebration: () => void;
}

const TIER_ORDER: PlanTier[] = ["free", "basic", "pro", "business"];

const PRODUCT_MAP: Record<string, PlanTier> = {
  prod_U62xpa0u9xDiJO: "pro",
  prod_U62xPut1mfd9CG: "business",
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  plan: "free",
  loading: true,
  subscriptionEnd: null,
  refresh: async () => {},
  canAccess: () => false,
  showUpgradeCelebration: false,
  dismissCelebration: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanTier>("free");
  const [loading, setLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [showUpgradeCelebration, setShowUpgradeCelebration] = useState(false);

  const lastCheckRef = useRef(0);

  const refresh = useCallback(async (isInterval = false) => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }
    // Debounce: skip if checked < 30s ago (unless first load)
    const now = Date.now();
    if (lastCheckRef.current && now - lastCheckRef.current < 30000) {
      setLoading(false);
      return;
    }
    lastCheckRef.current = now;
    try {
      const { data } = await supabase.functions.invoke("check-subscription");
      let newPlan: PlanTier = "free";
      if (data?.manual_plan) {
        // Map legacy "elite" to "business"
        const mp = data.manual_plan === "elite" ? "business" : data.manual_plan;
        newPlan = mp as PlanTier;
      } else if (data?.subscribed && data.product_id) {
        newPlan = PRODUCT_MAP[data.product_id] || "free";
      }
      setPlan(newPlan);
      setSubscriptionEnd(data?.subscription_end || null);
      if (!isInterval && newPlan !== "free" && !sessionStorage.getItem("azera_celebrated_session")) {
        const lastCelebrated = localStorage.getItem("azera_last_celebrated_plan");
        if (newPlan !== lastCelebrated) {
          setShowUpgradeCelebration(true);
          localStorage.setItem("azera_last_celebrated_plan", newPlan);
          sessionStorage.setItem("azera_celebrated_session", "true");
        }
      }
      sessionStorage.setItem("azera_sub_loaded", "true");
    } catch {
      // keep current plan on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => refresh(true), 60000);
    return () => clearInterval(interval);
  }, [user, refresh]);

  const canAccess = (minTier: PlanTier) => {
    return TIER_ORDER.indexOf(plan) >= TIER_ORDER.indexOf(minTier);
  };

  const dismissCelebration = () => setShowUpgradeCelebration(false);

  return (
    <SubscriptionContext.Provider value={{ plan, loading, subscriptionEnd, refresh, canAccess, showUpgradeCelebration, dismissCelebration }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
