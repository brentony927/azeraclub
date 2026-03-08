import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é a AZERA CLUB?",
    answer: "A AZERA CLUB é uma plataforma que combina inteligência artificial, networking e descoberta de oportunidades num único lugar. Ajuda pessoas ambiciosas a organizar, otimizar e fazer crescer todas as áreas da sua vida."
  },
  {
    question: "Existe um plano gratuito?",
    answer: "Sim, a AZERA CLUB oferece um plano Basic com funcionalidades essenciais, incluindo assistente de IA, agenda, diário, acompanhamento de objetivos e muito mais — totalmente gratuito, sem necessidade de cartão de crédito."
  },
  {
    question: "O que faz a Inteligência Artificial?",
    answer: "A nossa IA ajuda com planeamento estratégico, decomposição de metas, estratégia de conteúdo, desenvolvimento de competências, construção de hábitos, insights de produtividade e muito mais. Funciona como o seu consultor estratégico pessoal."
  },
  {
    question: "Quais são as diferenças entre os planos?",
    answer: "O plano Basic inclui as funcionalidades essenciais. O plano PRO adiciona ferramentas avançadas como Crescimento de Competências, Plano de Metas, Foco Diário, Estratégia de Conteúdo, Insights de Produtividade e muito mais. O plano BUSINESS desbloqueia tudo, incluindo Radar de Investimentos, Simulação de Vida, Estratégia Financeira, Eventos Exclusivos e Consultor de IA."
  },
  {
    question: "Os meus dados estão seguros?",
    answer: "Absolutamente. Aplicamos práticas de segurança de nível empresarial para proteger os seus dados. Todas as informações são encriptadas e armazenadas de forma segura. Pode atualizar, exportar ou eliminar os seus dados pessoais a qualquer momento nas definições da conta."
  },
  {
    question: "Posso cancelar a minha subscrição?",
    answer: "Sim, pode cancelar a sua subscrição a qualquer momento. O seu acesso continua até ao final do período de faturação atual. Sem contratos de longa duração nem taxas ocultas."
  },
  {
    question: "Como funciona o networking?",
    answer: "A AZERA CLUB conecta-o com pessoas ambiciosas através de oportunidades de networking curadas, eventos exclusivos e matching de parceiros estratégicos — tudo potenciado por IA."
  },
  {
    question: "A AZERA CLUB está disponível em vários idiomas?",
    answer: "Atualmente, a AZERA CLUB está disponível em Português e Inglês, com mais idiomas planeados para o futuro."
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-bold gold-text">Perguntas Frequentes</h1>
              <p className="text-sm text-muted-foreground">Tudo o que precisa de saber sobre a AZERA CLUB.</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border/40 rounded-lg px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Ainda tem dúvidas?{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Fale connosco
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
