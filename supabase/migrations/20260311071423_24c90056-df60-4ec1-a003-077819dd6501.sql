CREATE OR REPLACE FUNCTION public.force_site_owner_false_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.is_site_owner := false;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_site_owner_on_insert
  BEFORE INSERT ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.force_site_owner_false_on_insert();