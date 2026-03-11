import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function RiskDisclaimer() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Aviso de Risco</h1>
            <p className="text-sm text-muted-foreground">Última atualização: 2025</p>
          </div>

          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-bold">
              O Azera Club é uma plataforma de networking e conexão entre empreendedores. Toda e qualquer decisão financeira, de investimento ou de negócio tomada pelo usuário é de sua exclusiva responsabilidade.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1 — Networking e Conexões</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A plataforma facilita conexões entre empreendedores, mas não verifica, valida ou garante a idoneidade, capacidade financeira ou intenções de qualquer membro. O usuário deve realizar sua própria diligência antes de estabelecer qualquer parceria ou acordo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2 — Oportunidades e Projetos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Oportunidades de negócio, projetos e ideias publicados na plataforma são de responsabilidade exclusiva de quem os publica. O Azera Club não endossa, verifica ou garante a viabilidade de qualquer oportunidade apresentada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3 — Investimentos e Decisões Financeiras</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Azera Club não fornece aconselhamento financeiro, jurídico ou de investimento. Informações disponíveis na plataforma — incluindo dados de mercado, tendências e análises — são meramente informativas e não constituem recomendação de investimento.
            </p>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Consulte sempre profissionais qualificados antes de tomar decisões financeiras ou de investimento.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4 — Conteúdo de Terceiros</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todo o conteúdo publicado por usuários — incluindo perfis, publicações, comentários, oportunidades e mensagens — é de exclusiva responsabilidade de quem o cria. O Azera Club não se responsabiliza por informações falsas, enganosas ou prejudiciais publicadas por terceiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5 — Isenção Geral</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O Azera Club não será responsável por quaisquer perdas financeiras, danos diretos ou indiretos, oportunidades perdidas ou prejuízos resultantes do uso da plataforma ou de interações com outros membros.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões podem ser enviadas para: <a href="mailto:legal@azeraclub.com" className="text-primary hover:underline">legal@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
