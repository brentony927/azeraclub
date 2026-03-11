import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AIDisclaimer() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Disclaimer de Inteligência Artificial</h1>
            <p className="text-sm text-muted-foreground">Última atualização: 2025</p>
          </div>

          <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-bold">
              O Azera Club utiliza inteligência artificial para fornecer funcionalidades como análise de tendências, recomendações, insights e assistência estratégica. Os resultados gerados por IA são meramente informativos.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1 — Natureza Informativa</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as respostas, análises, recomendações e insights gerados pela inteligência artificial do Azera Club são de natureza informativa e educacional. Não constituem aconselhamento profissional de qualquer tipo — financeiro, jurídico, médico, fiscal ou de investimento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2 — Não Substitui Aconselhamento Profissional</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A IA do Azera Club não substitui a consulta a profissionais qualificados. Antes de tomar qualquer decisão baseada em informações geradas pela IA, o usuário deve consultar especialistas da área relevante.
            </p>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Consulte sempre advogados, contadores, consultores financeiros ou outros profissionais qualificados antes de agir com base em informações da IA.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3 — Limitações da IA</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A inteligência artificial pode:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Gerar informações imprecisas ou desatualizadas</li>
              <li>Fornecer respostas incompletas ou fora de contexto</li>
              <li>Não considerar circunstâncias específicas do usuário</li>
              <li>Apresentar vieses ou limitações inerentes ao modelo</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4 — Responsabilidade do Usuário</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O usuário é o único responsável por qualquer decisão tomada com base em informações fornecidas pela IA. O Azera Club não se responsabiliza por perdas, danos ou consequências resultantes do uso de conteúdo gerado por inteligência artificial.
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
