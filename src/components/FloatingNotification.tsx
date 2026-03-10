import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface FloatingNotif {
  id: string;
  title: string;
  body: string | null;
  type: string;
  action_url: string | null;
}

const TYPE_ROUTES: Record<string, string> = {
  connection: "/founder-feed",
  message: "/founder-messages",
  profile_view: "/founder-feed",
  venture_invite: "/venture-builder",
};

export default function FloatingNotification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<FloatingNotif[]>([]);
  const [current, setCurrent] = useState<FloatingNotif | null>(null);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("floating-notifs")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "founder_notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const n = payload.new as any;
        if (n.type !== "message") {
          setQueue(prev => [...prev, { id: n.id, title: n.title, body: n.body, type: n.type, action_url: n.action_url }]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Show next from queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [current, queue]);

  // Auto-dismiss
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), 5000);
    return () => clearTimeout(t);
  }, [current]);

  const handleClick = () => {
    if (!current) return;
    const route = current.action_url || TYPE_ROUTES[current.type] || "/founder-feed";
    setCurrent(null);
    navigate(route);
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-28 md:bottom-20 left-4 z-50 max-w-xs cursor-pointer"
          onClick={handleClick}
        >
          <div className="bg-card border border-border/60 rounded-xl shadow-lg p-4 flex items-start gap-3 backdrop-blur-xl">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{current.title}</p>
              {current.body && <p className="text-xs text-muted-foreground truncate mt-0.5">{current.body}</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(null); }}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
