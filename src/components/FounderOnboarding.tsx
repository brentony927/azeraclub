import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Rocket, Briefcase } from "lucide-react";

const SLIDES = [
  {
    icon: Users,
    title: "Encontre fundadores ambiciosos",
    description: "Conecte-se com empreendedores que compartilham sua visão e complementam suas habilidades.",
  },
  {
    icon: Rocket,
    title: "Construa projetos juntos",
    description: "Encontre co-fundadores, desenvolvedores e parceiros para transformar ideias em realidade.",
  },
  {
    icon: Briefcase,
    title: "Descubra novas oportunidades",
    description: "Acesse oportunidades exclusivas, investidores e colaborações estratégicas.",
  },
];

interface FounderOnboardingProps {
  onComplete: () => void;
}

export default function FounderOnboarding({ onComplete }: FounderOnboardingProps) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-2xl max-w-md w-full p-8 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const slide = SLIDES[step];
              const Icon = slide.icon;
              return (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{slide.title}</h2>
                  <p className="text-sm text-muted-foreground mb-8">{slide.description}</p>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Button
          className="w-full"
          onClick={() => {
            if (step < SLIDES.length - 1) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
        >
          {step < SLIDES.length - 1 ? "Próximo" : "Começar a Explorar"}
        </Button>
      </motion.div>
    </div>
  );
}
