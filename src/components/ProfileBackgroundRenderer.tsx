import { PROFILE_BACKGROUNDS, OWNER_BACKGROUND_KEY } from "@/lib/profileBackgrounds";

interface Props {
  backgroundKey: string | null;
  isOwner?: boolean;
}

export default function ProfileBackgroundRenderer({ backgroundKey, isOwner }: Props) {
  if (isOwner) {
    return (
      <div className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 owner-metallic-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>
    );
  }

  if (!backgroundKey || backgroundKey === "none") return null;

  const bg = PROFILE_BACKGROUNDS.find(b => b.key === backgroundKey);
  if (!bg) return null;

  return (
    <div className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
      <div
        className={`absolute inset-0 opacity-50 ${bg.animation || ""}`}
        style={{
          background: bg.css,
          backgroundSize: bg.animation ? "400% 400%" : undefined,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
    </div>
  );
}
