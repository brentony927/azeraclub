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

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Privacidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">A AZERA CLUB respeita a privacidade dos seus utilizadores e está empenhada em proteger as informações pessoais.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Informações que Recolhemos</h2>
            <p className="text-sm text-muted-foreground">Podemos recolher:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Nome e endereço de e-mail</li>
              <li>Preferências de estilo de vida</li>
              <li>Informações de viagens</li>
              <li>Detalhes do portfólio de imóveis</li>
              <li>Dados de calendário e eventos</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Como Utilizamos as Informações</h2>
            <p className="text-sm text-muted-foreground">Os dados são utilizados para:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Personalizar a experiência do utilizador</li>
              <li>Disponibilizar funcionalidades da plataforma</li>
              <li>Gerar recomendações de estilo de vida</li>
              <li>Melhorar o desempenho do sistema</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Proteção de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Aplicamos práticas de segurança de nível empresarial para proteger os dados dos utilizadores contra acessos não autorizados.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Serviços de Terceiros</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Algumas funcionalidades da plataforma podem envolver serviços de terceiros, como reservas de viagens ou fornecedores de eventos. A AZERA CLUB não é responsável pelas políticas de privacidade desses fornecedores externos.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Controlo do Utilizador</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Os utilizadores podem atualizar, exportar ou eliminar os seus dados pessoais nas definições da conta.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">Questões sobre privacidade podem ser enviadas para: <a href="mailto:privacy@azeraclub.com" className="text-primary hover:underline">privacy@azeraclub.com</a></p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
