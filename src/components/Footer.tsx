import { Link } from "react-router-dom";
import { useAzeraLogo } from "@/hooks/useAzeraLogo";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contact" },
];

const legalLinks = [
  { label: "Termos de Uso", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
  { label: "Diretrizes", href: "/community-guidelines" },
  { label: "Pagamentos", href: "/payments-policy" },
  { label: "Segurança", href: "/security-policy" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <img src={azeraLogo} alt="AZERA" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-serif font-bold text-lg moss-text tracking-wider">AZERA CLUB</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-1 px-1 min-h-[44px] flex items-center">
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors duration-300 py-1 px-1">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground text-center">© 2026 Azera Club. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
