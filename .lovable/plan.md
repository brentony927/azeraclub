

## Sistema Visual PRO (Verde Neon) + BUSINESS (Dourado Luxo)

Atualmente existe um único `.elite-theme` aplicado a ambos PRO e BUSINESS. O plano é separar em dois temas visuais distintos, cada um com sua paleta, orbs, partículas e animação de upgrade.

---

### Arquivos

| Ação | Arquivo |
|------|---------|
| Edit | `src/index.css` — Separar `.elite-theme` em `.pro-theme` + `.business-theme` com paletas distintas |
| Edit | `src/components/Layout.tsx` — Aplicar classe correta por plano (`pro-theme` / `business-theme`) |
| Edit | `src/components/EliteBackground.tsx` — Aceitar prop `plan` e renderizar orbs/partículas verdes ou douradas |
| Edit | `src/components/EliteBadge.tsx` — Cores corretas por plano |
| Edit | `src/components/UpgradeCelebration.tsx` — Partículas e mensagem adaptadas por plano (verde PRO / dourado BUSINESS) |

---

### Detalhes CSS

**PRO Theme (`.pro-theme`)**
- Primary: verde neon `#00FF88` → HSL ~152 100% 50%
- Background: `#0E0E0E` → gradiente sutil para `#0B1A14`
- Cards: `#151515`, border verde translúcido `rgba(0,255,136,0.25)`
- Inputs: border verde, glow verde no focus
- Botões: glow `box-shadow: 0 0 14px rgba(0,255,136,0.45)`
- Orbs: radial-gradient verde neon
- Partículas: verde neon

**BUSINESS Theme (`.business-theme`)**
- Primary: dourado `#FFD700` → HSL ~51 100% 50%
- Background: `#0A0A0A` → gradiente para `#121212`
- Cards: `#161616`, border dourado translúcido `rgba(255,215,0,0.28)`
- Inputs: border dourado, glow dourado no focus
- Botões: glow `box-shadow: 0 0 16px rgba(255,215,0,0.45)`
- Orbs: radial-gradient dourado (mantém o atual com ajustes)
- Partículas: douradas

**Layout.tsx** mudança:
```
const themeClass = plan === "business" ? "business-theme" : plan === "pro" ? "pro-theme" : "";
```

**UpgradeCelebration** — PRO mostra partículas verdes + "PRO Access Activated / Your interface has been upgraded." — BUSINESS mostra partículas douradas + "Business Access Unlocked / Welcome to the elite network."

**EliteBackground** — Recebe `plan` prop, renderiza orbs/partículas com classes `.pro-orb-*` ou `.business-orb-*`.

Sem migrações. Sem novas dependências. Apenas CSS + ajustes de classe.

