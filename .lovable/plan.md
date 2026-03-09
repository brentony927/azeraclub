
## Problema Identificado
Na imagem apresentada, vejo que a sidebar tem problemas de contraste no tema escuro - o background está muito claro, tornando o texto difícil de ler, especialmente na seção "ALINHAMENTO DE FOUNDERS".

## Solução: Botão de Tema na Sidebar

### 1. **Localização do Botão**
- Adicionar ThemeToggle no `SidebarHeader` (linhas 284-299 do AppSidebar.tsx)
- Posicionamento: lado direito quando expandida, centrado quando colapsada
- Manter funcionalidade tanto no estado expandido quanto ícone-only

### 2. **Design Compacto**
- Criar uma versão menor e mais discreta do ThemeToggle
- Tamanho menor (h-6 w-6 em vez de h-10 w-10)
- Estilo que se harmonize com a identidade visual da sidebar
- Ícones Sun/Moon menores (h-3 w-3 em vez de h-4 w-4)

### 3. **Modificações Necessárias**

**src/components/AppSidebar.tsx:**
- Importar `ThemeToggle` component
- Modificar estrutura do `SidebarHeader` para incluir flexbox justify-between
- Adicionar lógica condicional para mostrar o tema toggle baseado no estado collapsed
- Posicionar o botão adequadamente tanto no modo expandido quanto colapsado

**src/components/ThemeToggle.tsx:**
- Criar nova variante `compact` ou nova prop `size="sm"`
- Ou criar um `SidebarThemeToggle` component específico
- Manter a mesma funcionalidade mas com visual adaptado para sidebar

### 4. **Estados de Renderização**
- **Sidebar Expandida**: Logo + título à esquerda, ThemeToggle à direita
- **Sidebar Colapsada**: Logo centralizado com ThemeToggle logo abaixo ou ao lado
- Garantir que não quebre o layout existente

### 5. **Benefícios**
- Solução imediata para o problema de contraste
- Controle direto do usuário sobre o tema na área problemática  
- Não requer reengenharia complexa dos estilos CSS
- Melhora a UX permitindo troca de tema sem sair da sidebar

### 6. **Layout Detalhado**
```
[Logo] AZERA CLUB + badges    [🌙/☀️]  <- Expandido
   [Logo]                              <- Colapsado  
   [🌙/☀️]
```

### 7. **Considerações**
- Manter o ThemeToggle do header principal também (redundância é OK)
- Testar comportamento responsivo 
- Verificar se não interfere com a seção "ALINHAMENTO DE FOUNDERS" dourada
- Garantir acessibilidade (sr-only labels, focus states)
