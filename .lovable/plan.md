

## Plano: Atualizar Imagem de Pré-visualização Social (OG Image)

### Problema
A imagem que aparece ao partilhar o link mostra apenas a logo simples "AZERA" num fundo cinza — sem impacto visual. O utilizador quer que apareça a imagem de razão social (image-33.png) com o branding completo "AZERA CLUB" + "FAÇA PARTE".

### Correção

1. **Copiar** `user-uploads://image-33.png` → `public/og-image.png` (substituir o ficheiro atual)

Nenhuma alteração de código necessária — o `index.html` já aponta para `og-image.png`.

> **Nota**: Após publicar, usar o [Facebook Debugger](https://developers.facebook.com/tools/debug/) para limpar o cache das redes sociais.

### Arquivo a substituir
- `public/og-image.png` ← `image-33.png`

