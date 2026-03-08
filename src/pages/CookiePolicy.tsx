import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Cookies</h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">A AZERA CLUB utiliza cookies e tecnologias semelhantes para melhorar a experiência do utilizador.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Como Utilizamos Cookies</h2>
            <p className="text-sm text-muted-foreground">Os cookies ajudam-nos a:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Memorizar preferências do utilizador</li>
              <li>Melhorar o desempenho da plataforma</li>
              <li>Analisar a utilização da plataforma</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Gestão de Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores podem controlar ou desativar os cookies através das definições do navegador. Algumas funcionalidades da plataforma podem não funcionar corretamente sem cookies.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
