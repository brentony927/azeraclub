

## Plano: Perfil de Dono (Owner) com Tema Vermelho Brilhante

### Abordagem
Adicionar um campo `is_site_owner` na tabela `founder_profiles` para identificar o dono do site. Usar esse flag para aplicar estilos vermelhos exagerados no perfil, mensagens e badges.

### Mudanças

**1. Migração de Base de Dados**
- Adicionar coluna `is_site_owner` (boolean, default false) à tabela `founder_profiles`
- Definir `true` para o user com email `brentonybss2025@gmail.com` via subquery em `auth.users`

**2. `src/index.css` — Estilos Owner**
- Classe `.owner-profile-wrapper` com border vermelho brilhante, box-shadow vermelho com glow, background com tint vermelho
- Classe `.owner-badge` com animação de pulso vermelho brilhante
- Classe `.owner-message` para mensagens vermelhas com glow
- Classe `.owner-card` para card vermelho no feed
- Keyframe `owner-glow` com pulso de sombra vermelha

**3. `src/pages/FounderProfile.tsx` — Perfil Vermelho**
- Ler `is_site_owner` do profile
- Se owner: envolver toda a página num wrapper com classe `.owner-profile-wrapper`
- Trocar ring do avatar para vermelho brilhante com glow
- Badge "DONO · AZERA" em vermelho brilhante ao lado do nome
- Cards com border vermelho, accent vermelho em todo o layout

**4. `src/components/FounderChat.tsx` — Mensagens Vermelhas**
- Receber prop `isOwner` (ou verificar via user_id)
- Quando `otherUserId` é o owner, as mensagens RECEBIDAS dele ficam com fundo vermelho brilhante
- Quando o user logado é o owner, as mensagens ENVIADAS ficam com fundo vermelho

**5. `src/components/GroupChat.tsx` — Mensagens de Grupo Vermelhas**
- Verificar se o `user_id` da mensagem é o owner
- Aplicar classe `.owner-message` nas mensagens do owner

**6. `src/components/FounderCard.tsx` — Badge no Feed**
- Receber prop `isSiteOwner`
- Mostrar badge vermelho "OWNER" no card do feed

**7. Páginas que listam founders (FounderMatch, FounderFeed, etc.)**
- Passar `is_site_owner` do profile data para os cards

### Ficheiros a editar
- Migração SQL (nova)
- `src/index.css`
- `src/pages/FounderProfile.tsx`
- `src/components/FounderChat.tsx`
- `src/components/GroupChat.tsx`
- `src/components/FounderCard.tsx`

