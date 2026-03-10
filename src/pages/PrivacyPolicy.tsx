import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Privacidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            O AZERA CLUB respeita a privacidade dos seus utilizadores e está empenhado em proteger as informações pessoais recolhidas através da plataforma. Esta política descreve como recolhemos, utilizamos e protegemos os seus dados.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Dados que Recolhemos</h2>
            <p className="text-sm text-muted-foreground">Podemos recolher as seguintes informações:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Nome completo e endereço de email</li>
              <li>Perfil profissional e área de atuação</li>
              <li>Interesses, competências e objetivos</li>
              <li>Atividade e interações na plataforma</li>
              <li>Dados de navegação e dispositivo (via cookies)</li>
              <li>Informações de pagamento (processadas por terceiros)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Finalidade do Tratamento</h2>
            <p className="text-sm text-muted-foreground">Os dados são utilizados para:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Personalizar a experiência do utilizador</li>
              <li>Disponibilizar funcionalidades e recomendações inteligentes</li>
              <li>Permitir conexões e networking entre membros</li>
              <li>Processar subscrições e pagamentos</li>
              <li>Melhorar o desempenho e a segurança da plataforma</li>
              <li>Comunicar atualizações relevantes sobre o serviço</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Proteção de Dados — LGPD e GDPR</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O AZERA CLUB segue boas práticas de proteção de dados inspiradas nas seguintes regulações:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li><strong>GDPR</strong> — Regulamento Geral sobre a Proteção de Dados (União Europeia)</li>
              <li><strong>LGPD</strong> — Lei Geral de Proteção de Dados (Brasil)</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acesso não autorizado, perda ou destruição.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Partilha de Dados com Terceiros</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Algumas funcionalidades da plataforma podem envolver serviços de terceiros, como processadores de pagamento (ex: Stripe). O AZERA CLUB não vende, aluga ou partilha dados pessoais com terceiros para fins de marketing. Dados podem ser partilhados apenas quando necessário para a prestação do serviço ou quando exigido por lei.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Dados de Conteúdo Social</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">A plataforma armazena dados relacionados com a atividade social dos utilizadores, incluindo:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Publicações, fotografias, comentários e reações (likes)</li>
              <li>Participação em grupos e conversas</li>
              <li>Conexões e interações com outros membros</li>
            </ul>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mt-2">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                O AZERA CLUB não é responsável pelo conteúdo publicado por utilizadores nem pelas interações resultantes. Cada utilizador é o único responsável pelo que publica e partilha.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6. Dados de Localização</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para funcionalidades como o Mapa Global de Founders, podemos recolher coordenadas geográficas aproximadas. As coordenadas precisas nunca são partilhadas com outros utilizadores ou terceiros — apenas versões arredondadas são exibidas no mapa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">7. Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies para melhorar a experiência de navegação, memorizar preferências e analisar o uso da plataforma. Para mais detalhes, consulte a nossa <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">8. Direitos do Utilizador</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores têm o direito de:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Aceder aos seus dados pessoais</li>
              <li>Retificar informações incorretas</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Exportar os seus dados em formato legível</li>
              <li>Revogar o consentimento para tratamento de dados</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estas ações podem ser realizadas nas definições da conta ou contactando a nossa equipa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">9. Retenção de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os dados pessoais são mantidos enquanto a conta estiver ativa ou conforme necessário para cumprir obrigações legais. Após a eliminação da conta, os dados serão removidos num prazo razoável.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">10. Alterações a Esta Política</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta Política de Privacidade pode ser atualizada periodicamente. Os utilizadores serão notificados sobre alterações significativas. A utilização contínua da plataforma constitui aceitação da política atualizada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões sobre privacidade podem ser enviadas para: <a href="mailto:privacy@azeraclub.com" className="text-primary hover:underline">privacy@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
