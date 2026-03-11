CREATE TRIGGER prevent_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_site_owner_change();