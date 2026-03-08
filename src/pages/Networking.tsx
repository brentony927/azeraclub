import { motion } from "framer-motion";
import { ExternalLink, Users, MessageSquare } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const COMMUNITIES = [
  { name: "WhatsApp", link: "#", color: "bg-green-500/10 text-green-400", soon: true },
  { name: "Discord", link: "#", color: "bg-indigo-500/10 text-indigo-400", soon: true },
  { name: "Telegram", link: "#", color: "bg-blue-500/10 text-blue-400", soon: true },
];

export default function Networking() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div variants={item} className="text-center space-y-4">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold">
          <span className="moss-text">NETWORKING AZR</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Conecte-se com membros do ecossistema Azera Club.
        </p>

        {/* Member avatars */}
        <div className="flex justify-center -space-x-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-medium">{String.fromCharCode(65 + i)}</span>
            </div>
          ))}
          <div className="w-9 h-9 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
            <span className="text-xs text-accent font-bold">+50</span>
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div variants={item} className="glass-card p-8 text-center">
        <p className="font-serif text-lg text-foreground/80 italic">
          "Networking real acontece fora da tela."
        </p>
      </motion.div>

      {/* Community Links */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
          Entre na comunidade
        </h2>
        <div className="grid gap-3">
          {COMMUNITIES.map((c) => (
            <div
              key={c.name}
              className="glass-card p-4 flex items-center gap-4 opacity-60 cursor-not-allowed"
            >
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}>
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">AZR Club — Comunidade Privada</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">Em breve</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
