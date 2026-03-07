import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useExperiences() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["experiences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTrips() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useProperties() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useSocialEvents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["social_events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useHealthAppointments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["health_appointments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_appointments")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAddExperience() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { title: string; category: string; location?: string; date?: string; time?: string; description?: string; image?: string }) => {
      const { error } = await supabase.from("experiences").insert({ ...data, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["experiences"] }); toast.success("Experiência adicionada!"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddTrip() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { destination: string; country?: string; dates?: string; hotel?: string; transport?: string; status?: string; image?: string }) => {
      const { error } = await supabase.from("trips").insert({ ...data, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["trips"] }); toast.success("Viagem adicionada!"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddProperty() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { name: string; city?: string; country?: string; type?: string; valuation?: number; monthly_expense?: number; staff?: number; image?: string }) => {
      const { error } = await supabase.from("properties").insert({ ...data, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["properties"] }); toast.success("Propriedade adicionada!"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddSocialEvent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { title: string; type?: string; date?: string; location?: string; attendees?: number; description?: string; rsvp?: string }) => {
      const { error } = await supabase.from("social_events").insert({ ...data, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_events"] }); toast.success("Evento adicionado!"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddHealthAppointment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { provider: string; specialty?: string; date?: string; time?: string; location?: string; type?: string; contact?: string }) => {
      const { error } = await supabase.from("health_appointments").insert({ ...data, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["health_appointments"] }); toast.success("Consulta adicionada!"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSocialEventRsvp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rsvp }: { id: string; rsvp: string }) => {
      const { error } = await supabase.from("social_events").update({ rsvp }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social_events"] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleExperienceSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      const { error } = await supabase.from("experiences").update({ saved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiences"] }),
    onError: (e: Error) => toast.error(e.message),
  });
}
