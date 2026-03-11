import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CommunityGuidelines() {
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

        <div className="glass-card p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Diretrizes da Comunidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: 2025</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Para manter um ambiente seguro e profissional, todos os membros devem seguir estas diretrizes.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Usuários devem:</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Respeitar outros membros</li>
              <li>Evitar spam</li>
              <li>Compartilhar informações honestas</li>
              <li>Manter comportamento profissional</li>
            </ul>
          </section>

          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Violações podem resultar em suspensão da conta.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Denúncias e questões podem ser enviadas para: <a href="mailto:community@azeraclub.com" className="text-primary hover:underline">community@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
