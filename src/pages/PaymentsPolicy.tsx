import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PaymentsPolicy() {
  return (
    <div className="min-h-screen bg-background p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="glass-card p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Política de Pagamentos e Subscrições</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Março 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            O AZERA CLUB oferece planos de subscrição com diferentes níveis de funcionalidades. Esta política descreve as condições de pagamento, cancelamento e reembolso.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Planos e Preços</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A plataforma oferece planos gratuitos e pagos. Os detalhes dos planos, incluindo funcionalidades e preços, estão disponíveis na <Link to="/planos" className="text-primary hover:underline">página de planos</Link>. Os preços podem ser alterados com aviso prévio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. Processamento de Pagamentos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos os pagamentos são processados por provedores externos seguros, como o Stripe. O AZERA CLUB não armazena dados completos de cartão de crédito ou débito nos seus servidores. As transações são protegidas por encriptação de nível bancário.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Cobrança Recorrente</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao contratar um plano pago, o utilizador concorda com a cobrança recorrente (mensal ou anual) até que a subscrição seja cancelada. O valor será debitado automaticamente no método de pagamento registado.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Cancelamento</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os utilizadores podem cancelar a sua subscrição a qualquer momento através das definições da conta. Após o cancelamento, o acesso às funcionalidades premium será mantido até ao final do período já pago.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Reembolsos</h2>
            <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Reembolsos podem não ser oferecidos após a ativação do serviço. Cada caso será analisado individualmente.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Em situações excecionais, pedidos de reembolso podem ser enviados para a nossa equipa de suporte dentro de 7 dias após a cobrança.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6. Alterações de Preço</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O AZERA CLUB reserva-se o direito de alterar os preços dos planos. Os utilizadores com subscrições ativas serão notificados com antecedência e poderão cancelar antes da nova tarifa entrar em vigor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">
              Questões sobre pagamentos podem ser enviadas para: <a href="mailto:billing@azeraclub.com" className="text-primary hover:underline">billing@azeraclub.com</a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
