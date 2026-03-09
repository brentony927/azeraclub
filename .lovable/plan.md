

# Substituir Card de IA por Founder Alignment na Landing

## Alteração

Substituir o primeiro card "Planeamento com IA" (com weekPlan) por um card sobre **Founder Alignment** — alinhamento de founders, possíveis sócios, networking estratégico.

### `src/pages/Landing.tsx`

**Dados**: Substituir `weekPlan` por dados de founder matching:
```ts
const founderMatches = [
  { name: "Match de Sócios", desc: "Encontre co-fundadores com skills complementares" },
  { name: "Score de Compatibilidade", desc: "Algoritmo inteligente de alinhamento" },
  { name: "Networking Global", desc: "Founders de 6 continentes conectados" },
  { name: "Venture Builder", desc: "Construa startups em equipa" },
  { name: "Oportunidades", desc: "Publique e descubra parcerias estratégicas" },
];
```

**Card UI**: Trocar o conteúdo do primeiro card:
- Header: ícone `Users` + "Founder Alignment"
- Pergunta: "Encontre o sócio ideal para o seu projeto."
- Resposta: label "AZERA MATCH" + título "O seu ecossistema de founders:" + lista dos founderMatches
- Remover import `MessageSquare` se não usado noutro lado

