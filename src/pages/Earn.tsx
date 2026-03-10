import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, TrendingUp, Wallet, Gift, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon3D from "@/components/ui/icon-3d";
import { usePublicLogo } from "@/hooks/useAzeraLogo";

export default function Earn() {
  const logo = usePublicLogo();

  const tiers = [
    { sales: "0–9", rate: "25%" },
    { sales: "10–49", rate: "30%" },
    { sales: "50–99", rate: "35%" },
    { sales: "100+", rate: "40%" },
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
            Receba comissões recorrentes em cada assinatura gerada pelo seu link exclusivo. Sem limite de ganhos.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gold-gradient text-primary-foreground font-semibold mt-4">
              Criar Conta e Começar
            </Button>
          </Link>
        </motion.div>

        {/* How it works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Users, color: "blue" as const, title: "1. Ative o modo parceiro", desc: "No seu perfil, ative o programa e receba seu link exclusivo." },
              { icon: Gift, color: "green" as const, title: "2. Compartilhe", desc: "Envie seu link nas redes sociais, grupos e comunidades." },
              { icon: Wallet, color: "gold" as const, title: "3. Receba comissões", desc: "Ganhe 25% em cada assinatura PRO ou BUSINESS gerada." },
            ].map(s => (
              <Card key={s.title} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-3">
                  <Icon3D icon={s.icon} color={s.color} size="lg" animated />
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Commission tiers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center flex items-center justify-center gap-2">
            <Icon3D icon={TrendingUp} color="green" size="sm" animated /> Comissões Progressivas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers.map(t => (
              <Card key={t.sales} className="border-border/50 bg-card/80">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{t.rate}</p>
                  <p className="text-xs text-muted-foreground">{t.sales} vendas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="text-center space-y-3">
          <Icon3D icon={Shield} color="silver" size="lg" animated />
          <h3 className="font-semibold text-foreground">Sistema seguro e transparente</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Rastreamento automático por 30 dias. Anti-fraude integrado. Pagamento via PIX ou PayPal após aprovação.
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
            Já tem conta? <Link to="/login" className="text-foreground hover:underline">Entrar</Link> e ativar no seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
