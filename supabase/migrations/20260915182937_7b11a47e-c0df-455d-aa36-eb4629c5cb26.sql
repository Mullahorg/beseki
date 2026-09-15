REVOKE ALL ON FUNCTION public.get_staff_members() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_pending_staff() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.add_staff_member(text, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_staff_role(text, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.remove_staff_access(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.log_staff_activity(text, text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_my_staff_role() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_staff_members() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_staff_member(text, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_staff_role(text, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_staff_access(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_staff_activity(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_staff_role() TO authenticated;