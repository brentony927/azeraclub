import {
  LayoutDashboard, Brain, CalendarDays, Users, MessageCircle, Rocket,
  Target, Lightbulb, BookOpen, Radar, TrendingUp, ArrowRight, Zap,
  HelpCircle, Globe, Trophy, Crown, CreditCard, Store, Shield, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GuideSection {
  icon: React.ElementType;
  title: string;
  description: string;
  steps: string[];
  tier?: string;
}

const sections: GuideSection[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "A sua central de comando. Veja um resumo de tudo o que está a acontecer.",
    steps: [
      "Aceda ao Dashboard após iniciar sessão",
      "Consulte o resumo das suas tarefas, objetivos e agenda",
      "Use os atalhos rápidos para navegar pelas funcionalidades",
    ],
  },
  {
    icon: Brain,
    title: "IA — Assistente Inteligente",
    description: "Converse com a AZERA IA para obter conselhos, planos e análises personalizadas.",
    steps: [
      "Aceda à secção 'IA' no menu lateral",
      "Escreva a sua pergunta ou pedido no chat",
      "A IA memoriza o contexto das suas conversas anteriores",
      "Use para criar planos de negócio, análises de mercado e estratégias",
    ],
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    description: "Organize as suas tarefas, compromissos e lembretes num só lugar.",
    steps: [
      "Abra a 'Agenda' no menu",
      "Clique em '+' para criar uma nova tarefa ou evento",
      "Defina data, hora e tipo (tarefa, reunião, lembrete)",
      "Marque como concluída quando terminar",
    ],
  },
  {
    icon: Users,
    title: "Founder Match",
    description: "Encontre co-founders, parceiros e colaboradores com interesses alinhados.",
    steps: [
      "Crie o seu 'Founder Profile' com skills, indústria e o que procura",
      "Publique o perfil para ser descoberto por outros founders",
      "Explore perfis e envie pedidos de conexão",
      "Use o sistema de match para encontrar compatibilidade",
    ],
  },
  {
    icon: MessageCircle,
    title: "Conversas",
    description: "Comunique-se em privado com outros founders da plataforma.",
    steps: [
      "Aceda a 'Conversas' no menu Founder Alignment",
      "Selecione uma conversa ou inicie uma nova a partir de um perfil",
      "Clique no avatar para visitar o perfil do founder",
      "Use o menu ⋮ para adicionar a um grupo, bloquear ou denunciar",
      "Plano gratuito: 10 mensagens/semana — upgrade para ilimitado",
    ],
  },
  {
    icon: Rocket,
    title: "Oportunidades",
    description: "Publique e descubra oportunidades de colaboração, investimento e projetos.",
    steps: [
      "Aceda a 'Oportunidades' no menu",
      "Clique em 'Publicar Oportunidade' para criar a sua",
      "Adicione título, descrição, e o que procura",
      "Clique no ícone de mensagem para contactar o autor em privado",
    ],
  },
  {
    icon: Store,
    title: "Deal Marketplace",
    description: "Marketplace interno para publicar startups, parcerias e investimentos.",
    steps: [
      "Aceda ao 'Deals' no menu",
      "Publique um deal com título, categoria e valor estimado",
      "Explore deals de outros founders por categoria",
      "Clique em 'Join Deal' para abrir uma conversa privada",
    ],
  },
  {
    icon: Shield,
    title: "Circles Privados",
    description: "Crie masterminds e grupos exclusivos com regras de entrada personalizadas.",
    steps: [
      "Na aba 'Grupos' das Conversas, clique em 'Novo Grupo'",
      "Defina nome, descrição e foto do grupo",
      "Selecione membros das suas conexões",
      "Gerencie membros e funções dentro do grupo",
    ],
  },
  {
    icon: Star,
    title: "Reputation Economy",
    description: "Sistema de reputação que transforma a sua atividade em poder na comunidade.",
    steps: [
      "Cada ação gera Founder Score: oportunidades (+20), sugestões aprovadas (+30), referrals (+40)",
      "Suba de nível: New → Active → Rising → Elite Founder",
      "Founders com maior score têm mais visibilidade no mapa e nas buscas",
      "Consulte o Leaderboard para ver o seu ranking",
    ],
  },
  {
    icon: Lightbulb,
    title: "Cofre de Ideias",
    description: "Guarde e organize todas as suas ideias de negócio.",
    steps: [
      "Aceda ao 'Cofre de Ideias'",
      "Adicione uma nova ideia com título, descrição e categoria",
      "Acompanhe o estado de cada ideia (rascunho, em análise, validada)",
    ],
  },
  {
    icon: Target,
    title: "Objetivos",
    description: "Defina metas claras e acompanhe o progresso.",
    steps: [
      "Crie objetivos com data-alvo e categoria",
      "Atualize a percentagem de progresso",
      "Filtre por estado (ativo, concluído, pausado)",
    ],
  },
  {
    icon: BookOpen,
    title: "Diário",
    description: "Registe reflexões diárias e receba insights da IA.",
    steps: [
      "Escreva uma entrada no diário",
      "Selecione o seu humor do dia",
      "A IA pode responder com reflexões e conselhos personalizados",
    ],
  },
  {
    icon: Radar,
    title: "Radar de Oportunidades",
    description: "Descubra tendências e oportunidades de mercado.",
    steps: [
      "Aceda ao 'Radar' no menu",
      "Explore oportunidades e tendências detetadas",
      "Guarde as mais relevantes nos seus favoritos",
    ],
    tier: "PRO",
  },
  {
    icon: Globe,
    title: "Mapa Global",
    description: "Veja founders de todo o mundo no mapa interativo.",
    steps: [
      "Aceda ao 'Mapa Global' no menu Founder",
      "Explore os pins no mapa para encontrar founders na sua região",
      "Clique num pin para ver o perfil e conectar-se",
    ],
  },
  {
    icon: Trophy,
    title: "Leaderboard & Score",
    description: "Ganhe pontos, suba no ranking e desbloqueie badges.",
    steps: [
      "O Founder Score é calculado automaticamente",
      "Pontue com perfil completo, conexões, ventures e atividade",
      "Consulte o Leaderboard para ver o seu ranking",
    ],
  },
];

export default function HowToUse() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">Guia de Utilização</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Como Usar a AZERA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore todas as funcionalidades da plataforma. Cada secção abaixo explica como tirar o máximo partido das ferramentas disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <Card key={idx} className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow relative overflow-hidden">
            {section.tier && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  <Crown className="h-3 w-3" />
                  {section.tier}
                </span>
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                {section.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                        {sIdx + 1}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-2 text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px]">Menu lateral</span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-[11px] font-medium text-foreground">{section.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upgrade CTA */}
      <Card className="mt-10 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Desbloqueie todas as funcionalidades</h3>
              <p className="text-sm text-muted-foreground">Upgrade para PRO ou Business e aceda a ferramentas avançadas.</p>
            </div>
          </div>
          <a href="/planos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Ver Planos <ArrowRight className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
