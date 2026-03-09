import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  size?: "default" | "compact";
}

export function ThemeToggle({ size = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const isCompact = size === "compact";
  const buttonSize = isCompact ? "h-6 w-6" : "h-10 w-10";
  const iconSize = isCompact ? "h-3 w-3" : "h-4 w-4";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative overflow-hidden rounded-full ${buttonSize}`}
    >
      <Sun className={`${iconSize} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
      <Moon className={`absolute ${iconSize} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
