CREATE TABLE public.ai_rate_limits (
  bucket text NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
GRANT ALL ON public.ai_rate_limits TO service_role;
ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ai_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  feature text NOT NULL,
  model text NOT NULL,
  user_id uuid,
  ip_hash text,
  status text NOT NULL DEFAULT 'pending',
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_credits numeric(12,6) NOT NULL DEFAULT 0,
  latency_ms integer,
  error_code text
);
CREATE INDEX ai_usage_log_created_at_idx ON public.ai_usage_log (created_at);
GRANT ALL ON public.ai_usage_log TO service_role;
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- Atomically enforce the app-wide daily spending cap and the per-caller rate limit,
-- then reserve the maximum cost of one call. Returns the reserved log id, or a status word.
CREATE OR REPLACE FUNCTION public.claim_ai_request(
  _feature text, _model text, _bucket text, _user_id uuid, _ip_hash text,
  _limit integer, _window_seconds integer, _daily_cap_credits numeric, _reserve_credits numeric
) RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  spent numeric;
  used integer;
  win timestamptz := to_timestamp(floor(extract(epoch FROM now()) / _window_seconds) * _window_seconds);
  log_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('ai_spending_cap'));
  SELECT coalesce(sum(cost_credits), 0) INTO spent FROM public.ai_usage_log WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  IF spent + _reserve_credits > _daily_cap_credits THEN
    INSERT INTO public.ai_usage_log (feature, model, user_id, ip_hash, status) VALUES (_feature, _model, _user_id, _ip_hash, 'cap_reached');
    RETURN 'cap_reached';
  END IF;
  INSERT INTO public.ai_rate_limits (bucket, window_start, request_count) VALUES (_bucket, win, 1)
    ON CONFLICT (bucket, window_start) DO UPDATE SET request_count = ai_rate_limits.request_count + 1
    RETURNING request_count INTO used;
  IF used > _limit THEN
    INSERT INTO public.ai_usage_log (feature, model, user_id, ip_hash, status) VALUES (_feature, _model, _user_id, _ip_hash, 'rate_limited');
    RETURN 'rate_limited';
  END IF;
  DELETE FROM public.ai_rate_limits WHERE window_start < now() - interval '1 day';
  INSERT INTO public.ai_usage_log (feature, model, user_id, ip_hash, status, cost_credits)
    VALUES (_feature, _model, _user_id, _ip_hash, 'pending', _reserve_credits) RETURNING id INTO log_id;
  RETURN log_id::text;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_ai_request(text, text, text, uuid, text, integer, integer, numeric, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_ai_request(text, text, text, uuid, text, integer, integer, numeric, numeric) TO service_role;