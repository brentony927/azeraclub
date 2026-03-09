import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, CalendarDays, Brain, Users, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SLIDES = [
  {
    icon: Rocket,
    title: "Bem-vindo à AZERA",
    description: "A plataforma que organiza sua vida, potencializa sua mente e conecta você a oportunidades reais.",
    highlight: false,
  },
  {
    icon: CalendarDays,
    title: "Organize sua vida",
    description: "Agenda, Diário, Objetivos e Desafios — tudo num só lugar para manter o foco no que importa.",
    highlight: false,
  },
  {
    icon: Brain,
    title: "IA Pessoal",
    description: "Sua assistente inteligente que aprende com você, sugere insights e te ajuda a tomar melhores decisões.",
    highlight: false,
  },
  {
    icon: Users,
    title: "Founder Alignment",
    description: "Encontre co-founders, forme equipas, construa startups e acesse uma rede global de empreendedores ambiciosos.",
    highlight: true,
  },
  {
    icon: Sparkles,
    title: "Comece agora",
    description: "Explore todas as funcionalidades e transforme suas ideias em realidade. O futuro começa aqui.",
    highlight: false,
  },
];

interface OnboardingTutorialProps {
  userId: string;
  onComplete: () => void;
}

export default function OnboardingTutorial({ userId, onComplete }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0);

  const handleFinish = () => {
    localStorage.setItem(`onboarding-tutorial-${userId}`, "true");
    onComplete();
  };

  const slide = SLIDES[step];
  const Icon = slide.icon;
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-card border rounded-2xl max-w-md w-full p-8 text-center transition-colors duration-500 ${
          slide.highlight
            ? "border-[hsl(42_70%_50%_/_0.3)] shadow-[0_0_20px_hsl(42_70%_50%_/_0.1)]"
            : "border-border/50"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 transition-colors duration-500 ${
                slide.highlight
                  ? "bg-[hsl(42_70%_50%_/_0.15)]"
                  : "bg-primary/10"
              }`}
            >
              <Icon
                className={`h-8 w-8 transition-colors duration-500 ${
                  slide.highlight ? "text-[hsl(42_70%_50%)]" : "text-primary"
                }`}
              />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{slide.title}</h2>
            <p className="text-sm text-muted-foreground mb-8">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? slide.highlight
                    ? "bg-[hsl(42_70%_50%)] w-6"
                    : "bg-primary w-6"
                  : "bg-muted-foreground/30 w-2"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          )}
          <Button
            className={`flex-1 ${
              slide.highlight
                ? "bg-[hsl(42_70%_50%)] hover:bg-[hsl(42_70%_45%)] text-black"
                : ""
            }`}
            onClick={() => {
              if (isLast) {
                handleFinish();
              } else {
                setStep(step + 1);
              }
            }}
          >
            {isLast ? "Começar a Explorar" : "Próximo"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
