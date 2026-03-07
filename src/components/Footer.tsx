import { Link } from "react-router-dom";
import azeraLogo from "@/assets/azera-logo.jpg";

const footerLinks = [
  { label: "Início", href: "/" },
  { label: "IA", href: "/ia" },
  { label: "Networking", href: "/networking" },
  { label: "Perfil", href: "/profile" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <img src={azeraLogo} alt="AZERA" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-serif font-bold text-lg moss-text tracking-wider">AZERA ELITE</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {footerLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-1 px-1 min-h-[44px] flex items-center">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground text-center">© 2026 Azera Elite. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
