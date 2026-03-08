import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Termos de Serviço</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Bem-vindo à AZERA CLUB, uma plataforma premium de gestão de estilo de vida concebida para ajudar os utilizadores a organizar experiências de luxo, viagens, imóveis, eventos de networking e bem-estar pessoal num único ambiente inteligente.
          </p>
          <p className="text-sm text-muted-foreground">Ao aceder ou utilizar a plataforma AZERA CLUB, concorda em cumprir estes Termos de Serviço.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Utilização da Plataforma</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A AZERA CLUB disponibiliza ferramentas digitais que permitem aos utilizadores gerir atividades de estilo de vida, como planeamento de viagens, descoberta de eventos, portfólios de imóveis e agendas de bem-estar.</p>
            <p className="text-sm text-muted-foreground">Os utilizadores comprometem-se a não:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Utilizar indevidamente ou explorar a plataforma</li>
              <li>Tentar contornar medidas de segurança</li>
              <li>Distribuir software malicioso</li>
              <li>Utilizar a plataforma para atividades ilegais</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Contas de Utilizador</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores são responsáveis por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas através da sua conta.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Serviços de Subscrição</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Algumas funcionalidades requerem uma subscrição ativa. Os preços e funcionalidades incluídas podem ser alterados ao longo do tempo.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Propriedade dos Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores mantêm a propriedade dos seus dados pessoais. A AZERA CLUB processa dados exclusivamente para prestar serviços e funcionalidades da plataforma.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Disponibilidade da Plataforma</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A AZERA CLUB procura manter a disponibilidade contínua do serviço, mas poderá ocasionalmente realizar manutenções ou atualizações.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6. Limitação de Responsabilidade</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A AZERA CLUB não é responsável por perdas causadas por serviços de terceiros, como fornecedores de viagens, organizadores de eventos ou parceiros de hospitalidade.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">7. Suspensão de Conta</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">As contas podem ser suspensas ou encerradas caso os utilizadores violem estes Termos.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">8. Alterações aos Termos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Estes Termos podem ser atualizados periodicamente. A utilização contínua da plataforma indica a aceitação dos termos atualizados.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
