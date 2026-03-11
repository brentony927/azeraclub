

# Perfil Dono Desbloqueado + Emojis → 3D + Fundo com Foto/Vídeo (25+ Insígnias)

## 3 Tarefas Principais

### 1. Perfil do dono com tudo desbloqueado (fundos)
O `BadgeShowcase` já desbloqueia todas as insígnias para o dono (`isSiteOwner`). Falta aplicar a mesma lógica no `ProfileBackgroundPicker` — quando `is_site_owner = true`, todos os 30 fundos ficam desbloqueados independentemente do Founder Score.

**Ficheiro**: `src/components/ProfileBackgroundPicker.tsx`
- Adicionar prop `isOwner?: boolean`
- Se `isOwner`, ignorar `minScore` e desbloquear tudo

**Ficheiro**: `src/pages/Profile.tsx`
- Passar `isOwner={isOwner}` ao `ProfileBackgroundPicker`

### 2. Substituir todos os emojis por Icon3D animados
Ficheiros com emojis a substituir:

| Ficheiro | Emojis | Substituição |
|---|---|---|
| `src/lib/founderScore.ts` | 🤝🚀🎯👑 | Importar ícones Lucide correspondentes (`HandshakeIcon`, `Rocket`, `Target`, `Crown`) e renderizar como `ReactNode` via `Icon3D` |
| `src/pages/Journal.tsx` | 😊😐🤔😴😰 + 💡 | Substituir por Icon3D com ícones semânticos (`Smile`, `Minus`, `Brain`, `Moon`, `AlertTriangle`) e `Lightbulb` |
| `src/pages/Objectives.tsx` | 💰💼🏃🌱📚 | Substituir por Icon3D (`Wallet`, `Briefcase`, `Heart`, `Sprout`, `BookOpen`) |
| `src/components/EarlyBirdBanner.tsx` | 🚀 | Substituir por Icon3D `Rocket` inline |
| `src/pages/DailyFocus.tsx` | 💡 (dentro de prompt AI) | Manter no prompt (é texto enviado à IA, não UI) |
| `src/pages/WeeklyOpportunityReport.tsx` | Emojis em prompt AI | Manter (texto de prompt, não UI visível) |
| `src/pages/FounderProfile.tsx` | 📋 (toast) | Substituir texto do toast |
| `src/components/FounderPostCard.tsx` | 📋 (toast) | Substituir texto do toast |

O `SCORE_BADGES` em `founderScore.ts` atualmente usa `icon: string` (emojis). Alterar para `icon: LucideIcon` e renderizar com `Icon3D` onde são consumidos (em `FounderProfile.tsx`).

### 3. Fundo com foto/vídeo para quem tem 25+ insígnias
Adicionar ao `ProfileBackgroundPicker` uma secção "Fundo Personalizado" que aparece quando o utilizador tem 25+ insígnias desbloqueadas (ou é dono).

**Ficheiro**: `src/components/ProfileBackgroundPicker.tsx`
- Nova prop `earnedBadgesCount: number`
- Se `earnedBadgesCount >= 25` ou `isOwner`: mostrar opção de upload de imagem ou vídeo (loop)
- Upload vai para um novo bucket `profile-bg-media` (público)
- Guardar URL no campo `active_background` com prefixo `custom:` (ex: `custom:https://...url`)

**Ficheiro**: `src/components/ProfileBackgroundRenderer.tsx`
- Detectar `backgroundKey` com prefixo `custom:`
- Se for imagem (jpg/png/webp): renderizar `<img>` absolutamente posicionada
- Se for vídeo (mp4/webm): renderizar `<video autoPlay muted loop playsInline>` absolutamente posicionado

**Migração SQL**: Criar bucket `profile-bg-media` com RLS para upload pelo próprio utilizador.

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-bg-media', 'profile-bg-media', true);

CREATE POLICY "Users upload own bg media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-bg-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read bg media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-bg-media');

CREATE POLICY "Users delete own bg media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-bg-media' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Ficheiro**: `src/pages/Profile.tsx`
- Buscar contagem de insígnias do utilizador e passar como prop `earnedBadgesCount`

## Ficheiros a modificar

| Ficheiro | Ação |
|---|---|
| SQL Migration | Criar bucket `profile-bg-media` |
| `src/lib/founderScore.ts` | Emojis → LucideIcon refs |
| `src/pages/Journal.tsx` | Emojis → Icon3D |
| `src/pages/Objectives.tsx` | Emojis → Icon3D |
| `src/components/EarlyBirdBanner.tsx` | Emoji → Icon3D |
| `src/pages/FounderProfile.tsx` | Consumir Icon3D no SCORE_BADGES rendering |
| `src/components/ProfileBackgroundPicker.tsx` | + isOwner unlock all, + custom media upload (25+ badges) |
| `src/components/ProfileBackgroundRenderer.tsx` | + custom image/video rendering |
| `src/pages/Profile.tsx` | Pass isOwner + earnedBadgesCount props |

