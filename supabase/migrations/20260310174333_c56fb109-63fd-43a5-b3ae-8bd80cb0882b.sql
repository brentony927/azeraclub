CREATE OR REPLACE FUNCTION public.prevent_site_owner_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_site_owner IS DISTINCT FROM OLD.is_site_owner THEN
    RAISE EXCEPTION 'Cannot modify is_site_owner';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_site_owner_change();