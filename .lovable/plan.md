

## Plano: Corrigir Imagem de Pré-visualização Social (OG Image)

### Problema
A `og:image` no `index.html` aponta para um URL externo do Google Cloud Storage que mostra uma imagem genérica/quebrada quando o link é partilhado no WhatsApp, Instagram, LinkedIn, etc.

### Correção

1. **Copiar a logo** `src/assets/azera-logo-black.png` para `public/og-image.png` — para que fique acessível como URL pública estática.

2. **Atualizar `index.html`** — substituir os URLs da `og:image` e `twitter:image` para apontar para o domínio publicado:
   ```html
   <meta property="og:image" content="https://azeraclub.lovable.app/og-image.png">
   <meta name="twitter:image" content="https://azeraclub.lovable.app/og-image.png">
   ```

3. **Adicionar `og:url`** para garantir que crawlers associem corretamente:
   ```html
   <meta property="og:url" content="https://azeraclub.lovable.app">
   ```

> **Nota**: A logo preta sobre fundo branco é ideal para partilha social (boa visibilidade). Se preferir uma imagem com fundo colorido/premium, posso gerar uma depois. Redes sociais podem demorar a atualizar o cache — ferramentas como o [Facebook Debugger](https://developers.facebook.com/tools/debug/) ajudam a forçar a atualização.

### Arquivos a editar
- `public/og-image.png` — copiar logo
- `index.html` — atualizar meta tags

