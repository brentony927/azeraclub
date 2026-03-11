export interface ProfileBackground {
  key: string;
  name: string;
  type: "solid" | "gradient" | "animated" | "metallic";
  minScore: number;
  css: string; // inline CSS background value
  animation?: string; // CSS class name for animated ones
}

export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  // === Tier 1: Score 0-10 (6 basics) ===
  { key: "slate-mist", name: "Névoa Cinza", type: "gradient", minScore: 0, css: "linear-gradient(135deg, hsl(220 10% 20%), hsl(220 10% 35%))" },
  { key: "ocean-calm", name: "Oceano Calmo", type: "gradient", minScore: 0, css: "linear-gradient(135deg, hsl(210 45% 18%), hsl(210 55% 30%))" },
  { key: "forest-dusk", name: "Floresta", type: "gradient", minScore: 3, css: "linear-gradient(135deg, hsl(150 30% 15%), hsl(160 35% 25%))" },
  { key: "deep-violet", name: "Violeta Profundo", type: "gradient", minScore: 5, css: "linear-gradient(135deg, hsl(270 30% 18%), hsl(280 35% 28%))" },
  { key: "amber-glow", name: "Âmbar", type: "gradient", minScore: 8, css: "linear-gradient(135deg, hsl(30 40% 18%), hsl(35 50% 28%))" },
  { key: "teal-depth", name: "Teal Profundo", type: "gradient", minScore: 10, css: "linear-gradient(135deg, hsl(185 40% 15%), hsl(190 50% 25%))" },

  // === Tier 2: Score 11-25 (6 dual gradients) ===
  { key: "midnight-blue", name: "Meia-Noite Azul", type: "gradient", minScore: 12, css: "linear-gradient(135deg, hsl(220 50% 12%), hsl(240 40% 22%), hsl(220 50% 12%))" },
  { key: "emerald-night", name: "Esmeralda Noturna", type: "gradient", minScore: 15, css: "linear-gradient(135deg, hsl(160 40% 12%), hsl(140 50% 22%), hsl(170 40% 15%))" },
  { key: "purple-haze", name: "Névoa Roxa", type: "gradient", minScore: 17, css: "linear-gradient(135deg, hsl(270 40% 15%), hsl(290 35% 25%), hsl(260 45% 18%))" },
  { key: "golden-hour", name: "Hora Dourada", type: "gradient", minScore: 20, css: "linear-gradient(135deg, hsl(35 50% 15%), hsl(45 60% 25%), hsl(30 45% 18%))" },
  { key: "frost-blue", name: "Gelo Azul", type: "gradient", minScore: 22, css: "linear-gradient(135deg, hsl(200 30% 20%), hsl(210 50% 35%), hsl(195 35% 22%))" },
  { key: "warm-dusk", name: "Crepúsculo", type: "gradient", minScore: 25, css: "linear-gradient(135deg, hsl(280 25% 18%), hsl(330 30% 22%), hsl(30 35% 20%))" },

  // === Tier 3: Score 26-40 (6 animated shifting) ===
  { key: "aurora-shift", name: "Aurora Boreal", type: "animated", minScore: 26, css: "linear-gradient(135deg, hsl(170 50% 15%), hsl(200 60% 20%), hsl(260 40% 22%), hsl(170 50% 15%)", animation: "bg-profile-shift" },
  { key: "ocean-wave", name: "Onda Oceânica", type: "animated", minScore: 28, css: "linear-gradient(135deg, hsl(200 50% 15%), hsl(220 60% 25%), hsl(190 45% 18%), hsl(200 50% 15%)", animation: "bg-profile-shift" },
  { key: "cosmic-purple", name: "Cósmico Roxo", type: "animated", minScore: 30, css: "linear-gradient(135deg, hsl(260 40% 12%), hsl(280 50% 22%), hsl(300 35% 18%), hsl(260 40% 12%)", animation: "bg-profile-shift" },
  { key: "green-pulse", name: "Pulso Verde", type: "animated", minScore: 33, css: "linear-gradient(135deg, hsl(140 40% 12%), hsl(160 50% 20%), hsl(180 40% 15%), hsl(140 40% 12%)", animation: "bg-profile-pulse" },
  { key: "sunset-flow", name: "Fluxo Solar", type: "animated", minScore: 36, css: "linear-gradient(135deg, hsl(30 50% 15%), hsl(50 60% 22%), hsl(35 45% 18%), hsl(30 50% 15%)", animation: "bg-profile-shift" },
  { key: "teal-aurora", name: "Aurora Teal", type: "animated", minScore: 40, css: "linear-gradient(135deg, hsl(175 50% 12%), hsl(195 60% 20%), hsl(210 45% 18%), hsl(175 50% 12%)", animation: "bg-profile-aurora" },

  // === Tier 4: Score 41-60 (6 metallic) ===
  { key: "metallic-silver", name: "Prata Metálico", type: "metallic", minScore: 42, css: "linear-gradient(135deg, hsl(0 0% 18%), hsl(0 0% 30%), hsl(0 0% 40%), hsl(0 0% 30%), hsl(0 0% 18%))", animation: "bg-profile-shimmer" },
  { key: "metallic-bronze", name: "Bronze Metálico", type: "metallic", minScore: 45, css: "linear-gradient(135deg, hsl(30 30% 18%), hsl(25 40% 28%), hsl(30 50% 35%), hsl(25 40% 28%), hsl(30 30% 18%))", animation: "bg-profile-shimmer" },
  { key: "metallic-gold", name: "Ouro Metálico", type: "metallic", minScore: 50, css: "linear-gradient(135deg, hsl(42 40% 18%), hsl(38 55% 28%), hsl(45 60% 35%), hsl(38 55% 28%), hsl(42 40% 18%))", animation: "bg-profile-shimmer" },
  { key: "metallic-emerald", name: "Esmeralda Metálico", type: "metallic", minScore: 53, css: "linear-gradient(135deg, hsl(150 35% 14%), hsl(155 50% 22%), hsl(160 55% 30%), hsl(155 50% 22%), hsl(150 35% 14%))", animation: "bg-profile-shimmer" },
  { key: "metallic-sapphire", name: "Safira Metálico", type: "metallic", minScore: 56, css: "linear-gradient(135deg, hsl(220 40% 14%), hsl(225 55% 22%), hsl(230 60% 30%), hsl(225 55% 22%), hsl(220 40% 14%))", animation: "bg-profile-shimmer" },
  { key: "metallic-amethyst", name: "Ametista Metálico", type: "metallic", minScore: 60, css: "linear-gradient(135deg, hsl(275 35% 14%), hsl(280 50% 22%), hsl(285 55% 30%), hsl(280 50% 22%), hsl(275 35% 14%))", animation: "bg-profile-shimmer" },

  // === Tier 5: Score 61-80 (4 premium animated) ===
  { key: "aurora-premium", name: "Aurora Premium", type: "animated", minScore: 65, css: "linear-gradient(135deg, hsl(170 60% 10%), hsl(200 70% 18%), hsl(260 50% 20%), hsl(300 40% 18%), hsl(170 60% 10%)", animation: "bg-profile-aurora" },
  { key: "neon-wave", name: "Onda Neon", type: "animated", minScore: 70, css: "linear-gradient(135deg, hsl(180 60% 12%), hsl(220 70% 20%), hsl(260 60% 18%), hsl(180 60% 12%)", animation: "bg-profile-shift" },
  { key: "galaxy-deep", name: "Galáxia", type: "animated", minScore: 75, css: "linear-gradient(135deg, hsl(240 40% 8%), hsl(260 50% 15%), hsl(280 45% 12%), hsl(300 35% 10%), hsl(240 40% 8%)", animation: "bg-profile-aurora" },
  { key: "cyber-grid", name: "Cyber", type: "animated", minScore: 80, css: "linear-gradient(135deg, hsl(180 50% 8%), hsl(200 60% 15%), hsl(220 50% 12%), hsl(180 50% 8%)", animation: "bg-profile-shift" },

  // === Tier 6: Score 81-100 (2 ultra-premium) ===
  { key: "diamond-shimmer", name: "Diamante", type: "metallic", minScore: 85, css: "linear-gradient(135deg, hsl(200 20% 15%), hsl(210 30% 25%), hsl(0 0% 40%), hsl(210 30% 25%), hsl(200 20% 15%))", animation: "bg-profile-shimmer" },
  { key: "platinum-pulse", name: "Platina", type: "metallic", minScore: 95, css: "linear-gradient(135deg, hsl(0 0% 12%), hsl(220 15% 22%), hsl(0 0% 35%), hsl(220 15% 22%), hsl(0 0% 12%))", animation: "bg-profile-pulse" },
];

export const OWNER_BACKGROUND_KEY = "owner-metallic-exclusive";
