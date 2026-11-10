# Phase 2: App shell, landing and static pages
- [x] Build shared sticky navigation, account menu, mobile drawer and footer.
- [x] Build landing, About and draft Privacy pages; add remaining screen placeholders.
- [x] Verify public navigation, direct page loads and desktop/mobile layouts; session-dependent menu actions passed isolated tests.
- [ ] Verify signed-in account menu and sign-out against hosted accounts — blocked: external Supabase has no available authenticated test session.
- [ ] Finalize Privacy before launch — blocked: operator identity, privacy contact, retention and legal details are not supplied.

# Phase 3: Finder Cards
- [x] Finish accessible skill selection, evidence details and save-mode controls.
- [x] Make the shared editor and both card displays available; connect profile editing.
- [x] Test card rules and interactions; verify desktop and phone layouts.
- [ ] Verify authenticated save/edit/delete — blocked: this external Supabase project has no available authenticated test session.

# Phase 4: Team Listings
- [x] Finish create/edit, draft access and post-save profile prompt; fix the editor type error.
- [x] Build public, owner and already-requested listing detail views.
- [x] Build searchable Explore with filters, sorting and pagination; reserve Looking to Join for Phase 7.
- [x] Add full-text index, validation and atomic listing saves; protect draft-only cards and evidence.
- [x] Test listing rules and public empty-state flows, local restoration, sign-in prompts and phone layouts.
- [ ] Verify signed-in posting, editing, closing, profile prompt, populated search/pagination and existing-request views — blocked: external Supabase has no available authenticated test session or published listing data.
- [ ] Review pre-existing database security warning separately — signed-in users can execute a privileged helper; unrelated to Phase 4 migration.