import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function SecurityPolicy() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Segurança</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            A segurança dos dados e da experiência dos nossos utilizadores é uma prioridade fundamental para o AZERA CLUB. Esta política descreve as medidas que implementamos e as responsabilidades dos utilizadores.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Medidas de Segurança</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">O AZERA CLUB implementa as seguintes medidas de segurança:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Encriptação de dados em trânsito e em repouso</li>
              <li>Autenticação segura com proteção contra ataques de força bruta</li>
              <li>Monitorização contínua de atividades suspeitas</li>
              <li>Backups regulares dos dados da plataforma</li>
              <li>Infraestrutura hospedada em provedores de cloud certificados</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Limitações</h2>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Nenhuma plataforma digital pode garantir segurança absoluta. Apesar dos nossos esforços, existem riscos inerentes à utilização de qualquer serviço online.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Responsabilidade do Utilizador</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores são responsáveis por:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Manter a confidencialidade das suas credenciais de acesso</li>
              <li>Utilizar senhas fortes e únicas</li>
              <li>Não partilhar informações financeiras sensíveis com outros utilizadores</li>
              <li>Reportar imediatamente qualquer atividade suspeita na sua conta</li>
              <li>Manter o software e dispositivos atualizados</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Utilização por Conta e Risco</h2>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Os utilizadores utilizam a plataforma por sua própria conta e risco. O AZERA CLUB não se responsabiliza por danos resultantes de vulnerabilidades de segurança, ataques cibernéticos ou utilização indevida por parte de terceiros.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Incidentes de Segurança</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Em caso de violação de dados que afete informações pessoais dos utilizadores, o AZERA CLUB compromete-se a notificar os utilizadores afetados num prazo razoável e a tomar as medidas necessárias para mitigar o impacto.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões de segurança podem ser enviadas para: <a href="mailto:security@azeraclub.com" className="text-primary hover:underline">security@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
