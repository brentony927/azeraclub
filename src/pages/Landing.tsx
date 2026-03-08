import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Radar, Users, ArrowRight, Sparkles, Target, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ParticlesBackground from "@/components/ParticlesBackground";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import { usePublicLogo } from "@/hooks/useAzeraLogo";

const features = [
  {
    icon: Brain,
    title: "IA Que Pensa Com Você",
    label: "Estrategista de Vida com IA",
    description:
      "O assistente inteligente da AZERA ajuda a planear objetivos, analisar decisões e identificar oportunidades antes de qualquer outro.",
    details: ["Planejar decisões", "Analisar objetivos", "Pensar estrategicamente"],
  },
  {
    icon: Radar,
    title: "Descubra Oportunidades",
    label: "Radar de Oportunidades",
    description:
      "A AZERA analisa constantemente os seus planos, conexões e metas para destacar oportunidades alinhadas às suas ambições.",
    details: ["Detectar oportunidades", "Recomendações inteligentes", "Insights semanais"],
  },
  {
    icon: Users,
    title: "Construa Conexões Poderosas",
    label: "Networking Estratégico",
    description:
      "Acesse o ecossistema de networking AZR e conecte-se com pessoas ambiciosas que estão a construir, criar e crescer.",
    details: ["Conecte-se com pessoas ambiciosas", "Comunidade AZR", "Ecossistema de crescimento"],
  },
];

const weekPlan = [
  { day: "Segunda", task: "Deep Work — Estratégia de Negócios" },
  { day: "Terça", task: "Networking e construção de relações" },
  { day: "Quarta", task: "Execução e desenvolvimento de projetos" },
  { day: "Quinta", task: "Aprendizado e crescimento de habilidades" },
  { day: "Sexta", task: "Revisão de progresso e detecção de oportunidades" },
];

const opportunities = [
  "Expanda a sua rede profissional esta semana.",
  "Lance a sua nova ideia nos próximos 30 dias.",
  "Foque no desenvolvimento de habilidades em IA e automação.",
];

export default function Landing() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <img src={azeraLogo} alt="AZERA" className="w-10 h-10 rounded-xl object-contain" />
            <span className="font-serif font-bold text-xl moss-text tracking-widest uppercase">
              AZERA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight"
          >
            A Sua Vida.{" "}
            <span className="moss-text">Organizada, Otimizada</span>{" "}
            e Estrategizada por IA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Planeie a sua vida, descubra oportunidades e tome decisões melhores
            com uma IA feita para pessoas ambiciosas.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground/70 italic"
          >
            Desenvolvido para empreendedores, criadores e mentes ambiciosas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium">
              <Link to="/signup">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold"
              onClick={scrollToHowItWorks}
            >
              Veja Como Funciona
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground/60"
          >
            Plano gratuito disponível · Sem cartão de crédito
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 mx-auto max-w-3xl"
          >
            <div className="glass-card p-1 rounded-2xl">
              <div className="bg-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="ml-auto text-xs text-muted-foreground font-mono">azera.app</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-[10px] sm:text-xs font-semibold">AZERA IA</p>
                    <div className="h-1.5 bg-muted rounded-full w-3/4" />
                  </div>
                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <Target className="h-4 w-4 text-accent" />
                    <p className="text-[10px] sm:text-xs font-semibold">Agenda</p>
                    <div className="h-1.5 bg-muted rounded-full w-2/3" />
                  </div>
                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <Radar className="h-4 w-4 text-accent" />
                    <p className="text-[10px] sm:text-xs font-semibold">Radar</p>
                    <div className="h-1.5 bg-muted rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <ScrollReveal className="text-center space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Como funciona
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              Um Sistema. <span className="moss-text">Controle Total da Vida.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 0.15}>
                <Card className="glass-card-hover h-full border-border/30">
                  <CardContent className="p-8 space-y-5">
                    <div className="w-12 h-12 rounded-xl moss-gradient flex items-center justify-center">
                      <f.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {f.label}
                    </p>
                    <h3 className="text-xl font-serif font-bold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                    <ul className="space-y-2 pt-2">
                      {f.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center">
            <p className="text-sm text-muted-foreground italic">
              A AZERA foi criada para transformar a sua vida num sistema estratégico.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VEJA EM AÇÃO ===== */}
      <section className="py-24 sm:py-32 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <ScrollReveal className="text-center space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Veja a AZERA em Ação
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              Exemplos reais de como a AZERA ajuda você a{" "}
              <span className="moss-text">pensar, planear e crescer.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Planeamento com IA
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-sm">
                    Organize a minha semana para máxima produtividade.
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-3">
                    <p className="text-xs font-semibold moss-text">AZERA IA</p>
                    <p className="text-sm font-semibold">A sua estrutura semanal estratégica:</p>
                    <ul className="space-y-2">
                      {weekPlan.map((w) => (
                        <li key={w.day} className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{w.day}</span>
                          <br />
                          {w.task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Radar className="h-4 w-4" />
                    Radar de Oportunidades
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-sm">
                    Em quais oportunidades devo focar este mês?
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-3">
                    <p className="text-xs font-semibold moss-text">AZERA IA</p>
                    <p className="text-sm font-semibold">Com base nos seus objetivos:</p>
                    <ul className="space-y-3">
                      {opportunities.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="font-bold text-foreground shrink-0">
                            {i + 1}.
                          </span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    Relatório Semanal de Inteligência
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-secondary/60">
                        <p className="text-2xl font-serif font-bold moss-text">78%</p>
                        <p className="text-[10px] text-muted-foreground">Índice de Produtividade</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary/60">
                        <p className="text-2xl font-serif font-bold">12/16</p>
                        <p className="text-[10px] text-muted-foreground">Metas Concluídas</p>
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/60">
                      <p className="text-lg font-serif font-bold moss-text">3</p>
                      <p className="text-[10px] text-muted-foreground">Oportunidades Detectadas</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-border/30">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Recomendação da IA</p>
                      <p className="text-xs text-foreground">
                        Foque em tarefas de alto impacto e agende duas reuniões de networking esta semana.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal className="text-center space-y-2">
            <p className="text-base font-semibold">
              A AZERA não é apenas um assistente.
            </p>
            <p className="text-sm text-muted-foreground italic">
              É um sistema estratégico para a sua vida.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 sm:py-32 px-4">
        <ScrollReveal className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Pronto para <span className="moss-text">estrategizar a sua vida</span>?
          </h2>
          <p className="text-muted-foreground">
            Junte-se a pessoas ambiciosas que estão a usar IA para organizar, otimizar e crescer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium">
              <Link to="/signup">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base font-semibold">
              <Link to="/planos">Ver Planos e Preços</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Plano gratuito disponível · Sem cartão de crédito
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">FAQ</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contacto</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Termos</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacidade</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/community-guidelines" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Diretrizes</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/security-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Segurança</Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
