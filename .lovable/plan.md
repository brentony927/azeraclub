

## Alternativas para Teste de Resistência do App

### Por que não posso criar 30 contas diretamente

1. Contas precisam ser criadas via `supabase.auth.signUp()` — inserir direto na tabela `profiles` não gera sessões válidas
2. Cada conta precisa de um email real ou confirmado para funcionar
3. Criar contas bot em produção polui o banco de dados real

### O que posso fazer

**Opção A: Teste Manual Guiado**
- Posso navegar pelo app com a sua conta atual (Business) usando o browser automatizado
- Testar cada fluxo: AI, agenda, experiências, viagens, propriedades, saúde, social
- Verificar se todas as funcionalidades Pro e Business funcionam
- Testar responsividade em diferentes tamanhos de tela

**Opção B: Criar uma Página de Teste Interna**
- Criar uma página `/admin/test` protegida que simula operações CRUD em massa
- Testa inserções, leituras e deleções em todas as tabelas
- Mede tempo de resposta de cada operação
- Verifica limites de RLS e permissões

**Opção C: Testes Automatizados com Vitest**
- Criar testes unitários e de integração para os componentes críticos
- Testar renderização de todas as páginas
- Verificar lógica de acesso por tier (free/pro/business)
- Executável com um comando, sem criar contas reais

### Recomendação

A **Opção A** (teste manual pelo browser) é a mais rápida e prática agora. Posso testar todos os fluxos com a sua conta Business que já está logada.

