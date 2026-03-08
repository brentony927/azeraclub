

## Inverter suspensao: reativar Mensal, suspender Semanal

### Alteracao

**`src/components/ui/pricing-section.tsx`**, linha 37-41: Mover o `disabled: true` do "Mensal" para o "Semanal".

```typescript
const periods = [
  { key: "weekly", label: "Semanal", disabled: true },
  { key: "monthly", label: "Mensal" },
  { key: "yearly", label: "Anual" },
];
```

Tambem mudar o `selected` default de `"monthly"` para garantir que o estado inicial funcione (verificar se o useState ja esta em "monthly" -- se sim, esta correto).

Uma unica alteracao em um unico arquivo.

