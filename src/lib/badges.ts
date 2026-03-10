import {
  Rocket, Users, Hammer, Target, Lightbulb, Flame, Heart, Sparkles,
  Crown, ShieldCheck, Award, Star, BookOpen, Zap, Globe, TrendingUp,
  MessageCircle, Calendar, Brain, Compass, Trophy, Gem, Shield,
  Eye, Clock, Coffee, Briefcase, PenTool, Mountain, Puzzle,
  Megaphone, HandshakeIcon, MapPin, BarChart3, Layers, Wallet,
  Swords, GraduationCap, Telescope, FileText, CircleDot, Wand2,
  Sprout, BadgeCheck, Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BadgeDefinition {
  key: string;
  name: string;
  description: string;
  criterion: string;
  icon: LucideIcon;
  colorClass: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Original 12 ──
  { key: "first_venture", name: "Primeiro Venture", description: "Criou seu primeiro venture", criterion: "Criar 1 venture", icon: Rocket, colorClass: "badge-white" },
  { key: "networker", name: "Networker", description: "Mestre do networking", criterion: "5+ conexões aceitas", icon: Users, colorClass: "badge-black" },
  { key: "builder", name: "Builder", description: "Construtor incansável", criterion: "3+ projetos criados", icon: Hammer, colorClass: "badge-green" },
  { key: "goal_crusher", name: "Esmagador de Metas", description: "Conquista objetivos sem parar", criterion: "5+ objetivos concluídos", icon: Target, colorClass: "badge-yellow" },
  { key: "idea_machine", name: "Máquina de Ideias", description: "Fonte inesgotável de ideias", criterion: "10+ ideias no cofre", icon: Lightbulb, colorClass: "badge-blue" },
  { key: "challenger", name: "Desafiante", description: "Aceita e vence desafios", criterion: "3+ desafios concluídos", icon: Flame, colorClass: "badge-orange" },
  { key: "social_butterfly", name: "Borboleta Social", description: "Ativo na comunidade", criterion: "10+ posts no feed", icon: Heart, colorClass: "badge-pink" },
  { key: "habit_master", name: "Mestre dos Hábitos", description: "Consistência é a chave", criterion: "Streak 30+ em hábitos", icon: Sparkles, colorClass: "badge-purple" },
  { key: "elite_achiever", name: "Elite Achiever", description: "Top performer da plataforma", criterion: "Founder Score 80+", icon: Crown, colorClass: "badge-gold-metallic" },
  { key: "trusted_pro", name: "Confiança Pro", description: "Membro verificado Pro", criterion: "Plano PRO ativo", icon: ShieldCheck, colorClass: "badge-trust-pro" },
  { key: "trusted_business", name: "Confiança Business", description: "Membro verificado Business", criterion: "Plano BUSINESS ativo", icon: Award, colorClass: "badge-trust-business" },
  { key: "verified_founder", name: "Fundador Verificado", description: "Perfil verificado pela plataforma", criterion: "Perfil verificado", icon: Star, colorClass: "badge-white" },

  // ── 30 novas insígnias ──
  { key: "first_post", name: "Primeira Publicação", description: "Publicou seu primeiro post", criterion: "1+ post no feed", icon: PenTool, colorClass: "badge-white" },
  { key: "journal_writer", name: "Escritor do Diário", description: "Reflexão constante", criterion: "5+ entradas no diário", icon: BookOpen, colorClass: "badge-blue" },
  { key: "streak_7", name: "Semana de Fogo", description: "Hábito mantido por 7 dias", criterion: "Streak 7+ em hábitos", icon: Zap, colorClass: "badge-green" },
  { key: "streak_60", name: "Disciplina de Ferro", description: "60 dias sem parar", criterion: "Streak 60+ em hábitos", icon: Shield, colorClass: "badge-gold-metallic" },
  { key: "ten_ventures", name: "Dez Ventures", description: "10 ventures criados", criterion: "10+ ventures", icon: Layers, colorClass: "badge-orange" },
  { key: "fifty_connections", name: "Rede Poderosa", description: "50 conexões feitas", criterion: "50+ conexões aceitas", icon: Globe, colorClass: "badge-pink" },
  { key: "hundred_ideas", name: "Centurião de Ideias", description: "100 ideias registradas", criterion: "100+ ideias no cofre", icon: Brain, colorClass: "badge-purple" },
  { key: "investor_ready", name: "Pronto para Investir", description: "Oportunidades disponíveis", criterion: "3+ oportunidades criadas", icon: TrendingUp, colorClass: "badge-yellow" },
  { key: "community_leader", name: "Líder Comunitário", description: "Voz ativa na comunidade", criterion: "50+ posts no feed", icon: Megaphone, colorClass: "badge-black" },
  { key: "globe_trotter", name: "Viajante Global", description: "Explorou o mundo", criterion: "5+ viagens registradas", icon: MapPin, colorClass: "badge-blue" },
  { key: "first_connection", name: "Primeiro Contato", description: "Fez a primeira conexão", criterion: "1+ conexão aceita", icon: HandshakeIcon, colorClass: "badge-white" },
  { key: "five_ventures", name: "Empreendedor Serial", description: "5 ventures criados", criterion: "5+ ventures", icon: Briefcase, colorClass: "badge-green" },
  { key: "twenty_connections", name: "Conector", description: "20 conexões na rede", criterion: "20+ conexões aceitas", icon: Users, colorClass: "badge-blue" },
  { key: "ten_objectives", name: "Foco Total", description: "10 objetivos concluídos", criterion: "10+ objetivos concluídos", icon: Target, colorClass: "badge-orange" },
  { key: "fifty_ideas", name: "Visionário", description: "50 ideias registradas", criterion: "50+ ideias no cofre", icon: Compass, colorClass: "badge-purple" },
  { key: "ten_challenges", name: "Guerreiro", description: "10 desafios superados", criterion: "10+ desafios concluídos", icon: Swords, colorClass: "badge-orange" },
  { key: "thirty_posts", name: "Influenciador", description: "30 posts no feed", criterion: "30+ posts no feed", icon: MessageCircle, colorClass: "badge-pink" },
  { key: "streak_14", name: "Duas Semanas Firmes", description: "14 dias de streak", criterion: "Streak 14+ em hábitos", icon: Calendar, colorClass: "badge-green" },
  { key: "streak_90", name: "Lenda da Consistência", description: "90 dias sem falhar", criterion: "Streak 90+ em hábitos", icon: Trophy, colorClass: "badge-gold-metallic" },
  { key: "score_50", name: "Meio Caminho", description: "Score 50+ alcançado", criterion: "Founder Score 50+", icon: BarChart3, colorClass: "badge-yellow" },
  { key: "ten_projects", name: "Fábrica de Projetos", description: "10 projetos criados", criterion: "10+ projetos", icon: Puzzle, colorClass: "badge-green" },
  { key: "first_idea", name: "Primeira Ideia", description: "Registrou a primeira ideia", criterion: "1+ ideia no cofre", icon: Lightbulb, colorClass: "badge-white" },
  { key: "first_objective", name: "Primeira Meta", description: "Definiu seu primeiro objetivo", criterion: "1+ objetivo criado", icon: CircleDot, colorClass: "badge-white" },
  { key: "first_challenge", name: "Primeiro Desafio", description: "Aceitou seu primeiro desafio", criterion: "1+ desafio criado", icon: Flame, colorClass: "badge-orange" },
  { key: "journal_master", name: "Mestre do Diário", description: "30+ reflexões escritas", criterion: "30+ entradas no diário", icon: FileText, colorClass: "badge-purple" },
  { key: "five_opportunities", name: "Caçador de Oportunidades", description: "5 oportunidades criadas", criterion: "5+ oportunidades", icon: Telescope, colorClass: "badge-yellow" },
  { key: "early_adopter", name: "Early Adopter", description: "Membro fundador", criterion: "Conta criada há 30+ dias", icon: Coffee, colorClass: "badge-black" },
  { key: "profile_complete", name: "Perfil Completo", description: "Todas as informações preenchidas", criterion: "Perfil 100% completo", icon: Eye, colorClass: "badge-green" },
  { key: "mentor", name: "Mentor", description: "Ajudou outros founders", criterion: "Score 70+ e 10+ conexões", icon: GraduationCap, colorClass: "badge-blue" },
  { key: "diamond_founder", name: "Diamante Founder", description: "Top 1% da plataforma", criterion: "Score 95+ e 50+ conexões", icon: Gem, colorClass: "badge-gold-metallic" },
];

export function getBadgeByKey(key: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.key === key);
}
