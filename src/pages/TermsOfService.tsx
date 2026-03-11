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
            <p className="text-sm text-muted-foreground">Última atualização: 2025</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1 — Aceitação dos Termos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao acessar ou utilizar a plataforma Azera Club, o usuário concorda integralmente com estes Termos de Uso. Caso o usuário não concorde com qualquer parte destes termos, deve interromper imediatamente o uso da plataforma.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Azera Club reserva-se o direito de modificar estes termos a qualquer momento. O uso contínuo da plataforma após alterações representa aceitação das novas condições.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2 — Descrição da Plataforma</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O Azera Club é uma plataforma digital destinada a:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Networking entre empreendedores</li>
              <li>Descoberta de oportunidades de negócio</li>
              <li>Conexão entre founders</li>
              <li>Compartilhamento de projetos</li>
              <li>Criação de parcerias</li>
              <li>Participação em comunidades privadas</li>
              <li>Descoberta de tendências e oportunidades</li>
            </ul>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                A plataforma não fornece aconselhamento financeiro, jurídico ou de investimento.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3 — Elegibilidade</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Para utilizar a plataforma o usuário declara que:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Possui capacidade legal para aceitar os termos</li>
              <li>Fornecerá informações verdadeiras</li>
              <li>Utilizará a plataforma de forma legal</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Contas podem ser suspensas ou encerradas caso estas condições sejam violadas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4 — Contas de Usuário</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Cada usuário é responsável por:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Manter suas credenciais seguras</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Manter informações atualizadas</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Azera Club não se responsabiliza por acessos indevidos decorrentes de negligência do usuário.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5 — Conteúdo Gerado por Usuários</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Usuários podem publicar:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Ideias de negócio</li>
              <li>Oportunidades</li>
              <li>Perfis profissionais</li>
              <li>Comentários</li>
              <li>Discussões</li>
              <li>Projetos</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O usuário é o único responsável pelo conteúdo publicado. O Azera Club não garante a veracidade, precisão ou qualidade das informações compartilhadas pelos usuários.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6 — Interações Entre Usuários</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A plataforma apenas facilita conexões entre membros. O Azera Club não participa de:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Negociações</li>
              <li>Investimentos</li>
              <li>Contratos</li>
              <li>Parcerias</li>
            </ul>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Qualquer acordo realizado entre usuários é de responsabilidade exclusiva das partes envolvidas.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">7 — Uso Proibido</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">É proibido utilizar a plataforma para:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Fraude</li>
              <li>Spam</li>
              <li>Criação de contas falsas</li>
              <li>Manipulação de sistemas</li>
              <li>Assédio ou comportamento abusivo</li>
              <li>Divulgação enganosa</li>
              <li>Coleta indevida de dados de outros usuários</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A violação pode resultar em suspensão permanente da conta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">8 — Propriedade Intelectual</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Todos os direitos relacionados a:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Design da plataforma</li>
              <li>Código</li>
              <li>Marca</li>
              <li>Identidade visual</li>
              <li>Funcionalidades</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              pertencem ao Azera Club. Usuários mantêm direitos sobre conteúdos próprios publicados, mas concedem licença à plataforma para exibição dentro do sistema.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">9 — Limitação de Responsabilidade</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A plataforma é fornecida "como está". O Azera Club não garante:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Disponibilidade contínua</li>
              <li>Ausência de erros</li>
              <li>Resultados específicos</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">O Azera Club não será responsável por:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Perdas financeiras</li>
              <li>Danos indiretos</li>
              <li>Oportunidades perdidas</li>
              <li>Negócios malsucedidos</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">10 — Encerramento de Conta</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O Azera Club pode suspender ou encerrar contas que:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Violem os termos</li>
              <li>Pratiquem fraude</li>
              <li>Abusem do sistema</li>
              <li>Prejudiquem a comunidade</li>
            </ul>
          </section>

          {/* Programa de Afiliados */}
          <div className="border-t border-border/50 pt-8">
            <h2 className="text-2xl font-serif font-bold gold-text mb-6">Programa de Afiliados</h2>

            <section className="space-y-3 mb-6">
              <h3 className="text-lg font-serif font-semibold">1 — Elegibilidade</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Usuários podem solicitar participação no programa de afiliados. A aprovação é realizada manualmente pela plataforma. Usuários aprovados recebem um link de indicação exclusivo.
              </p>
            </section>

            <section className="space-y-3 mb-6">
              <h3 className="text-lg font-serif font-semibold">2 — Comissões</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Afiliados recebem comissões por assinaturas pagas realizadas através de seus links de indicação. As comissões são processadas automaticamente por meio do sistema de pagamentos integrado. Pagamentos podem ser realizados por meio de contas conectadas no sistema da Stripe.
              </p>
            </section>

            <section className="space-y-3 mb-6">
              <h3 className="text-lg font-serif font-semibold">3 — Proibições</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">É proibido:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>Auto indicação</li>
                <li>Criação de contas falsas</li>
                <li>Manipulação de leads</li>
                <li>Publicidade enganosa</li>
                <li>Spam</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A violação pode resultar em remoção do programa.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-serif font-semibold">4 — Alteração do Programa</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O Azera Club pode modificar porcentagem de comissão, regras do programa e elegibilidade a qualquer momento.
              </p>
            </section>
          </div>

          {/* Política de Reembolso */}
          <div className="border-t border-border/50 pt-8">
            <h2 className="text-2xl font-serif font-bold gold-text mb-4">Política de Reembolso</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assinaturas podem ser canceladas a qualquer momento. Reembolsos podem ser concedidos a critério da plataforma dentro de um período razoável após a compra. Taxas de pagamento cobradas por provedores externos podem não ser reembolsáveis.
            </p>
          </div>

          {/* Isenção de Responsabilidade */}
          <div className="border-t border-border/50 pt-8">
            <h2 className="text-2xl font-serif font-bold gold-text mb-4">Isenção de Responsabilidade</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed font-bold">
                O Azera Club atua apenas como plataforma digital de networking.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">A plataforma não:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>Garante resultados</li>
                <li>Garante sucesso financeiro</li>
                <li>Participa de negociações</li>
                <li>Intermedia investimentos</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Usuários devem avaliar cuidadosamente qualquer oportunidade antes de tomar decisões financeiras.
              </p>
            </div>
          </div>

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
