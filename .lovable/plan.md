

## Melhorar Apresentação do Conteúdo Gerado por IA

O conteúdo gerado pela IA aparece como texto corrido sem estrutura visual clara. A solução envolve duas frentes: melhorar os **prompts do sistema** para gerar conteúdo mais estruturado, e criar um **componente de renderização premium** com estilos visuais destacados.

---

### 1. Criar componente `AIArticleRenderer`

Novo componente `src/components/AIArticleRenderer.tsx` que substitui o bloco `<ReactMarkdown>` em todas as páginas. Ele:

- Usa `react-markdown` com **custom renderers** para `h2`, `h3`, `blockquote`, `hr`, `ul`, `ol`, `strong`, `a`, `table`
- Cada `h2` recebe um ícone decorativo (borda lateral colorida ou emoji)
- Blockquotes estilizados como "cards de destaque" com fundo accent
- Links renderizados como badges clicáveis com ícone externo
- Separadores (`---`) visuais com gradiente
- Tabelas com estilo alternado (zebra)
- Seção de fontes no final com estilo de referência bibliográfica
- Footer automático com timestamp "Gerado por AZERA AI"

### 2. Melhorar os system prompts de TODAS as 15+ páginas AI

Adicionar instruções estruturais uniformes a todos os prompts. Exemplo do padrão:

```
Estruture a resposta com:
- **Título principal** (# em markdown)
- **Seções temáticas** com subtítulos claros (## e ###)
- **Destaques importantes** em blockquotes (>)
- **Dados e métricas** em tabelas quando aplicável
- **Fontes e referências** no final, indicando de onde a informação foi extraída
- Use separadores (---) entre seções principais
- Use **negrito** para termos-chave e *itálico* para conceitos
```

Cada página recebe uma versão adaptada ao seu contexto (investimentos inclui tabela de risco/retorno, parceiros inclui perfil em cards, etc.)

### 3. CSS global para prose em `src/index.css`

Adicionar estilos customizados para a classe `.ai-article`:
- `h2` com borda lateral dourada/accent e padding
- `blockquote` com fundo glass, borda e ícone
- `table` com zebra striping e borda arredondada
- `hr` com gradiente sutil
- Links com estilo de badge
- Listas com ícones customizados

### 4. Aplicar `AIArticleRenderer` em todas as páginas

Substituir o bloco repetido:
```tsx
<article className="glass-card p-8 sm:p-10">
  <div className="prose prose-lg ...">
    <ReactMarkdown>{result}</ReactMarkdown>
  </div>
</article>
```
Por:
```tsx
<AIArticleRenderer content={result} />
```

### Páginas afetadas (15 arquivos)
`SkillGrowth`, `GoalBreakdown`, `DailyFocus`, `ContentStrategy`, `ProductivityInsights`, `WeeklyReview`, `InvestmentRadar`, `LifeSimulation`, `WealthPlanner`, `EliteEvents` (se tiver AI), `StrategicPartners`, `InvestorMatch`, `EliteLibrary`, `AIAdvisor`, `LifeMasterPlan`, `TrendsRadar`, `OpportunityRadar`, `KnowledgeLibrary`

