## Pacote Legal Completo — AZERA CLUB

Reescrever as 3 páginas legais existentes com conteúdo completo e criar 3 novas páginas, além de atualizar o footer, landing, login/signup com links e checkbox de aceitação.

### Páginas a criar/reescrever


| Ação    | Arquivo                             | Conteúdo                                                                                                                                                                                                                            |
| ------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rewrite | `src/pages/TermsOfService.tsx`      | Termos completos: natureza da plataforma, responsabilidade do usuário, interações, disclaimer de negócios, atividades fora da plataforma, limitação de responsabilidade, propriedade intelectual, suspensão, modificação, aceitação |
| Rewrite | `src/pages/PrivacyPolicy.tsx`       | Política completa: dados coletados, finalidade, LGPD/GDPR, serviços terceiros, controle do usuário, segurança, cookies                                                                                                              |
| Create  | `src/pages/CommunityGuidelines.tsx` | Diretrizes: condutas proibidas (golpes, spam, identidade falsa, esquemas), conteúdos proibidos, sistema de denúncia, suspensão                                                                                                      |
| Create  | `src/pages/PaymentsPolicy.tsx`      | Pagamentos: planos, provedores (Stripe), cancelamento, reembolsos, dados de cartão                                                                                                                                                  |
| Create  | `src/pages/SecurityPolicy.tsx`      | Segurança: medidas, limitações, responsabilidade do usuário, "as is"                                                                                                                                                                |
| Rewrite | `src/pages/CookiePolicy.tsx`        | Expandir com mais detalhes                                                                                                                                                                                                          |


### Outras alterações


| Ação | Arquivo                     | O quê                                                                                                            |
| ---- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Edit | `src/App.tsx`               | Adicionar rotas `/community-guidelines`, `/payments-policy`, `/security-policy`                                  |
| Edit | `src/components/Footer.tsx` | Adicionar links legais: Termos, Privacidade, Diretrizes, Pagamentos, Segurança, Cookies                          |
| Edit | `src/pages/Landing.tsx`     | Adicionar links para as novas páginas na seção de footer links                                                   |
| Edit | `src/pages/Signup.tsx`      | Adicionar checkbox obrigatório "Aceito os Termos de Uso e Política de Privacidade" antes do botão de criar conta |
| Edit | `src/pages/Login.tsx`       | Adicionar links para termos nas páginas de login (já existem, apenas adicionar os novos)                         |


### Estrutura do Footer

Duas linhas de links:

- Linha 1 (navegação): Início, FAQ, Contacto
- Linha 2 (legal): Termos de Uso, Privacidade, Diretrizes, Pagamentos, Segurança, Cookies

### Checkbox no Signup

```
☐ Aceito os Termos de Uso e a Política de Privacidade
```

Botão "Criar Conta" fica desabilitado até o checkbox ser marcado.

### Conteúdo das páginas

Todas seguem o mesmo layout visual (glass-card, font-serif headings, motion animation). O conteúdo será em Português Brasileiro formal, cobrindo todos os 15 pontos do plano legal fornecido, distribuídos pelas 6 páginas conforme a estrutura temática.

**EXEMPLO**

- Termos de Uso
- Política de Privacidade
- Política de Pagamentos
- Diretrizes da Comunidade
- Disclaimer de Negócios
- Limitação de Responsabilidade
- Política de Conteúdo
- Política de Segurança
- Avisos dentro do app

Tudo focado em **evitar processo de usuário mal-intencionado**.

---

# PLANO LEGAL COMPLETO — AZERA CLUB

## Estrutura recomendada no site

No rodapé do site devem existir páginas separadas:

```
Terms of Use
Privacy Policy
Community Guidelines
Payments & Subscriptions
Disclaimer
Security Policy
```

---

# 1 — TERMS OF USE (TERMOS DE USO)

## 1.1 Natureza da plataforma

O AZERA CLUB é uma plataforma digital destinada a facilitar:

- networking profissional
- descoberta de oportunidades
- compartilhamento de ideias
- conexão entre empreendedores

A plataforma **não é responsável por negociações entre usuários**.

---

## 1.2 Responsabilidade do usuário

O usuário é responsável por:

- informações publicadas
- interações com outros usuários
- decisões de negócios tomadas

Todas as decisões tomadas dentro ou fora da plataforma são **de responsabilidade exclusiva do usuário**.

---

## 1.3 Interações entre usuários

O AZERA CLUB não atua como:

- intermediador financeiro
- consultor de investimentos
- consultor jurídico
- agente de negociação

A plataforma apenas fornece ferramentas de conexão.

---

# 2 — DISCLAIMER DE NEGÓCIOS

Deve existir uma seção clara dizendo:

```
AZERA CLUB does not verify, guarantee or endorse any business opportunity posted by users.
```

Também deve dizer:

```
Users must independently verify any opportunity or partnership before engaging in business.
```

Isso é **extremamente importante** para apps de networking.

---

# 3 — ATIVIDADES FORA DA PLATAFORMA

Cláusula essencial.

```
AZERA CLUB is not responsible for any interactions, agreements, transactions, meetings or partnerships that occur outside the platform.
```

Inclui:

- reuniões
- investimentos
- transferências financeiras
- contratos
- negócios presenciais

Tudo fora do app **não é responsabilidade da empresa**.

---

# 4 — LIMITAÇÃO DE RESPONSABILIDADE

Deve deixar claro que a empresa não responde por:

- perdas financeiras
- fraudes entre usuários
- decisões de investimento
- falhas em projetos ou startups
- conflitos entre usuários

Exemplo de cláusula:

```
The platform is provided "as is" without guarantees of success, profit or business outcomes.
```

---

# 5 — COMMUNITY GUIDELINES (DIRETRIZES)

Usuários não podem:

- aplicar golpes
- enviar spam
- publicar conteúdo enganoso
- usar identidade falsa
- promover esquemas ilegais

Conteúdos proibidos:

- fraude financeira
- esquemas piramidais
- phishing
- atividades ilegais

O AZERA CLUB pode **remover ou suspender contas** que violem essas regras.

---

# 6 — POLÍTICA DE PRIVACIDADE

Explica como os dados são usados.

Dados coletados:

- nome
- email
- perfil profissional
- interesses
- atividade na plataforma

Finalidade:

- melhorar recomendações
- permitir conexões
- melhorar experiência do usuário

---

## Proteção de dados

O AZERA CLUB deve informar que segue boas práticas de proteção de dados, inspiradas em regulações como:

- General Data Protection Regulation
- Lei Geral de Proteção de Dados

---

# 7 — PAGAMENTOS E ASSINATURAS

A plataforma pode oferecer planos pagos.

Ao contratar um plano o usuário concorda com:

- valor da assinatura
- periodicidade da cobrança
- política de cancelamento

Pagamentos são processados por provedores externos como:

- Stripe
- PayPal

O AZERA CLUB **não armazena dados completos de cartão**.

---

# 8 — CANCELAMENTO

Usuários podem cancelar assinaturas a qualquer momento.

Dependendo da política do plano:

- reembolsos podem não ser oferecidos após ativação do serviço

Essa regra deve estar clara.

---

# 9 — PROPRIEDADE INTELECTUAL

Todo conteúdo da plataforma pertence ao AZERA CLUB:

- marca
- design
- software
- interface
- código

Usuários não podem copiar ou redistribuir sem autorização.

---

# 10 — SUSPENSÃO DE CONTAS

A empresa pode suspender ou encerrar contas que:

- violem os termos
- pratiquem fraude
- prejudiquem outros usuários
- utilizem a plataforma para spam

Sem aviso prévio se necessário.

---

# 11 — SEGURANÇA

A plataforma utiliza medidas de segurança para proteger dados.

Mesmo assim deve informar:

```
No digital platform can guarantee absolute security.
```

Usuários usam a plataforma **por sua própria conta e risco**.

---

# 12 — MODIFICAÇÃO DOS TERMOS

O AZERA CLUB pode atualizar os termos a qualquer momento.

Usuários serão notificados em caso de mudanças significativas.

Continuar usando o serviço significa aceitar as alterações.

---

# 13 — ACEITAÇÃO DOS TERMOS

Antes de criar conta o usuário deve aceitar:

```
I agree to the Terms of Use and Privacy Policy
```

Com checkbox obrigatório.

---

# 14 — AVISOS IMPORTANTES DENTRO DO APP

Recomendado colocar avisos visíveis.

### Aviso em oportunidades

```
Opportunities posted by users are not verified by AZERA CLUB.
Always perform your own due diligence.
```

---

### Aviso em mensagens

```
Be cautious when sharing personal or financial information with other users.
```

---

### Aviso em perfis

```
AZERA CLUB does not guarantee the accuracy of user profiles.
```

---

# 15 — SISTEMA DE DENÚNCIA

Todo perfil deve ter botão:

```
Report User
```

Motivos:

- fraud
- spam
- fake profile
- abusive behavior

---

# RESULTADO FINAL

Com esse pacote legal o AZERA CLUB fica protegido contra processos relacionados a:

- golpes entre usuários
- negócios que deram errado
- promessas de lucro
- transações fora da plataforma
- fraudes entre membros