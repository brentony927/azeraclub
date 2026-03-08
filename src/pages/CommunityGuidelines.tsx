import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CommunityGuidelines() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Diretrizes da Comunidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            O AZERA CLUB é uma comunidade de empreendedores e profissionais comprometidos com o crescimento mútuo. Estas diretrizes existem para garantir um ambiente seguro, respeitoso e produtivo para todos os membros.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Condutas Proibidas</h2>
            <p className="text-sm text-muted-foreground">Os utilizadores não podem:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Aplicar golpes ou fraudes contra outros membros</li>
              <li>Enviar spam ou mensagens não solicitadas em massa</li>
              <li>Publicar conteúdo enganoso, falso ou manipulador</li>
              <li>Utilizar identidade falsa ou perfis fictícios</li>
              <li>Promover esquemas ilegais, piramidais ou de enriquecimento rápido</li>
              <li>Assediar, ameaçar ou intimidar outros utilizadores</li>
              <li>Discriminar com base em raça, género, orientação sexual, religião ou nacionalidade</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Conteúdos Proibidos</h2>
            <p className="text-sm text-muted-foreground">É estritamente proibido publicar conteúdo relacionado a:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Fraude financeira ou esquemas fraudulentos</li>
              <li>Esquemas piramidais ou Ponzi</li>
              <li>Phishing ou tentativas de roubo de dados</li>
              <li>Atividades ilegais de qualquer natureza</li>
              <li>Conteúdo explícito, violento ou ofensivo</li>
              <li>Propaganda de ódio ou extremismo</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Sistema de Denúncia</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos os perfis possuem a opção de denúncia. Os utilizadores podem denunciar outros membros pelos seguintes motivos:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Fraude ou golpe</li>
              <li>Spam</li>
              <li>Perfil falso</li>
              <li>Comportamento abusivo</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as denúncias são analisadas pela equipa do AZERA CLUB e tratadas com confidencialidade.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Consequências</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O AZERA CLUB reserva-se o direito de remover conteúdo, suspender ou encerrar permanentemente contas que violem estas diretrizes. Em casos graves, a suspensão pode ocorrer sem aviso prévio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Responsabilidade dos Membros</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada membro é responsável pelo seu comportamento dentro da plataforma. Ao utilizar o AZERA CLUB, o utilizador concorda em respeitar estas diretrizes e contribuir para um ambiente positivo e profissional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Denúncias e questões podem ser enviadas para: <a href="mailto:community@azeraclub.com" className="text-primary hover:underline">community@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
