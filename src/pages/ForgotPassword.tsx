import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import azeraLogo from "@/assets/azera-logo.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <img src={azeraLogo} alt="AZERA" className="w-12 h-12 rounded-xl object-contain mx-auto" />
            <h1 className="text-2xl font-serif font-bold gold-text">Recuperar Senha</h1>
            <p className="text-sm text-muted-foreground">
              {sent
                ? "Email enviado! Verifique sua caixa de entrada."
                : "Informe seu email para redefinir a senha."}
            </p>
          </div>

          {!sent && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 gold-gradient text-primary-foreground font-semibold hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
