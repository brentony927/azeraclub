interface MatchProfile {
  skills?: string[] | null;
  interests?: string[] | null;
  industry?: string[] | null;
  looking_for?: string[] | null;
  continent?: string | null;
}

function intersection(a: string[], b: string[]): number {
  return a.filter(x => b.includes(x)).length;
}

function union(a: string[], b: string[]): number {
  return new Set([...a, ...b]).size;
}

export function calculateMatchScore(me: MatchProfile, other: MatchProfile): number {
  let score = 0;

  // Interests (35%)
  const myInterests = me.interests ?? [];
  const otherInterests = other.interests ?? [];
  if (myInterests.length > 0 && otherInterests.length > 0) {
    const u = union(myInterests, otherInterests);
    score += u > 0 ? (intersection(myInterests, otherInterests) / u) * 35 : 0;
  }

  // Skills complementary (25%) — if I'm looking for a skill they have
  const myLooking = me.looking_for ?? [];
  const otherSkills = other.skills ?? [];
  if (myLooking.length > 0 && otherSkills.length > 0) {
    const matched = myLooking.filter(l =>
      otherSkills.some(s => s.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(s.toLowerCase()))
    ).length;
    score += (matched / myLooking.length) * 25;
  }

  // Industry (20%)
  const myIndustry = me.industry ?? [];
  const otherIndustry = other.industry ?? [];
  if (myIndustry.length > 0 && otherIndustry.length > 0) {
    const u = union(myIndustry, otherIndustry);
    score += u > 0 ? (intersection(myIndustry, otherIndustry) / u) * 20 : 0;
  }

  // Looking_for compatibility (15%)
  const otherLooking = other.looking_for ?? [];
  const mySkills = me.skills ?? [];
  if (otherLooking.length > 0 && mySkills.length > 0) {
    const matched = otherLooking.filter(l =>
      mySkills.some(s => s.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(s.toLowerCase()))
    ).length;
    score += (matched / otherLooking.length) * 15;
  }

  // Region (5%)
  if (me.continent && other.continent && me.continent === other.continent) {
    score += 5;
  }

  return Math.round(score);
}

export function calculateProfileScore(profile: any): number {
  let score = 0;
  if (profile.name) score += 10;
  if (profile.avatar_url) score += 15;
  if (profile.building) score += 10;
  if (profile.skills?.length > 0) score += 10;
  if (profile.industry?.length > 0) score += 10;
  if (profile.interests?.length >= 3) score += 10;
  if (profile.looking_for?.length > 0) score += 5;
  if (profile.country && profile.city) score += 10;
  if (profile.continent) score += 5;
  if (profile.commitment) score += 5;
  if (profile.is_verified) score += 10;
  return score;
}

export function getMatchColor(score: number): string {
  if (score >= 70) return "text-green-400 bg-green-500/15 border-green-500/30";
  if (score >= 40) return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";
  return "text-muted-foreground bg-secondary border-border/50";
}
