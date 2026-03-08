import { useTheme } from "next-themes";
import { useSubscription, PlanTier } from "@/contexts/SubscriptionContext";

import logoBlack from "@/assets/azera-logo-black.png";
import logoWhite from "@/assets/azera-logo-white.png";
import logoGreen from "@/assets/azera-logo-green.png";
import logoGold from "@/assets/azera-logo-gold.png";

export function useAzeraLogo() {
  const { resolvedTheme } = useTheme();
  const { plan } = useSubscription();

  return getLogoForPlanAndTheme(plan, resolvedTheme);
}

/** For public pages where subscription context may not apply */
export function usePublicLogo() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? logoWhite : logoBlack;
}

export function getLogoForPlanAndTheme(plan: PlanTier, theme?: string) {
  if (plan === "business") return logoGold;
  if (plan === "pro") return logoGreen;
  return theme === "dark" ? logoWhite : logoBlack;
}
