

## Global Founder Map — Mapa Interativo de Founders

### Resumo
Nova pagina `/global-map` dentro do Founder Alignment com mapa interativo mostrando founders pelo mundo, pins coloridos por plano, cards de perfil ao clicar, filtros avancados e geolocalizacao.

### 1. Database Migration
Adicionar `latitude` e `longitude` na tabela `founder_profiles`:
```sql
ALTER TABLE public.founder_profiles
  ADD COLUMN latitude double precision DEFAULT NULL,
  ADD COLUMN longitude double precision DEFAULT NULL;
```

### 2. Nova Pagina: `src/pages/GlobalFounderMap.tsx`
- Mapa interativo usando **Leaflet** (react-leaflet) — gratuito, sem API key, visual dark mode excelente com tiles CartoDB Dark Matter
- Carrega todos os `founder_profiles` publicados que tenham lat/lng
- Cluster de pins com contagem por regiao (zoom out: "Brazil — 84 founders", zoom in: pins individuais)
- Pins coloridos: branco (Founder), verde (PRO), dourado (BUSINESS)
- Ao clicar pin: popup card com nome, avatar, industry, score, looking_for, botoes View Profile/Connect/Message
- Hover rapido mostra mini-preview
- Contador animado no topo: "X Founders · Y Countries"
- Botao "Find founders near me" usa `navigator.geolocation`
- Filtros na sidebar esquerda (industry, skills, interests, stage, looking_for, score, age) — filtros avancados gated por plano
- BUSINESS founders aparecem primeiro e com pin dourado maior
- Animacoes: pin drop, smooth zoom, skeleton loading, glow nos pins

### 3. Dependencias
- `leaflet` + `react-leaflet` + `@types/leaflet` (biblioteca de mapas gratuita)
- `leaflet.markercluster` para clustering de pins

### 4. Rota e Sidebar
- Adicionar rota `/global-map` no `App.tsx` dentro das rotas protegidas (Founder Alignment)
- Adicionar item "Global Map" com icone `Globe` no `founderItems` do `AppSidebar.tsx`

### 5. Geocoding no Perfil
- Quando founder salva perfil com city/country, usar API gratuita (Nominatim/OpenStreetMap) para obter lat/lng automaticamente
- Atualizar `FounderProfileForm.tsx` e `Profile.tsx` para geocodar ao salvar

### 6. Gating por Plano
| Feature | Founder | PRO | BUSINESS |
|---------|---------|-----|----------|
| Ver mapa | ✅ | ✅ | ✅ |
| Clicar perfis | ✅ | ✅ | ✅ |
| Conectar | ✅ | ✅ | ✅ |
| Filtros avancados | ❌ | ✅ | ✅ |
| Pin dourado/prioridade | ❌ | ❌ | ✅ |
| Find near me | ❌ | ✅ | ✅ |

### Arquivos Afetados
| Arquivo | Mudanca |
|---------|---------|
| DB Migration | Add latitude, longitude to founder_profiles |
| `src/pages/GlobalFounderMap.tsx` | Nova pagina completa |
| `src/App.tsx` | Nova rota /global-map |
| `src/components/AppSidebar.tsx` | Novo item no founderItems |
| `src/components/FounderProfileForm.tsx` | Geocoding ao salvar |
| `src/pages/Profile.tsx` | Geocoding ao salvar |
| `package.json` | leaflet, react-leaflet, leaflet.markercluster |

