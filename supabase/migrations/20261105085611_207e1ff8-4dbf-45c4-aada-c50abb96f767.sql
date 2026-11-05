REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_interest_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.owns_finder_card(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_finder_card(uuid) TO authenticated;