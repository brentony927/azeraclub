

# Painel de Aprovação de Afiliados no Perfil do Dono

## Resumo
Criar um painel exclusivo no perfil do dono que exibe todas as solicitações de afiliação pendentes, permitindo aprovar ou recusar diretamente sem precisar de painel externo.

## Alterações

### 1. `src/components/AffiliateRequestsPanel.tsx` — Novo componente
Painel que aparece apenas para o dono (`isOwner`), mostrando:
- Lista de `affiliate_requests` com status `pending` (busca com service role via edge function)
- Cada card mostra: nome, redes sociais, audiência, estratégia, data de solicitação
- Botões "Aprovar" e "Recusar" que chamam a edge function `approve-affiliate` existente
- Badge com contagem de pendentes no header

O dono não consegue ver `affiliate_requests` de outros usuários pela RLS (política `user_id = auth.uid()`). Duas opções:
- **Opção A**: Criar uma edge function `list-affiliate-requests` que usa service role para buscar pendentes (mais seguro)
- **Opção B**: Adicionar política SELECT para site owners via `is_site_owner(auth.uid())`

Vou usar a **Opção B** (política RLS) por ser mais simples — adicionar uma política SELECT permissiva para site owners.

### 2. Migração SQL — Política SELECT para dono ver requests
```sql
CREATE POLICY "Site owner can view all affiliate requests"
ON public.affiliate_requests FOR SELECT TO authenticated
USING (public.is_site_owner(auth.uid()));
```

### 3. `src/pages/Profile.tsx` — Integrar o painel
- Importar `AffiliateRequestsPanel`
- Renderizar antes do `AffiliateSection`, apenas quando `isOwner === true`

### 4. Notificação automática ao dono
Quando um usuário submete uma solicitação (`AffiliateSection.handleApply`), inserir uma notificação para o dono. Precisa buscar o `user_id` do dono — pode fazer via edge function ou inserir a notificação server-side.

Melhor abordagem: adicionar insert de notificação diretamente no `handleApply` do `AffiliateSection` buscando o dono via `founder_profiles.is_site_owner`.

| Ficheiro | Ação |
|---|---|
| SQL Migration | Adicionar política SELECT para site owners em `affiliate_requests` |
| `src/components/AffiliateRequestsPanel.tsx` | Criar — painel de aprovação/rejeição |
| `src/pages/Profile.tsx` | Integrar painel quando isOwner |
| `src/components/AffiliateSection.tsx` | Enviar notificação ao dono ao solicitar |

