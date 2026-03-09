import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FounderProfileForm from "@/components/FounderProfileForm";
import FounderOnboarding from "@/components/FounderOnboarding";
import FounderParticlesBackground from "@/components/FounderParticlesBackground";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function FounderMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;
    const seen = localStorage.getItem(`founder-onboarding-${user.id}`);
    if (!seen) setShowOnboarding(true);

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


  const handleOnboardingComplete = () => {
    if (user) localStorage.setItem(`founder-onboarding-${user.id}`, "true");
    setShowOnboarding(false);
  };

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("founder_profiles").insert({
      user_id: user.id,
      name: formData.name,
      username: formData.username,
      age: formData.age,
      country: formData.country,
      city: formData.city,
      continent: formData.continent,
      skills: formData.skills,
      industry: formData.industry,
      building: formData.building,
      looking_for: formData.looking_for,
      commitment: formData.commitment,
      interests: formData.interests,
      avatar_url: formData.avatar_url || null,
      is_published: true,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao criar perfil", description: error.message, variant: "destructive" });
    } else {
      setShowConfetti(true);
      toast({ title: "Perfil publicado! 🚀" });
      setTimeout(() => navigate("/founder-feed"), 2000);
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
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <FounderParticlesBackground />
      {showOnboarding && <FounderOnboarding onComplete={handleOnboardingComplete} />}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none founder-confetti" onAnimationEnd={() => setShowConfetti(false)} />
      )}
      <FounderProfileForm onSubmit={handleSubmit} loading={saving} userId={user?.id} />
    </div>
  );
}
