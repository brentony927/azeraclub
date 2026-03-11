
-- Drop if exists to avoid conflicts
DROP TRIGGER IF EXISTS validate_venture_member_status ON public.venture_members;

-- Create validation function
CREATE OR REPLACE FUNCTION public.validate_venture_member_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  -- Only venture owner can change status from rejected
  IF OLD.status = 'rejected' AND NEW.status != 'rejected' THEN
    IF NOT is_venture_owner(auth.uid(), OLD.venture_id) THEN
      RAISE EXCEPTION 'Cannot change status from rejected';
    END IF;
  END IF;
  -- Only venture owner can accept from non-pending state
  IF NEW.status = 'accepted' AND OLD.status != 'pending' THEN
    IF NOT is_venture_owner(auth.uid(), OLD.venture_id) THEN
      RAISE EXCEPTION 'Only venture owner can accept from this state';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER validate_venture_member_status
  BEFORE UPDATE ON public.venture_members
  FOR EACH ROW EXECUTE FUNCTION public.validate_venture_member_status();
