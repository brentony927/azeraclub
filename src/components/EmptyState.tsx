import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 text-center space-y-4"
    >
      <div className="text-5xl mx-auto">{icon}</div>
      <h3 className="text-lg font-serif font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      <Button onClick={onAction} className="gold-gradient text-primary-foreground border-0">
        <Plus className="h-4 w-4 mr-2" />
        {actionLabel}
      </Button>
    </motion.div>
  );
}
