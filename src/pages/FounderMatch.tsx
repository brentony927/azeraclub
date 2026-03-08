import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FounderProfileForm from "@/components/FounderProfileForm";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function FounderMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("founder_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setHasProfile(true);
          navigate("/founder-feed", { replace: true });
        }
        setLoading(false);
      });
  }, [user, navigate]);

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("founder_profiles").insert({
      user_id: user.id,
      name: formData.name,
      age: formData.age,
      country: formData.country,
      skills: formData.skills,
      industry: formData.industry,
      building: formData.building,
      looking_for: formData.looking_for,
      commitment: formData.commitment,
      is_published: true,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao criar perfil", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil publicado! 🚀" });
      navigate("/founder-feed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasProfile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FounderProfileForm onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
