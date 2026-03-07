
Objetivo: corrigir de forma definitiva o fluxo de login/cadastro para evitar o estado “não funciona” quando o e-mail já foi criado via Google/Apple e o usuário tenta entrar por senha.

1) Diagnóstico validado (com evidências)
- O frontend está chamando os endpoints corretos.
- Nos logs/rede:
  - `POST /auth/v1/signup` retorna `422 user_already_exists` para `brentonybss2025@gmail.com`.
  - `POST /auth/v1/token?grant_type=password` retorna `400 invalid_credentials`.
  - `GET /auth/v1/user` mostra identidade `provider: google` (sem fluxo explícito de senha configurada para esse e-mail).
- Conclusão prática: o problema principal é mistura de método de acesso (conta social existente + tentativa de login por senha), não falha de roteamento.

2) Implementação planejada (código)
A) `src/pages/Login.tsx`
- Tratar `invalid_credentials` com mensagem guiada (PT-BR), em vez de erro bruto.
- Adicionar ação imediata no erro:
  - botão/ação “Entrar com Google/Apple”.
  - botão/ação “Receber link para criar/redefinir senha” (chamando `resetPasswordForEmail` com `redirectTo` correto).
- Normalizar input de e-mail (`trim().toLowerCase()`) antes de autenticar.

B) `src/pages/Signup.tsx`
- Tratar `user_already_exists` de forma inteligente:
  - mostrar aviso claro: “Este e-mail já possui conta, possivelmente via Google/Apple”.
  - oferecer CTA de login social.
  - enviar link de recuperação/criação de senha como fallback.
- Ajustar mensagem de sucesso:
  - se vier sessão, redirecionar direto para `/`.
  - se não vier sessão, orientar corretamente sem mensagem contraditória.

C) `src/pages/ForgotPassword.tsx` e `src/pages/ResetPassword.tsx`
- Melhorar textos e estados de sucesso/erro para reduzir confusão.
- Garantir que o reset aceite corretamente o fluxo de recuperação e não “expulse” usuário indevidamente.

D) Validação de configuração de autenticação (backend)
- Confirmar que cadastro por e-mail está habilitado.
- Confirmar auto-confirmação de e-mail ativa (como combinado) para evitar bloqueio pós-cadastro.

3) Arquivos que serão alterados
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/pages/ResetPassword.tsx`
- (configuração de autenticação no backend, sem nova migration de tabela)

4) Plano de validação (fim-a-fim)
- Cenário 1: novo e-mail (nunca usado) → cadastrar → entrar com senha.
- Cenário 2: e-mail já existente via Google → tentar cadastro por senha → receber orientação + CTA social + link de senha.
- Cenário 3: e-mail existente + senha errada → mensagem amigável + recuperação.
- Cenário 4: recuperação de senha completa (`/forgot-password` → `/reset-password` → login com nova senha).
- Cenário 5: login social Google/Apple continua funcionando sem regressão.

5) Resultado esperado
- O usuário sempre terá um caminho claro para entrar (senha, social ou recuperação), sem ficar preso em “invalid credentials/user already exists” sem orientação.
- Redução drástica de suporte para “login/cadastro não funciona”.
