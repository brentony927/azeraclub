import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, TrendingUp, Wallet, Gift, Shield, Rocket, Star, Trophy, Crown, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon3D from "@/components/ui/icon-3d";
import AnimatedCounter from "@/components/AnimatedCounter";
import { usePublicLogo } from "@/hooks/useAzeraLogo";
import { supabase } from "@/integrations/supabase/client";

export default function Earn() {
  const logo = usePublicLogo();
  const [topAffiliates, setTopAffiliates] = useState<any[]>([]);

  useEffect(() => {
    // Load top affiliates from affiliate_leads count
    const loadRanking = async () => {
      const { data } = await supabase
        .from("affiliate_leads" as any)
        .select("referrer_id");
      if (data) {
        const counts: Record<string, number> = {};
        (data as any[]).forEach(l => {
          counts[l.referrer_id] = (counts[l.referrer_id] || 0) + 1;
        });
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id, count], i) => ({ rank: i + 1, id, count }));
        setTopAffiliates(sorted);
      }
    };
    loadRanking();
  }, []);

  const tiers = [
    { sales: "0–9", rate: "25%", level: "Starter" },
    { sales: "10–49", rate: "30%", level: "Partner" },
    { sales: "50–99", rate: "35%", level: "Ambassador" },
    { sales: "100+", rate: "40%", level: "Legend" },
  ];

  const steps = [
    { icon: Star, color: "gold" as const, title: "1. Solicite participação", desc: "No seu perfil, envie sua solicitação com suas redes sociais e estratégia." },
    { icon: Users, color: "blue" as const, title: "2. Aprovação manual", desc: "Nossa equipe avalia seu perfil e aprova sua participação." },
    { icon: Gift, color: "green" as const, title: "3. Compartilhe seu link", desc: "Receba seu link exclusivo e compartilhe nas redes sociais." },
    { icon: Wallet, color: "gold" as const, title: "4. Receba comissões", desc: "Ganhe até 40% em cada assinatura gerada. Saques via PIX ou PayPal." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <img src={logo} alt="AZERA" className="w-14 h-14 rounded-xl object-contain mx-auto" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Ganhe dinheiro indicando o <span className="gold-text">Azera Club</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Programa de Afiliados exclusivo para membros PRO e BUSINESS. Comissões recorrentes de até 40%. Sem limite de ganhos.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold mt-4">
              Criar Conta e Começar
            </Button>
          </Link>
        </motion.div>

        {/* Stats counters */}
        <div className="grid grid-cols-3 gap-6">
          <AnimatedCounter value={500} suffix="+" label="Afiliados ativos" />
          <AnimatedCounter value={25} suffix="%" label="Comissão base" />
          <AnimatedCounter value={40} suffix="%" label="Comissão máxima" />
        </div>

        {/* How it works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center">Como funciona</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map(s => (
              <Card key={s.title} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-3">
                  <Icon3D icon={s.icon} color={s.color} size="lg" animated />
                  <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Commission tiers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center flex items-center justify-center gap-2">
            <Icon3D icon={TrendingUp} color="green" size="sm" animated /> Níveis e Comissões
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers.map(t => (
              <Card key={t.sales} className="border-border/50 bg-card/80 hover:border-primary/30 transition-colors">
                <CardContent className="p-4 text-center space-y-1">
                  <p className="text-2xl font-bold text-foreground">{t.rate}</p>
                  <p className="text-xs font-semibold text-primary">{t.level}</p>
                  <p className="text-[10px] text-muted-foreground">{t.sales} vendas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ranking */}
        {topAffiliates.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground text-center flex items-center justify-center gap-2">
              <Icon3D icon={Trophy} color="gold" size="sm" animated /> Top Divulgadores
            </h2>
            <div className="space-y-2">
              {topAffiliates.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/80 border border-border/30">
                  <span className="text-lg font-bold text-primary w-8 text-center">
                    {a.rank <= 3 ? ["🥇", "🥈", "🥉"][a.rank - 1] : `${a.rank}°`}
                  </span>
                  <span className="flex-1 text-sm text-foreground font-medium">{a.id}</span>
                  <span className="text-sm font-bold text-muted-foreground">{a.count} leads</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security */}
        <div className="text-center space-y-3">
          <Icon3D icon={Shield} color="silver" size="lg" animated />
          <h3 className="font-semibold text-foreground">Sistema seguro e transparente</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Rastreamento automático por 30 dias. Anti-fraude integrado. Pagamento via PIX ou PayPal após aprovação. Comissões liberadas após 7 dias.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pb-8">
          <Icon3D icon={Rocket} color="gold" size="lg" animated />
          <h2 className="text-2xl font-serif font-bold text-foreground">Pronto para começar?</h2>
          <Link to="/signup">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold">
              Criar Conta Gratuita
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-foreground hover:underline">Entrar</Link> e solicitar no seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
