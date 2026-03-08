

## Plan: 20 New Features (10 Pro + 10 Business)

### Architecture Overview

Most features follow 2 patterns already in the codebase:
- **AI Page**: Input → call `azera-ai` edge function → stream markdown result (like `TrendsRadar.tsx`)
- **CRUD Page**: Form → save to Supabase table → list items (like `Challenges.tsx`, `IdeasVault.tsx`)

Each feature = 1 new page file, 1 route in `App.tsx`, 1 sidebar entry in `AppSidebar.tsx`, wrapped in `<FeatureLock>`.

### Database Migrations Needed

```sql
-- Habits table (Habit Builder)
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  frequency text DEFAULT 'daily',
  streak integer DEFAULT 0,
  last_checked date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Projects table (Project Organizer)
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  ai_structure text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Project tasks
CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own project tasks" ON public.project_tasks FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Skill plans (Skill Growth Planner)
CREATE TABLE public.skill_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  plan_content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.skill_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own skill plans" ON public.skill_plans FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Goal breakdowns
CREATE TABLE public.goal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal text NOT NULL,
  breakdown text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.goal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goal plans" ON public.goal_plans FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Elite events (Private Networking Events)
CREATE TABLE public.elite_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date,
  location text,
  category text DEFAULT 'networking',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.elite_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view events" ON public.elite_events FOR SELECT TO authenticated USING (true);

-- Event invitations
CREATE TABLE public.event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.elite_events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invitations" ON public.event_invitations FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Saved insights (Elite Knowledge Library)
CREATE TABLE public.saved_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'business',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.saved_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own insights" ON public.saved_insights FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Opportunity alerts preferences
CREATE TABLE public.opportunity_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  industries text[] DEFAULT '{}',
  active boolean DEFAULT true,
  last_alert_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.opportunity_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON public.opportunity_alerts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

### New Page Files (20 pages)

All pages follow the same patterns already used. Each wraps content in `<FeatureLock minTier="pro"|"business">`.

**PRO Pages** (all in `src/pages/`):

| # | File | Route | Pattern | Notes |
|---|------|-------|---------|-------|
| 1 | `SkillGrowth.tsx` | `/skill-growth` | AI + save to `skill_plans` | Input skill → AI generates weekly plan → save |
| 2 | `GoalBreakdown.tsx` | `/goal-planner` | AI + save to `goal_plans` | Input goal → AI breaks into milestones/tasks |
| 3 | `DailyFocus.tsx` | `/daily-focus` | AI reads `tasks` table | Analyzes today's tasks → shows top 3 priorities |
| 4 | `ContentStrategy.tsx` | `/content-strategy` | AI only | Input audience → generates 10 content ideas → save to `ideas` table |
| 5 | `ProductivityInsights.tsx` | `/productivity` | Charts + AI | Shows recharts (tasks done, goals, challenges) + AI advice |
| 6 | `HabitBuilder.tsx` | `/habits` | CRUD `habits` table | Create habits, daily check-in, streak tracking |
| 7 | Enhance existing `IdeasVault.tsx` | `/ideias` | Add "Expand with AI" button | Calls AI to develop an existing idea |
| 8 | Enhance existing `TrendsRadar.tsx` | `/radar-tendencias` | Already exists | Add "Explore Opportunity" button per trend |
| 9 | `ProjectOrganizer.tsx` | `/projects` | CRUD + AI | Create project + tasks, AI structures them |
| 10 | `WeeklyReview.tsx` | `/weekly-review` | AI reads week data | Analyzes tasks/goals/challenges completed this week |

**BUSINESS Pages**:

| # | File | Route | Pattern | Notes |
|---|------|-------|---------|-------|
| 1 | `InvestmentRadar.tsx` | `/investments` | AI | Scan opportunities → AI analyzes risk/potential |
| 2 | `LifeSimulation.tsx` | `/life-simulation` | AI | Input scenario → AI generates future scenarios |
| 3 | `WealthPlanner.tsx` | `/wealth-strategy` | AI | Input financial goals → AI creates wealth plan |
| 4 | `EliteEvents.tsx` | `/elite-events` | CRUD `elite_events` | List events, request invitation |
| 5 | `StrategicPartners.tsx` | `/strategic-partners` | AI | Input industry/stage → AI suggests partner profiles |
| 6 | `InvestorMatch.tsx` | `/investor-match` | AI | Input startup profile → AI matches investors |
| 7 | `EliteLibrary.tsx` | `/elite-library` | AI + save `saved_insights` | Categories → AI generates deep content → save insights |
| 8 | `OpportunityAlerts.tsx` | `/opportunity-alerts` | CRUD `opportunity_alerts` + AI | Configure industries → on-demand AI scan |
| 9 | `AIAdvisor.tsx` | `/ai-advisor` | AI chat | Strategic question → deep AI analysis |
| 10 | `LifeMasterPlan.tsx` | `/life-master-plan` | AI | Input 1/5/10yr goals → AI creates master strategy |

### Sidebar Updates (`AppSidebar.tsx`)

Add 2 new groups with icons:

```text
PRO
├── Skill Growth    (GraduationCap)
├── Goal Planner    (Target → already used, use Crosshair)
├── Daily Focus     (Focus)
├── Content Strategy(PenTool)
├── Produtividade   (BarChart3)
├── Habits          (Repeat)
├── Projects        (FolderKanban)
├── Weekly Review   (CalendarCheck)

BUSINESS
├── Investments     (TrendingUp → use PiggyBank)
├── Life Simulation (Globe)
├── Wealth Strategy (DollarSign)
├── Elite Events    (Crown)
├── Partners        (Users)
├── Investor Match  (Handshake → use Link)
├── Elite Library   (BookMarked)
├── Alerts          (Bell)
├── AI Advisor      (BrainCircuit)
├── Life Master Plan(Map)
```

Existing "Ferramentas" and "Radares" groups remain. New groups: "Pro" and "Business" with lock icons for users without access.

### Routing (`App.tsx`)

Add 18 new `<Route>` entries inside `<ProtectedLayout>` (2 features enhance existing pages).

### Implementation Order

Due to the scale, I'll implement in batches:
1. **Batch 1**: DB migrations (all tables at once)
2. **Batch 2**: PRO pages 1-5 + sidebar/routing updates
3. **Batch 3**: PRO pages 6-10 (including enhancements to IdeasVault and TrendsRadar)
4. **Batch 4**: BUSINESS pages 1-5
5. **Batch 5**: BUSINESS pages 6-10

Each AI-powered page reuses the same streaming pattern from `TrendsRadar.tsx`. Each CRUD page follows `Challenges.tsx` pattern.

