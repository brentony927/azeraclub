

# Correções de Lógica — 3 Problemas

## 1. Botão "Conversar" no painel de afiliados não abre o chat direto

**Problema**: O `AffiliateManagerPanel` navega com `navigate(\`/founder-messages?user=\${aff.user_id}\`)` mas o `FounderMessages` só lê `location.state`, não `searchParams`. O utilizador é redirecionado para a página de mensagens mas nenhuma conversa é selecionada.

**Correção**: Alterar o `navigate` no `AffiliateManagerPanel` para usar `state` em vez de query params:
```ts
navigate("/founder-messages", { state: { userId: aff.user_id, userName: aff.name } })
```

| Ficheiro | Alteração |
|---|---|
| `src/components/AffiliateManagerPanel.tsx` | Mudar `navigate` do botão "Conversar" para usar `state` |

## 2. Pesquisa de founders já funciona por nome

A pesquisa na linha 279 do `FounderFeed.tsx` já filtra por `p.name.toLowerCase().includes(search)` e por `p.username`. **Não há bug aqui** — a pesquisa por nome já funciona. Se o utilizador não encontra alguém, é porque o perfil não está publicado (`is_published = false`).

Nenhuma alteração necessária.

## 3. Seção de Programa de Afiliados no perfil do utilizador não é colapsável

**Problema**: O `AffiliateSection` renderiza cards fixos sem opção de expandir/recolher.

**Correção**: Envolver o conteúdo do `AffiliateSection` num `Collapsible`, similar ao `AffiliateManagerPanel`. Adicionar um header clicável "Programa de Afiliados" com chevron que expande/recolhe todo o conteúdo.

| Ficheiro | Alteração |
|---|---|
| `src/components/AffiliateSection.tsx` | Envolver em `Collapsible` com trigger no topo |

## Resumo

| Problema | Ficheiro | Tipo |
|---|---|---|
| Chat não abre direto | `AffiliateManagerPanel.tsx` | 1 linha |
| Pesquisa por nome | Já funciona | Nenhum |
| Afiliado colapsável | `AffiliateSection.tsx` | Wrapping em Collapsible |

