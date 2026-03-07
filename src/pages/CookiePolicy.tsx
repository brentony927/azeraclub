import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Cookie Policy</h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">AZERA ELITE uses cookies and similar technologies to enhance the user experience.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">How We Use Cookies</h2>
            <p className="text-sm text-muted-foreground">Cookies help us:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Remember user preferences</li>
              <li>Improve platform performance</li>
              <li>Analyse platform usage</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Managing Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Users can control or disable cookies through browser settings. Some platform features may not function properly without cookies.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
