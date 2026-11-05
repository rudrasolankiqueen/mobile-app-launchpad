CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  college text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, college)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'college')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are public" ON public.skills FOR SELECT USING (true);
INSERT INTO public.skills (name, category) VALUES
('React','Frontend'),('Vue','Frontend'),('Next.js','Frontend'),('TypeScript','Frontend'),('JavaScript','Frontend'),('HTML/CSS','Frontend'),('Tailwind CSS','Frontend'),
('Node.js','Backend'),('Python','Backend'),('Java','Backend'),('Go','Backend'),('C++','Backend'),('Rust','Backend'),('SQL','Backend'),('PostgreSQL','Backend'),('MongoDB','Backend'),('REST APIs','Backend'),
('Flutter','Mobile'),('React Native','Mobile'),('Swift','Mobile'),('Kotlin','Mobile'),
('Machine Learning','AI/Data'),('Deep Learning','AI/Data'),('Data Analysis','AI/Data'),('NLP','AI/Data'),('Computer Vision','AI/Data'),('LLMs / Prompting','AI/Data'),
('AWS','DevOps'),('Docker','DevOps'),('Git','DevOps'),('Firebase','DevOps'),
('Figma','Design'),('UI/UX Design','Design'),('Graphic Design','Design'),('Video Editing','Design'),
('Pitching','Business'),('Product Management','Business'),('Marketing','Business'),('Research Writing','Academic'),('Public Speaking','Business'),
('Arduino','Hardware'),('Embedded Systems','Hardware'),('Blockchain','Other'),('Cybersecurity','Other');

-- finder_cards
CREATE TABLE public.finder_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  college text,
  personal_note text,
  is_saved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.finder_cards(user_id);
GRANT SELECT ON public.finder_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finder_cards TO authenticated;
GRANT ALL ON public.finder_cards TO service_role;
ALTER TABLE public.finder_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finder cards are public" ON public.finder_cards FOR SELECT USING (true);
CREATE POLICY "Owners insert cards" ON public.finder_cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update cards" ON public.finder_cards FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete cards" ON public.finder_cards FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_fc_updated BEFORE UPDATE ON public.finder_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.owns_finder_card(_card_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.finder_cards WHERE id = _card_id AND user_id = auth.uid())
$$;

-- skill_evidence
CREATE TABLE public.skill_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  finder_card_id uuid NOT NULL REFERENCES public.finder_cards(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  evidence text,
  evidence_url text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.skill_evidence(finder_card_id);
GRANT SELECT ON public.skill_evidence TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_evidence TO authenticated;
GRANT ALL ON public.skill_evidence TO service_role;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skill evidence is public" ON public.skill_evidence FOR SELECT USING (true);
CREATE POLICY "Owners insert evidence" ON public.skill_evidence FOR INSERT TO authenticated WITH CHECK (public.owns_finder_card(finder_card_id));
CREATE POLICY "Owners update evidence" ON public.skill_evidence FOR UPDATE TO authenticated USING (public.owns_finder_card(finder_card_id)) WITH CHECK (public.owns_finder_card(finder_card_id));
CREATE POLICY "Owners delete evidence" ON public.skill_evidence FOR DELETE TO authenticated USING (public.owns_finder_card(finder_card_id));
CREATE TRIGGER trg_se_updated BEFORE UPDATE ON public.skill_evidence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- team_listings
CREATE TABLE public.team_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  finder_card_id uuid REFERENCES public.finder_cards(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  description text,
  skills_needed text[] NOT NULL DEFAULT '{}',
  open_spots int,
  deadline date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.team_listings(owner_id);
CREATE INDEX ON public.team_listings(status, deadline);
GRANT SELECT ON public.team_listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_listings TO authenticated;
GRANT ALL ON public.team_listings TO service_role;
ALTER TABLE public.team_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published listings are public" ON public.team_listings FOR SELECT USING (status <> 'draft');
CREATE POLICY "Owners read own listings" ON public.team_listings FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert listings" ON public.team_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update listings" ON public.team_listings FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners delete listings" ON public.team_listings FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER trg_tl_updated BEFORE UPDATE ON public.team_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- looking_to_join_cards
CREATE TABLE public.looking_to_join_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  finder_card_id uuid REFERENCES public.finder_cards(id) ON DELETE SET NULL,
  looking_for text,
  availability text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.looking_to_join_cards(user_id);
GRANT SELECT ON public.looking_to_join_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.looking_to_join_cards TO authenticated;
GRANT ALL ON public.looking_to_join_cards TO service_role;
ALTER TABLE public.looking_to_join_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published LTJ cards are public" ON public.looking_to_join_cards FOR SELECT USING (status <> 'draft');
CREATE POLICY "Owners read own LTJ" ON public.looking_to_join_cards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners insert LTJ" ON public.looking_to_join_cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update LTJ" ON public.looking_to_join_cards FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete LTJ" ON public.looking_to_join_cards FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_ltj_updated BEFORE UPDATE ON public.looking_to_join_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- interest_requests
CREATE TABLE public.interest_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL DEFAULT 'to_listing',
  listing_id uuid REFERENCES public.team_listings(id) ON DELETE CASCADE,
  ltj_card_id uuid REFERENCES public.looking_to_join_cards(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  message text,
  finder_card_snapshot jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX interest_unique_listing ON public.interest_requests(listing_id, sender_id) WHERE listing_id IS NOT NULL;
CREATE UNIQUE INDEX interest_unique_ltj ON public.interest_requests(ltj_card_id, sender_id) WHERE ltj_card_id IS NOT NULL;
CREATE INDEX ON public.interest_requests(recipient_id);
CREATE INDEX ON public.interest_requests(sender_id);
GRANT SELECT, INSERT, UPDATE ON public.interest_requests TO authenticated;
GRANT ALL ON public.interest_requests TO service_role;
ALTER TABLE public.interest_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read requests" ON public.interest_requests FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Senders create requests" ON public.interest_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND sender_id <> recipient_id AND status = 'pending');
CREATE POLICY "Recipients respond" ON public.interest_requests FOR UPDATE TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);
CREATE TRIGGER trg_ir_updated BEFORE UPDATE ON public.interest_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- validate request: correct recipient, direction, status values
CREATE OR REPLACE FUNCTION public.validate_interest_request() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _owner uuid;
BEGIN
  IF NEW.status NOT IN ('pending','accepted','declined') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.sender_id <> OLD.sender_id OR NEW.recipient_id <> OLD.recipient_id
       OR NEW.listing_id IS DISTINCT FROM OLD.listing_id OR NEW.ltj_card_id IS DISTINCT FROM OLD.ltj_card_id
       OR NEW.message IS DISTINCT FROM OLD.message OR NEW.finder_card_snapshot IS DISTINCT FROM OLD.finder_card_snapshot
       OR NEW.direction <> OLD.direction THEN
      RAISE EXCEPTION 'Only status can change';
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.direction = 'to_listing' THEN
    SELECT owner_id INTO _owner FROM public.team_listings WHERE id = NEW.listing_id AND status = 'active';
  ELSIF NEW.direction = 'to_member' THEN
    SELECT user_id INTO _owner FROM public.looking_to_join_cards WHERE id = NEW.ltj_card_id AND status = 'active';
  ELSE RAISE EXCEPTION 'Invalid direction';
  END IF;
  IF _owner IS NULL OR _owner <> NEW.recipient_id THEN RAISE EXCEPTION 'Invalid recipient'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_ir_validate BEFORE INSERT OR UPDATE ON public.interest_requests FOR EACH ROW EXECUTE FUNCTION public.validate_interest_request();

-- notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);