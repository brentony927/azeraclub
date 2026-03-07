
-- Experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Outros',
  location TEXT,
  date DATE,
  time TEXT,
  description TEXT,
  image TEXT,
  saved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  country TEXT,
  dates TEXT,
  hotel TEXT,
  transport TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  type TEXT,
  valuation NUMERIC DEFAULT 0,
  monthly_expense NUMERIC DEFAULT 0,
  staff INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social events table
CREATE TABLE public.social_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT,
  date DATE,
  location TEXT,
  attendees INTEGER DEFAULT 0,
  description TEXT,
  rsvp TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Health appointments table
CREATE TABLE public.health_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  specialty TEXT,
  date DATE,
  time TEXT,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'médico',
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for all tables
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_appointments ENABLE ROW LEVEL SECURITY;

-- Experiences policies
CREATE POLICY "Users manage own experiences" ON public.experiences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trips policies
CREATE POLICY "Users manage own trips" ON public.trips FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Users manage own properties" ON public.properties FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Social events policies
CREATE POLICY "Users manage own social events" ON public.social_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Health appointments policies
CREATE POLICY "Users manage own health appointments" ON public.health_appointments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_events_updated_at BEFORE UPDATE ON public.social_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_appointments_updated_at BEFORE UPDATE ON public.health_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
