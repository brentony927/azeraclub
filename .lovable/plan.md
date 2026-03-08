

## Plano: Definir conta como Elite

Você está correto que a tabela `user_plans` está no backend e **não** pode ser alterada pelo usuário no frontend — apenas via `service_role` (admin). O frontend só consegue **ler** o próprio plano.

### O que fazer

Inserir um registro na tabela `user_plans` para o usuário `brentonybss2025@gmail.com` com plano `elite`:

```sql
INSERT INTO public.user_plans (user_id, plan)
VALUES ('1fedca26-41a0-44ce-adbc-ab8e2e9bb5bc', 'elite');
```

Isso é uma operação de dados (INSERT), não uma mudança de schema. O `check-subscription` já prioriza esta tabela sobre o Stripe, então o plano Elite será reconhecido imediatamente.

### Resultado
- A conta terá acesso Elite em todo o app
- Nenhum arquivo de código precisa ser alterado

