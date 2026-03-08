import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is AZERA CLUB?",
    answer: "AZERA CLUB is a platform that combines artificial intelligence, networking and opportunity discovery in one place. It helps ambitious individuals organize, optimize and grow every area of their life."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes, AZERA CLUB offers a Basic plan with essential features including AI assistant, agenda, journal, objectives tracking and more — completely free, no credit card required."
  },
  {
    question: "What does the AI do?",
    answer: "Our AI helps you with strategic planning, goal breakdown, content strategy, skill development, habit building, productivity insights and much more. It acts as your personal strategic advisor."
  },
  {
    question: "What are the differences between plans?",
    answer: "The Basic plan includes core features. The PRO plan adds advanced tools like Skill Growth, Goal Planner, Daily Focus, Content Strategy, Productivity Insights and more. The BUSINESS plan unlocks everything including Investment Radar, Life Simulation, Wealth Strategy, Elite Events and AI Advisor."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We apply industry-standard security practices to safeguard your data. All information is encrypted and stored securely. You can update, export or delete your personal data at any time within your account settings."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. No long-term contracts or hidden fees."
  },
  {
    question: "How does the networking feature work?",
    answer: "AZERA CLUB connects you with like-minded ambitious individuals through curated networking opportunities, elite events and strategic partner matching — all powered by AI."
  },
  {
    question: "Is AZERA CLUB available in multiple languages?",
    answer: "Currently, AZERA CLUB is available in English and Portuguese, with more languages planned for the future."
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
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-bold gold-text">Frequently Asked Questions</h1>
              <p className="text-sm text-muted-foreground">Everything you need to know about AZERA CLUB.</p>
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
              Still have questions?{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
