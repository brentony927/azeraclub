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
  const azeraLogo = usePublicLogo();
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden landing-monochrome">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
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

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            O Sistema Operacional para Vidas Ambiciosas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] tracking-tight text-balance"
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
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium group w-full sm:w-auto">
              <Link to="/signup">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
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

          {/* App mockup with gradient border */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 mx-auto max-w-3xl"
          >
            <div className="gradient-border p-[1px] rounded-2xl">
              <div className="bg-card rounded-2xl p-1">
                <div className="bg-card rounded-xl p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="ml-auto text-xs text-muted-foreground font-mono opacity-60">azera.app</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Sparkles, label: "AZERA IA", w: "w-3/4" },
                      { icon: Target, label: "Agenda", w: "w-2/3" },
                      { icon: Radar, label: "Radar", w: "w-1/2" },
                    ].map((item) => (
                      <div key={item.label} className="glass-card card-shine p-3 rounded-lg space-y-2">
                        <item.icon className="h-4 w-4 text-primary" />
                        <p className="text-[10px] sm:text-xs font-semibold">{item.label}</p>
                        <div className={`h-1.5 bg-primary/20 rounded-full ${item.w}`} />
                      </div>
                    ))}
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
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">
              Como funciona
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              Um Sistema. <span className="moss-text">Controle Total da Vida.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.label} delay={i * 0.15}>
                <Card className="glass-card-hover card-shine h-full border-border/20 relative overflow-hidden">
                  <CardContent className="p-8 space-y-5 relative z-10">
                    {/* Step number */}
                    <span className="absolute top-4 right-4 text-6xl font-serif font-bold text-primary/[0.06]">
                      {i + 1}
                    </span>
                    <div className="w-14 h-14 rounded-2xl moss-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                      <f.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {f.label}
                    </p>
                    <h3 className="text-xl font-serif font-bold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                    <ul className="space-y-2 pt-2">
                      {f.details.map((d) => (
                        <li key={d} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <ScrollReveal className="text-center space-y-4">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">
              Veja a AZERA em Ação
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              Exemplos reais de como a AZERA ajuda você a{" "}
              <span className="moss-text">pensar, planear e crescer.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <Card className="glass-card-hover card-shine h-full border-border/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Planeamento com IA
                  </div>
                  <div className="rounded-xl bg-secondary/60 p-3 text-sm">
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
              <Card className="glass-card-hover card-shine h-full border-border/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Radar className="h-4 w-4 text-primary" />
                    Radar de Oportunidades
                  </div>
                  <div className="rounded-xl bg-secondary/60 p-3 text-sm">
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
              <Card className="glass-card-hover card-shine h-full border-border/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Relatório Semanal de Inteligência
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-2xl font-serif font-bold moss-text">78%</p>
                        <p className="text-[10px] text-muted-foreground">Índice de Produtividade</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-2xl font-serif font-bold">12/16</p>
                        <p className="text-[10px] text-muted-foreground">Metas Concluídas</p>
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-lg font-serif font-bold moss-text">3</p>
                      <p className="text-[10px] text-muted-foreground">Oportunidades Detectadas</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
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
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <ScrollReveal className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Pronto para <span className="moss-text">estrategizar a sua vida</span>?
          </h2>
          <p className="text-muted-foreground">
            Junte-se a pessoas ambiciosas que estão a usar IA para organizar, otimizar e crescer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium group">
              <Link to="/signup">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-primary/20 hover:bg-primary/5">
              <Link to="/planos">Ver Planos e Preços</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Plano gratuito disponível · Sem cartão de crédito
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
            {[
              { label: "FAQ", to: "/faq" },
              { label: "Contacto", to: "/contact" },
              { label: "Termos", to: "/terms" },
              { label: "Privacidade", to: "/privacy" },
              { label: "Diretrizes", to: "/community-guidelines" },
              { label: "Segurança", to: "/security-policy" },
            ].map((link, i) => (
              <span key={link.to} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && <span className="text-muted-foreground/20 hidden sm:inline">·</span>}
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
