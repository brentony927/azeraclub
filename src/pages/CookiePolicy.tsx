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

        <div className="glass-card p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Cookies</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            O AZERA CLUB utiliza cookies e tecnologias semelhantes para melhorar a experiência do utilizador, analisar o tráfego e personalizar conteúdo.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. O Que São Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies são pequenos ficheiros de texto armazenados no dispositivo do utilizador quando visita um website. Permitem que o site reconheça o utilizador e memorize as suas preferências.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Tipos de Cookies que Utilizamos</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
              <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico da plataforma, como autenticação e segurança.</li>
              <li><strong>Cookies de desempenho:</strong> Recolhem informações sobre como os utilizadores interagem com a plataforma, ajudando-nos a melhorar o desempenho.</li>
              <li><strong>Cookies de funcionalidade:</strong> Memorizam preferências do utilizador, como tema visual e idioma.</li>
              <li><strong>Cookies analíticos:</strong> Utilizados para analisar padrões de utilização e melhorar a experiência geral.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Gestão de Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os utilizadores podem controlar ou desativar cookies através das definições do navegador. Note que a desativação de certos cookies pode afetar a funcionalidade da plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Cookies de Terceiros</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Alguns serviços integrados na plataforma (como processadores de pagamento e ferramentas de análise) podem definir os seus próprios cookies. O AZERA CLUB não controla esses cookies e recomenda a consulta das respetivas políticas de privacidade.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Consentimento</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao continuar a utilizar a plataforma, o utilizador consente com a utilização de cookies conforme descrito nesta política. O consentimento pode ser revogado a qualquer momento através das definições do navegador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões sobre cookies podem ser enviadas para: <a href="mailto:privacy@azeraclub.com" className="text-primary hover:underline">privacy@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
