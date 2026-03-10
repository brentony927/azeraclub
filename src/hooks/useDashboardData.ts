import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";

const today = () => format(new Date(), "yyyy-MM-dd");
const weekRange = () => {
  const now = new Date();
  return {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
};

export function useTodayTasks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-today-tasks", user?.id, today()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user!.id)
        .eq("date", today())
        .order("time", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    enabled: !!user,
  });
}

export function useWeekTasks() {
  const { user } = useAuth();
  const { start, end } = weekRange();
  return useQuery({
    queryKey: ["dashboard-week-tasks", user?.id, start],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user!.id)
        .gte("date", start)
        .lte("date", end);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    enabled: !!user,
  });
}

export function useUpcomingEvents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-upcoming-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_events")
        .select("*")
        .eq("user_id", user!.id)
        .gte("date", today())
        .order("date", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    enabled: !!user,
  });
}

export function useDashboardNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("founder_notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    enabled: !!user,
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "done" ? "pending" : "done";
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      return newStatus;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-today-tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard-week-tasks"] });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("founder_notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-notifications"] });
      toast.success("Notificação removida");
    },
  });
}

export function useDeleteAllNotifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("founder_notifications").delete().eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-notifications"] });
      toast.success("Todas as notificações removidas");
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("founder_notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-notifications"] });
    },
  });
}
