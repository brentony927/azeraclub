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

        <div className="glass-card p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Termos de Uso</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Bem-vindo ao AZERA CLUB. Ao aceder ou utilizar a nossa plataforma, o utilizador concorda em cumprir integralmente estes Termos de Uso. Se não concordar com qualquer parte destes termos, não deve utilizar a plataforma.
          </p>

          {/* 1 — Natureza da Plataforma */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Natureza da Plataforma</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O AZERA CLUB é uma plataforma digital destinada a facilitar:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Networking profissional entre empreendedores</li>
              <li>Descoberta de oportunidades de negócio</li>
              <li>Compartilhamento de ideias e projetos</li>
              <li>Conexão estratégica entre membros</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              A plataforma não é responsável por negociações, acordos ou transações realizadas entre utilizadores.
            </p>
          </section>

          {/* 2 — Responsabilidade do Utilizador */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Responsabilidade do Utilizador</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O utilizador é integralmente responsável por:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Todas as informações que publica na plataforma</li>
              <li>Todas as interações com outros utilizadores</li>
              <li>Todas as decisões de negócios tomadas dentro ou fora da plataforma</li>
              <li>A veracidade e exatidão dos dados fornecidos no seu perfil</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as decisões tomadas dentro ou fora da plataforma são de responsabilidade exclusiva do utilizador.
            </p>
          </section>

          {/* 3 — Interações entre Utilizadores */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Interações entre Utilizadores</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O AZERA CLUB não atua como:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Intermediador financeiro</li>
              <li>Consultor de investimentos</li>
              <li>Consultor jurídico</li>
              <li>Agente de negociação</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A plataforma apenas fornece ferramentas de conexão. Qualquer transação ou acordo entre utilizadores é de exclusiva responsabilidade das partes envolvidas.
            </p>
          </section>

          {/* 4 — Disclaimer de Negócios */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Disclaimer de Negócios</h2>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O AZERA CLUB não verifica, garante ou endossa qualquer oportunidade de negócio publicada por utilizadores.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Os utilizadores devem verificar de forma independente qualquer oportunidade ou parceria antes de se envolver em negócios. A plataforma não se responsabiliza por perdas decorrentes de oportunidades publicadas por terceiros.
              </p>
            </div>
          </section>

          {/* 5 — Atividades Fora da Plataforma */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Atividades Fora da Plataforma</h2>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O AZERA CLUB não é responsável por quaisquer interações, acordos, transações, reuniões ou parcerias que ocorram fora da plataforma.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Isto inclui, mas não se limita a:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Reuniões presenciais ou virtuais</li>
              <li>Investimentos e transferências financeiras</li>
              <li>Contratos e acordos comerciais</li>
              <li>Negócios presenciais ou remotos</li>
              <li>Qualquer comunicação realizada fora da plataforma</li>
            </ul>
          </section>

          {/* 6 — Limitação de Responsabilidade */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6. Limitação de Responsabilidade</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O AZERA CLUB não se responsabiliza por:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Perdas financeiras de qualquer natureza</li>
              <li>Fraudes ou esquemas entre utilizadores</li>
              <li>Decisões de investimento tomadas com base em informações da plataforma</li>
              <li>Falhas em projetos, startups ou empreendimentos</li>
              <li>Conflitos entre utilizadores</li>
              <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
            </ul>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-3">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                A plataforma é fornecida "tal como está" (as is), sem garantias de sucesso, lucro ou resultados comerciais.
              </p>
            </div>
          </section>

          {/* 7 — Conteúdo Gerado por Utilizadores */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">7. Conteúdo Gerado por Utilizadores</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todo o conteúdo publicado pelos utilizadores — incluindo publicações, fotografias, comentários, partilhas e qualquer outro material — é da exclusiva responsabilidade de quem o publica.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>O AZERA CLUB não modera, verifica nem aprova previamente o conteúdo publicado</li>
              <li>Os utilizadores são os únicos responsáveis pela veracidade e legalidade do que publicam</li>
              <li>A plataforma reserva-se o direito de remover conteúdo que viole estes termos ou as Diretrizes da Comunidade</li>
            </ul>
          </section>

          {/* 8 — Conversas e Grupos */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">8. Conversas e Grupos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As comunicações entre utilizadores — incluindo conversas privadas, mensagens em grupos e qualquer troca de informações — são da inteira responsabilidade das partes envolvidas.
            </p>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O AZERA CLUB não monitoriza, lê nem se responsabiliza pelo conteúdo das conversas entre utilizadores. Qualquer acordo, negócio ou compromisso estabelecido através de conversas na plataforma é de responsabilidade exclusiva dos participantes.
              </p>
            </div>
          </section>

          {/* 9 — Isenção Total de Responsabilidade */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">9. Isenção Total de Responsabilidade</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed font-bold">
                O AZERA CLUB NÃO SE RESPONSABILIZA POR QUALQUER AÇÃO, INTERAÇÃO, ACORDO, PERDA, DANO OU CONSEQUÊNCIA — DIRETA OU INDIRETA — DECORRENTE DA UTILIZAÇÃO DA PLATAFORMA.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Isto inclui, sem limitação:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>Conteúdo publicado por utilizadores (textos, imagens, vídeos, comentários)</li>
                <li>Conversas privadas e em grupo entre membros</li>
                <li>Qualquer interação, negócio ou acordo entre utilizadores</li>
                <li>Perdas financeiras, danos materiais ou morais</li>
                <li>Informações falsas ou enganosas publicadas por terceiros</li>
                <li>Decisões tomadas com base em qualquer informação obtida na plataforma</li>
                <li>Atividades realizadas fora da plataforma mas originadas através dela</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao utilizar o AZERA CLUB, o utilizador reconhece e aceita que a plataforma é um meio de conexão e que toda a responsabilidade sobre as suas ações e interações recai exclusivamente sobre si.
            </p>
          </section>

          {/* 10 — Propriedade Intelectual */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">10. Propriedade Intelectual</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Todo o conteúdo da plataforma pertence ao AZERA CLUB, incluindo:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Marca e identidade visual</li>
              <li>Design e interface</li>
              <li>Software e código-fonte</li>
              <li>Conteúdos editoriais e textos</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os utilizadores não podem copiar, reproduzir, distribuir ou utilizar qualquer conteúdo da plataforma sem autorização expressa por escrito.
            </p>
          </section>

          {/* 11 — Suspensão de Contas */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">11. Suspensão e Encerramento de Contas</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O AZERA CLUB reserva-se o direito de suspender ou encerrar contas que:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Violem estes Termos de Uso</li>
              <li>Pratiquem fraude ou atividades ilícitas</li>
              <li>Prejudiquem outros utilizadores</li>
              <li>Utilizem a plataforma para spam ou fins abusivos</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A suspensão ou encerramento pode ocorrer sem aviso prévio quando necessário para proteger a integridade da plataforma e dos seus membros.
            </p>
          </section>

          {/* 12 — Modificação dos Termos */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">12. Modificação dos Termos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O AZERA CLUB pode atualizar estes Termos de Uso a qualquer momento. Os utilizadores serão notificados em caso de alterações significativas. A continuação da utilização do serviço após quaisquer alterações constitui aceitação dos termos atualizados.
            </p>
          </section>

          {/* 13 — Aceitação */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">13. Aceitação dos Termos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao criar uma conta no AZERA CLUB, o utilizador confirma que leu, compreendeu e aceita estes Termos de Uso na sua totalidade, bem como a nossa Política de Privacidade.
            </p>
          </section>

          {/* Contacto */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões sobre estes termos podem ser enviadas para: <a href="mailto:legal@azeraclub.com" className="text-primary hover:underline">legal@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
