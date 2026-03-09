` response.

1. **Objetivo**: Permitir que o usuário alterne o tema **exclusivamente na sidebar**, independentemente do tema do resto do aplicativo (Header/Páginas). O padrão inicial será seguir o tema global.
2. **Alterações em `src/components/AppSidebar.tsx`**:
    *   Remover a dependência do `ThemeToggle` global que altera todo o app.
    *   Criar um estado local `sidebarTheme` ("system", "light", "dark") salvo no `localStorage` (como `azera-sidebar-theme`).
    *   Calcular o `effectiveTheme` baseando-se no `useTheme` (tema global do app) quando o modo for "system".
    *   Adicionar um botão de alternância customizado na sidebar (Sun/Moon) que controla apenas o estado local.
    *   Injetar o atributo `data-sidebar-theme={effectiveTheme}` no componente raiz da `<Sidebar>`.
3. **Alterações em `src/index.css`**:
    *   Criar blocos de variáveis de cor específicos para `[data-sidebar-theme="light"]` e `[data-sidebar-theme="dark"]` que sobrescrevem as variáveis raiz de cores (`--sidebar-background`, `--muted`, `--secondary`, etc.).
    *   Ajustar as regras CSS dos itens de navegação (como `.dark .sidebar-nav-item`) para usarem `[data-sidebar-theme="dark"] .sidebar-nav-item` ao invés de dependerem do `.dark` do HTML, garantindo isolamento total.

Is that complete and concise? Yes.

Let me verify `[data-sidebar-theme="dark"] .sidebar-nav-item` vs `.dark .sidebar-nav-item` in `src/index.css`.
Currently it says:
```css
/* Dark mode refinements */
.dark .sidebar-nav-item {
  color: hsl(0 0% 75%);
}
```
We need to change `.dark .sidebar-nav-item` to `.dark .sidebar-nav-item, [data-sidebar-theme="dark"] .sidebar-nav-item`. Wait, if `html` is `.dark`, and sidebar is `[data-sidebar-theme="light"]`, `.dark .sidebar-nav-item` will still trigger!
So we should change it entirely to:
```css
/* Sidebar nav items based on explicit sidebar theme attribute */
[data-sidebar-theme="dark"] .sidebar-nav-item {
  color: hsl(0 0% 75%);
}
[data-sidebar-theme="dark"] .sidebar-nav-item:hover {
  color: hsl(0 0% 95%);
  background: hsl(var(--secondary) / 0.5);
}
[data-sidebar-theme="dark"] .sidebar-nav-item-active {
  color: hsl(0 0% 95%);
  background: hsl(var(--primary) / 0.18);
}
```
Wait, if `html` doesn't have `.dark`, and sidebar doesn't have `data-sidebar-theme="dark"`, what triggers the dark styles initially?
If the user's preference is "system" and the app is dark, the `AppSidebar.tsx` will inject `data-sidebar-theme="dark"` into the sidebar component!
Because `effectiveTheme === "dark"` -> `<Sidebar data-sidebar-theme="dark">`.
So we can completely replace the `.dark .sidebar-nav-item` with `[data-sidebar-theme="dark"] .sidebar-nav-item` and it will work perfectly!

Yes, this isolates the CSS logic perfectly and prevents bleed-through from the global `.dark` class.

One tiny detail: What if someone uses the `ThemeToggle` in the app header to switch the app to light?
The app becomes light (`theme === "light"`). The `AppSidebar` sees `sidebarTheme === "system"`, calculates `effectiveTheme === "light"`, and updates `data-sidebar-theme="light"`. The sidebar becomes light too!
If the user clicked the sidebar toggle previously, `sidebarTheme` became `"dark"`. The global toggle changes app to light. Sidebar stays dark because `sidebarTheme` is `"dark"`. This is exactly the requested behavior.

I'm ready to write the plan.
Plan is concise, in Portuguese as requested by user context, focused strictly on what to build and how.
No `lov-tool-use`, no text outside `<lov-plan>`.
The plan must end the response completely.
Done.
Wait, I will add feature suggestions via `<lov-actions>` at the end inside `<lov-plan>`?
Wait, the instructions say:
"Add these suggestions as `presentation-suggestion` actions in the `presentation-actions` block at the very end of your response."
But the instructions also say:
"**CRITICAL - BREAKS UI**: After `