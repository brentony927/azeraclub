import { Link } from "react-router-dom";
import { useAzeraLogo } from "@/hooks/useAzeraLogo";

const navLinks = [
  { label: "Início", href: "/dashboard" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contact" },
];

const legalLinks = [
  { label: "Termos", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
  { label: "Diretrizes", href: "/community-guidelines" },
  { label: "Pagamentos", href: "/payments-policy" },
  { label: "Segurança", href: "/security-policy" },
  { label: "Risco", href: "/risk-disclaimer" },
  { label: "IA", href: "/ai-disclaimer" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const azeraLogo = useAzeraLogo();
  return (
    <footer className="relative border-t border-transparent bg-transparent">
      <div className="header-gradient-line" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5">
            <img src={azeraLogo} alt="AZERA" className="w-6 h-6 rounded-md object-contain opacity-60" />
            <span className="font-serif font-semibold text-sm text-muted-foreground tracking-widest uppercase">Azera Club</span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="flex items-center">
                <Link
                  to={link.href}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-200 px-1"
                >
                  {link.label}
                </Link>
                {i < legalLinks.length - 1 && <span className="text-muted-foreground/15 text-[10px]">·</span>}
              </span>
            ))}
          </nav>
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-center mt-4 max-w-2xl mx-auto leading-relaxed">
          Azera Club é uma plataforma digital destinada a networking entre empreendedores e não participa ou garante quaisquer acordos realizados entre usuários fora da plataforma.
        </p>
        <p className="text-[10px] text-muted-foreground text-center mt-2">© 2026 Azera Club</p>
      </div>
    </footer>
  );
}
