
-- Drop any stale triggers
DROP TRIGGER IF EXISTS prevent_site_owner_change ON public.founder_profiles;
DROP TRIGGER IF EXISTS force_site_owner_false_on_insert ON public.founder_profiles;
DROP TRIGGER IF EXISTS prevent_verified_change ON public.founder_profiles;

-- Recreate functions with is_verified protection
CREATE OR REPLACE FUNCTION public.prevent_site_owner_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.is_site_owner IS DISTINCT FROM OLD.is_site_owner THEN
    RAISE EXCEPTION 'Cannot modify is_site_owner';
  END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Cannot modify is_verified';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.force_site_owner_false_on_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  NEW.is_site_owner := false;
  NEW.is_verified := false;
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER prevent_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_site_owner_change();

CREATE TRIGGER force_site_owner_false_on_insert
  BEFORE INSERT ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.force_site_owner_false_on_insert();
