

## Plano: Corrigir Tutorial para Aparecer Apenas na Primeira Vez

### Problema
O tutorial usa `localStorage` para controlar se já foi visto. Se o usuário limpar dados do browser, trocar de dispositivo, ou usar modo anônimo, o tutorial aparece novamente.

### Solução
Guardar o estado "tutorial visto" no banco de dados, na tabela `profiles` (ou criar uma flag dedicada), para que persista entre sessões e dispositivos.

### Implementação

1. **Migration SQL**: Adicionar coluna `has_seen_onboarding boolean DEFAULT false` na tabela `profiles`

2. **`src/pages/Index.tsx`**:
   - Substituir a verificação de `localStorage` por uma query ao banco: `supabase.from("profiles").select("has_seen_onboarding").eq("id", user.id).single()`
   - Só mostrar o tutorial se `has_seen_onboarding === false`
   - Manter `localStorage` como cache rápido para evitar flash (verificar localStorage primeiro, depois confirmar com banco)

3. **`src/components/OnboardingTutorial.tsx`**:
   - No `handleFinish`, além do `localStorage`, fazer `supabase.from("profiles").update({ has_seen_onboarding: true }).eq("id", userId)`

### Arquivos
- **Migration SQL**: Adicionar coluna `has_seen_onboarding` a `profiles`
- **Editar**: `src/pages/Index.tsx`, `src/components/OnboardingTutorial.tsx`

