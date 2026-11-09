<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Routing uses TanStack Router file routes (not React Router v6) — the platform stack is fixed.
- Design tokens live in src/styles.css (`@theme inline` + `:root`), not a tailwind.config — Tailwind v4.
- TeamFit primitives (SkillTag, TFCard, Modal, EmptyState) live in src/components/teamfit; toasts use sonner.
- Auth: `useAuth()` from src/lib/auth.tsx (single onAuthStateChange listener); `requireAuth(reason, cb)` opens the shared LoginModal. Protected pages live under src/routes/_authenticated (client gate → /login?redirect=).
- Contact emails are never stored in public tables; reveal them later only via a guarded function after a request is accepted.
- Finder Card logic in src/lib/finder-card.ts; reusable UI (FinderCardForm, FinderCardDisplay, SkillTagInput) in src/components/finder-card. Saving replaces a card's skill_evidence rows.
- The public Finder Card editor keeps Use Once cards in sessionStorage without database writes; saved profile editing remains authenticated, so temporary cards never overwrite saved cards.
- Shared navigation and footer mount once inside the root AuthProvider, so every screen uses the same session-aware shell.
- Listing detail and edit routes use un-nested sibling files, so detail screens do not need an Outlet; unfinished product screens remain explicit placeholders.
- Listing reads use Query-backed public server functions; signed-in supplements and writes use authenticated server functions with the global bearer attacher, so drafts remain owner-only.
- Listing saves use an invoker-rights database transaction that copies a listing-specific Finder Card; saved profiles are only updated by an explicit separate choice.
- Owner draft management lives in the authenticated listings page linked from Dashboard; public detail loaders never retrieve drafts.
