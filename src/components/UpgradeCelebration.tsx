import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { Check, Crown, Zap } from "lucide-react";

const PLAN_FEATURES: Record<string, string[]> = {
  basic: [
    "AZERA IA (20 mensagens/dia)",
    "Agenda inteligente",
    "Diário inteligente",
    "Cofre de ideias",
    "AZERA Score",
  ],
  pro: [
    "IA ilimitada",
    "Planejamento semanal automático",
    "Radar de oportunidades",
    "Análise de produtividade",
    "Weekly Intelligence Report",
    "Modo foco",
  ],
  business: [
    "Strategic AI ilimitada (CEO Mode)",
    "Tema dourado premium",
    "Radar de networking privado",
    "Life Strategy AI",
    "Relatórios estratégicos mensais",
    "Análise de carreira",
    "Eventos exclusivos",
  ],
};

const PLAN_CONFIG = {
  pro: {
    hue: "152, 100%, 50%",
    hueAlt: "152, 80%, 60%",
    title: "PRO ACCESS ACTIVATED",
    subtitle: "Your interface has been upgraded.",
    icon: Zap,
    duration: 6000,
  },
  business: {
    hue: "51, 100%, 50%",
    hueAlt: "42, 60%, 70%",
    title: "BUSINESS ACCESS UNLOCKED",
    subtitle: "Welcome to the elite network.",
    icon: Crown,
    duration: 8000,
  },
};

export default function UpgradeCelebration() {
  const { showUpgradeCelebration, dismissCelebration, plan } = useSubscription();
  const navigate = useNavigate();
  const features = PLAN_FEATURES[plan] || [];
  const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.business;
  const Icon = config.icon;

  useEffect(() => {
    if (!showUpgradeCelebration) return;
    const timer = setTimeout(dismissCelebration, config.duration);
    return () => clearTimeout(timer);
  }, [showUpgradeCelebration, dismissCelebration, config.duration]);

  return (
    <AnimatePresence>
      {showUpgradeCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[hsl(0,0%,4%)]/95" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800), y: (typeof window !== "undefined" ? window.innerHeight : 600) + 20, opacity: 0, scale: 0 }}
                animate={{ y: -20, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.5] }}
                transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 1.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${config.hue})`,
                  boxShadow: `0 0 6px hsl(${config.hue})`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative z-10 text-center max-w-md mx-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(${config.hue}), hsl(${config.hueAlt}))`,
                boxShadow: `0 0 60px hsl(${config.hue} / 0.4)`,
              }}
            >
              <Icon className="h-10 w-10 text-[hsl(0,0%,4%)]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, hsl(${config.hue}), hsl(${config.hueAlt}))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {config.title}
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-[hsl(0,0%,70%)] text-sm mb-8">
              {config.subtitle}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="space-y-2 mb-8 text-left max-w-xs mx-auto">
              {features.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.1 }} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0" style={{ color: `hsl(${config.hue})` }} />
                  <span className="text-sm text-[hsl(0,0%,90%)]">{f}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => { dismissCelebration(); navigate("/dashboard"); }}
              className="px-8 py-3 rounded-full font-semibold text-sm text-[hsl(0,0%,4%)] transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, hsl(${config.hue}), hsl(${config.hueAlt}))`,
                boxShadow: `0 0 30px hsl(${config.hue} / 0.3)`,
              }}
            >
              Começar a Explorar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
