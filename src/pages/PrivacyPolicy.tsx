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
            <p className="text-sm text-muted-foreground">Última atualização: 2025</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1 — Informações Coletadas</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Podemos coletar:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Nome</li>
              <li>Email</li>
              <li>Dados de perfil</li>
              <li>Atividade dentro da plataforma</li>
              <li>Endereço IP</li>
              <li>Dados de navegação</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para afiliados também podem ser coletados dados exigidos por serviços de pagamento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2 — Uso das Informações</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os dados são utilizados para:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Funcionamento da plataforma</li>
              <li>Segurança</li>
              <li>Personalização da experiência</li>
              <li>Análise de uso</li>
              <li>Processamento de pagamentos</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3 — Pagamentos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pagamentos são processados por provedores externos como Stripe. O Azera Club não armazena dados completos de cartões de crédito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4 — Compartilhamento de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Dados podem ser compartilhados com:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Serviços de infraestrutura</li>
              <li>Provedores de pagamento</li>
              <li>Autoridades legais quando exigido por lei</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5 — Segurança</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Medidas de segurança são adotadas para proteger os dados dos usuários. No entanto, nenhum sistema online pode garantir segurança absoluta.
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
