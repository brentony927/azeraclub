import { supabase } from "@/integrations/supabase/client";

interface SendNotificationParams {
  user_id: string;
  type?: string;
  title: string;
  body?: string | null;
  action_url?: string | null;
  related_user_id?: string | null;
}

export async function sendNotification(params: SendNotificationParams): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return;

  const res = await supabase.functions.invoke("send-notification", {
    body: params,
  });

  if (res.error) {
    console.error("Failed to send notification:", res.error);
  }
}
