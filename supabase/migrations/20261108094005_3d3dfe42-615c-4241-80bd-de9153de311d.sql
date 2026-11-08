ALTER TABLE public.team_listings ADD COLUMN search_vector tsvector;
CREATE FUNCTION public.refresh_listing_search() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.search_vector := setweight(to_tsvector('english', coalesce(NEW.event_name,'')), 'A') || setweight(to_tsvector('english', coalesce(NEW.description,'')), 'B') || setweight(to_tsvector('english', array_to_string(NEW.skills_needed,' ')), 'A'); RETURN NEW; END $$;
CREATE TRIGGER listing_search BEFORE INSERT OR UPDATE OF event_name, description, skills_needed ON public.team_listings FOR EACH ROW EXECUTE FUNCTION public.refresh_listing_search();
UPDATE public.team_listings SET event_name = event_name;
CREATE INDEX team_listings_search_idx ON public.team_listings USING gin(search_vector);
CREATE FUNCTION public.save_team_listing(payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); lid uuid; cid uuid; fc jsonb; item jsonb; mode text; skill_count integer; pos integer := 0;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to save a listing'; END IF;
 mode := payload->>'status'; fc := payload->'card';
 IF mode NOT IN ('draft','active') OR mode IS NULL THEN RAISE EXCEPTION 'Invalid listing status'; END IF;
 IF length(trim(coalesce(payload->>'eventName',''))) < 1 OR length(payload->>'eventName') > 120 THEN RAISE EXCEPTION 'Add an event name (up to 120 characters)'; END IF;
 IF length(coalesce(payload->>'description','')) > 3000 THEN RAISE EXCEPTION 'Description is too long'; END IF;
 IF jsonb_typeof(payload->'skillsNeeded') <> 'array' OR jsonb_array_length(payload->'skillsNeeded') > 15 THEN RAISE EXCEPTION 'Invalid required skills'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(payload->'skillsNeeded') LOOP
 IF jsonb_typeof(item) <> 'string' OR length(trim(item #>> '{}')) NOT BETWEEN 1 AND 40 THEN RAISE EXCEPTION 'Invalid required skill'; END IF; END LOOP;
 IF nullif(payload->>'openSpots','') IS NOT NULL AND (payload->>'openSpots')::integer NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Open spots must be between 1 and 100'; END IF;
 IF mode = 'active' AND nullif(payload->>'deadline','')::date < CURRENT_DATE THEN RAISE EXCEPTION 'Deadline must be today or later'; END IF;
 IF mode = 'active' AND (length(trim(coalesce(fc->>'displayName',''))) = 0 OR jsonb_array_length(fc->'skills') = 0 OR jsonb_array_length(payload->'skillsNeeded') = 0) THEN RAISE EXCEPTION 'Add your name, your skills and skills needed before posting'; END IF;
 IF length(coalesce(fc->>'displayName','')) > 60 OR length(coalesce(fc->>'college','')) > 100 OR length(coalesce(fc->>'personalNote','')) > 300 OR jsonb_typeof(fc->'skills') <> 'array' OR jsonb_array_length(fc->'skills') > 15 THEN RAISE EXCEPTION 'Invalid Finder Card'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(fc->'skills') LOOP
 IF length(trim(coalesce(item->>'name',''))) NOT BETWEEN 1 AND 40 OR length(coalesce(item->>'evidence','')) > 200 OR length(coalesce(item->>'evidenceUrl','')) > 300 OR (coalesce(item->>'evidenceUrl','') <> '' AND item->>'evidenceUrl' !~* '^https?://[^[:space:]]+$') THEN RAISE EXCEPTION 'Invalid skill evidence'; END IF; END LOOP;
 lid := nullif(payload->>'id','')::uuid;
 IF lid IS NOT NULL THEN
 SELECT finder_card_id INTO cid FROM public.team_listings WHERE id = lid AND owner_id = uid FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found or not yours'; END IF;
 END IF;
 IF length(trim(coalesce(fc->>'displayName',''))) > 0 THEN
 -- Always copy rather than changing a reusable saved profile.
 INSERT INTO public.finder_cards(user_id, display_name, college, personal_note, is_saved) VALUES(uid,trim(fc->>'displayName'),nullif(trim(fc->>'college'),''),nullif(trim(fc->>'personalNote'),''),false) RETURNING id INTO cid;
 FOR item IN SELECT value FROM jsonb_array_elements(fc->'skills') LOOP
 INSERT INTO public.skill_evidence(finder_card_id,skill_name,evidence,evidence_url,position) VALUES(cid,trim(item->>'name'),nullif(trim(item->>'evidence'),''),nullif(item->>'evidenceUrl',''),pos); pos := pos+1; END LOOP;
 ELSE cid := NULL;
 END IF;
 IF lid IS NULL THEN
 INSERT INTO public.team_listings(owner_id,finder_card_id,event_name,description,skills_needed,open_spots,deadline,status) VALUES(uid,cid,trim(payload->>'eventName'),nullif(trim(payload->>'description'),''),ARRAY(SELECT jsonb_array_elements_text(payload->'skillsNeeded')),nullif(payload->>'openSpots','')::integer,nullif(payload->>'deadline','')::date,mode) RETURNING id INTO lid;
 ELSE
 UPDATE public.team_listings SET finder_card_id=cid,event_name=trim(payload->>'eventName'),description=nullif(trim(payload->>'description'),''),skills_needed=ARRAY(SELECT jsonb_array_elements_text(payload->'skillsNeeded')),open_spots=nullif(payload->>'openSpots','')::integer,deadline=nullif(payload->>'deadline','')::date,status=mode WHERE id=lid AND owner_id=uid;
 END IF;
 RETURN lid;
END $$;
REVOKE ALL ON FUNCTION public.save_team_listing(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_team_listing(jsonb) TO authenticated;
GRANT SELECT ON public.team_listings, public.finder_cards, public.skill_evidence, public.skills TO anon;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.team_listings, public.finder_cards, public.skill_evidence TO authenticated;
GRANT ALL ON public.team_listings, public.finder_cards, public.skill_evidence TO service_role;