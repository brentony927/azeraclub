import { useTheme } from "next-themes";

import logoBlack from "@/assets/azera-logo-black.png";
import logoWhite from "@/assets/azera-logo-white.png";

function getLogoForTheme(theme?: string) {
  return theme === "dark" ? logoWhite : logoBlack;
}

export function useAzeraLogo() {
  const { resolvedTheme } = useTheme();
  return getLogoForTheme(resolvedTheme);
}

/** For public pages — same logic */
export function usePublicLogo() {
  const { resolvedTheme } = useTheme();
  return getLogoForTheme(resolvedTheme);
}
