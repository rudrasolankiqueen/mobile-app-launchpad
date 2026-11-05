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
