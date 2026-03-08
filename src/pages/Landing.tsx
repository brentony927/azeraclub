import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Radar, Users, ArrowRight, Sparkles, Target, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ParticlesBackground from "@/components/ParticlesBackground";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import azeraLogo from "@/assets/azera-logo.jpg";

const features = [
  {
    icon: Brain,
    title: "AI That Thinks With You",
    label: "AI Life Strategist",
    description:
      "AZERA's intelligent assistant helps you plan goals, analyse decisions and identify opportunities before others even notice them.",
    details: ["Plan decisions", "Analyse goals", "Think strategically"],
  },
  {
    icon: Radar,
    title: "Discover Opportunities",
    label: "Opportunity Radar",
    description:
      "AZERA constantly scans your plans, connections and goals to highlight opportunities that match your ambitions.",
    details: ["Detect opportunities", "Smart recommendations", "Weekly insights"],
  },
  {
    icon: Users,
    title: "Build Powerful Connections",
    label: "Strategic Networking",
    description:
      "Access the AZR networking ecosystem and connect with ambitious people who are building, creating and growing.",
    details: ["Connect with ambitious people", "AZR community", "Growth ecosystem"],
  },
];

const weekPlan = [
  { day: "Monday", task: "Deep Work — Business Strategy" },
  { day: "Tuesday", task: "Networking and relationship building" },
  { day: "Wednesday", task: "Execution and project development" },
  { day: "Thursday", task: "Learning and skill growth" },
  { day: "Friday", task: "Review progress and detect opportunities" },
];

const opportunities = [
  "Expand your professional network this week.",
  "Launch your new idea within the next 30 days.",
  "Focus on skill development in AI and automation.",
];

export default function Landing() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Particle bg */}
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
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

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight"
          >
            Your Life.{" "}
            <span className="moss-text">Organized, Optimized</span>{" "}
            and Strategized by AI.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Plan your life, discover opportunities and make better decisions
            with an AI built for ambitious people.
          </motion.p>

          {/* Authority line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground/70 italic"
          >
            Built for entrepreneurs, creators and ambitious minds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium">
              <Link to="/signup">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold"
              onClick={scrollToHowItWorks}
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground/60"
          >
            Free plan available · No credit card required
          </motion.p>

          {/* App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 mx-auto max-w-3xl"
          >
            <div className="glass-card p-1 rounded-2xl">
              <div className="bg-card rounded-xl p-4 sm:p-6 space-y-4">
                {/* Mock header */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="ml-auto text-xs text-muted-foreground font-mono">azera.app</div>
                </div>
                {/* Mock content */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-[10px] sm:text-xs font-semibold">AZERA AI</p>
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

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <ScrollReveal className="text-center space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              One System. <span className="moss-text">Total Life Control.</span>
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
              AZERA was designed to transform your life into a strategic system.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SEE IN ACTION ===== */}
      <section className="py-24 sm:py-32 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <ScrollReveal className="text-center space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              See AZERA In Action
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              Real examples of how AZERA helps you{" "}
              <span className="moss-text">think, plan and grow.</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Example 1 — Weekly plan */}
            <ScrollReveal delay={0}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    AI Planning
                  </div>
                  {/* User bubble */}
                  <div className="rounded-xl bg-secondary p-3 text-sm">
                    Plan my week for productivity.
                  </div>
                  {/* AI bubble */}
                  <div className="rounded-xl glass-card p-4 space-y-3">
                    <p className="text-xs font-semibold moss-text">AZERA AI</p>
                    <p className="text-sm font-semibold">Your strategic weekly structure:</p>
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

            {/* Example 2 — Opportunities */}
            <ScrollReveal delay={0.15}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Radar className="h-4 w-4" />
                    Opportunity Radar
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-sm">
                    What opportunities should I focus on this month?
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-3">
                    <p className="text-xs font-semibold moss-text">AZERA AI</p>
                    <p className="text-sm font-semibold">Based on your goals:</p>
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

            {/* Example 3 — Intelligence Report */}
            <ScrollReveal delay={0.3}>
              <Card className="glass-card-hover h-full border-border/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    Weekly Intelligence Report
                  </div>
                  <div className="rounded-xl glass-card p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-secondary/60">
                        <p className="text-2xl font-serif font-bold moss-text">78%</p>
                        <p className="text-[10px] text-muted-foreground">Productivity Score</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary/60">
                        <p className="text-2xl font-serif font-bold">12/16</p>
                        <p className="text-[10px] text-muted-foreground">Goals Completed</p>
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/60">
                      <p className="text-lg font-serif font-bold moss-text">3</p>
                      <p className="text-[10px] text-muted-foreground">Detected Opportunities</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-border/30">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">AI Recommendation</p>
                      <p className="text-xs text-foreground">
                        Focus on high-impact tasks and schedule two networking meetings this week.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal className="text-center space-y-2">
            <p className="text-base font-semibold">
              AZERA is not just an assistant.
            </p>
            <p className="text-sm text-muted-foreground italic">
              It is a strategic system for your life.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 sm:py-32 px-4">
        <ScrollReveal className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to <span className="moss-text">strategize your life</span>?
          </h2>
          <p className="text-muted-foreground">
            Join ambitious people who are using AI to organize, optimize and grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-13 px-8 text-base font-semibold moss-gradient text-primary-foreground btn-premium">
              <Link to="/signup">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base font-semibold">
              <Link to="/planos">See Plans & Pricing</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Free plan available · No credit card required
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">FAQ</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contact</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy</Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
