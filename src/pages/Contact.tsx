import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

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

        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          {/* Info card */}
          <div className="glass-card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-2 rounded-xl bg-primary/10 w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold gold-text">Contacte-nos</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tem uma pergunta, sugestão ou proposta de parceria? Adoraríamos ouvir de você.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Envie-nos um email</p>
              <a
                href="mailto:support@azeraclub.com"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-lg"
              >
                <Mail className="h-5 w-5" />
                support@azeraclub.com
              </a>
            </div>
          </div>

          {/* Form card */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help?" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <Button type="submit" className="w-full moss-gradient text-primary-foreground btn-premium" disabled={sending}>
                {sending ? "Sending..." : (<>Send Message <Send className="ml-2 h-4 w-4" /></>)}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
