import {
  Rocket, Users, Hammer, Target, Lightbulb, Flame, Heart, Sparkles,
  Crown, ShieldCheck, Award, Star,
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
  {
    key: "first_venture",
    name: "Primeiro Venture",
    description: "Criou seu primeiro venture",
    criterion: "Criar 1 venture",
    icon: Rocket,
    colorClass: "badge-white",
  },
  {
    key: "networker",
    name: "Networker",
    description: "Mestre do networking",
    criterion: "5+ conexões aceitas",
    icon: Users,
    colorClass: "badge-black",
  },
  {
    key: "builder",
    name: "Builder",
    description: "Construtor incansável",
    criterion: "3+ projetos criados",
    icon: Hammer,
    colorClass: "badge-green",
  },
  {
    key: "goal_crusher",
    name: "Esmagador de Metas",
    description: "Conquista objetivos sem parar",
    criterion: "5+ objetivos concluídos",
    icon: Target,
    colorClass: "badge-yellow",
  },
  {
    key: "idea_machine",
    name: "Máquina de Ideias",
    description: "Fonte inesgotável de ideias",
    criterion: "10+ ideias no cofre",
    icon: Lightbulb,
    colorClass: "badge-blue",
  },
  {
    key: "challenger",
    name: "Desafiante",
    description: "Aceita e vence desafios",
    criterion: "3+ desafios concluídos",
    icon: Flame,
    colorClass: "badge-orange",
  },
  {
    key: "social_butterfly",
    name: "Borboleta Social",
    description: "Ativo na comunidade",
    criterion: "10+ posts no feed",
    icon: Heart,
    colorClass: "badge-pink",
  },
  {
    key: "habit_master",
    name: "Mestre dos Hábitos",
    description: "Consistência é a chave",
    criterion: "Streak 30+ em hábitos",
    icon: Sparkles,
    colorClass: "badge-purple",
  },
  {
    key: "elite_achiever",
    name: "Elite Achiever",
    description: "Top performer da plataforma",
    criterion: "Founder Score 80+",
    icon: Crown,
    colorClass: "badge-gold-metallic",
  },
  {
    key: "trusted_pro",
    name: "Confiança Pro",
    description: "Membro verificado Pro",
    criterion: "Plano PRO ativo",
    icon: ShieldCheck,
    colorClass: "badge-trust-pro",
  },
  {
    key: "trusted_business",
    name: "Confiança Business",
    description: "Membro verificado Business",
    criterion: "Plano BUSINESS ativo",
    icon: Award,
    colorClass: "badge-trust-business",
  },
  {
    key: "verified_founder",
    name: "Fundador Verificado",
    description: "Perfil verificado pela plataforma",
    criterion: "Perfil verificado",
    icon: Star,
    colorClass: "badge-white",
  },
];

export function getBadgeByKey(key: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.key === key);
}
