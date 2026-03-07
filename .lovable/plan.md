

## Fix: Page Content Not Clearing When Switching Routes

### Problem
Every protected route creates its **own independent `<Layout>` instance**:
```
<Route path="/ia" element={<ProtectedRoute><Layout><AI /></Layout></ProtectedRoute>} />
<Route path="/agenda" element={<ProtectedRoute><Layout><Agenda /></Layout></ProtectedRoute>} />
```

When navigating from `/ia` to `/agenda`, React unmounts the **entire** old Layout+AI tree and mounts a **new** Layout+Agenda tree. But `AnimatePresence mode="wait"` inside Layout can't work because it only sees one child at a time (it's destroyed with its parent). The old page's exit animation may linger or overlap with the new page, causing the AI interface to remain visible underneath the Agenda.

### Solution
Use a **single shared Layout** via React Router's `<Outlet>` pattern, so there's only one Layout instance and `AnimatePresence` properly tracks children entering/exiting.

### Changes

**1. `src/components/Layout.tsx`**
- Import `Outlet` from `react-router-dom`
- Replace `{children}` with `<Outlet />` inside the `AnimatePresence`/`PageTransition` wrapper
- Remove the `children` prop entirely

**2. `src/components/ProtectedLayout.tsx`** (new file)
- Combines `ProtectedRoute` logic (auth check) + `Layout` into a single wrapper component
- Renders `<Layout />` which internally uses `<Outlet />`

**3. `src/App.tsx`**
- Replace all individual `<ProtectedRoute><Layout><Page /></Layout></ProtectedRoute>` patterns with nested routes:
```tsx
<Route element={<ProtectedLayout />}>
  <Route path="/" element={<Index />} />
  <Route path="/ia" element={<AI />} />
  <Route path="/agenda" element={<Agenda />} />
  ...
</Route>
```
- This ensures a **single Layout** persists across navigations, and `AnimatePresence` properly animates page transitions

**4. `src/components/HomeRoute.tsx`**
- Simplify: no longer needs its own Layout wrapper, just renders `<Index />` or `<Landing />`

**5. `src/components/PageTransition.tsx`**
- No changes needed, already correct

### Result
- One Layout instance shared across all protected routes
- `AnimatePresence mode="wait"` properly unmounts old page before mounting new one
- No more AI interface persisting when switching to Agenda or any other page
- Sidebar, header, footer stay mounted (no re-render flicker on navigation)

