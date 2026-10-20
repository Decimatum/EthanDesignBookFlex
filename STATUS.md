# Design Book — status

One page, kept current. Read this (not `HISTORY.md`) at the start of a session. Update the
numbers and "Next" when you finish; append the story to `HISTORY.md` only if it would help a
later session understand a decision.

**Last updated:** 2026-10-20 — **TabBar** (flow) shipped as 0.3.0 for Legwork with an `AppShell` `tabBar` snippet; same caveat: browser suites not yet run here. 2026-10-19 (late) — **TimeGrid** shipped as 0.2.0 for Legwork (week/day hours × blocks; lanes for overlaps; now line; tap-to-create; README, docs page, spec; `check`/`lint`/`build:docs`/`gen:docs` clean from the linked shell — **unit spec, axe and visual baselines still to run on a machine with Chromium**). Earlier same day — consumer kit: `USING.md`, `REQUESTS.md`, `claude-code/` skill + snippets,
`pack:local` / `skill:install` scripts; `public`/`app` profiles defined; Phase 8 (public surface) planned.

## Where things stand

- Phases 0–4 complete; Phase 5 (data-rich) in progress.
- **52 components** in `src/lib/components/`, **7 flow modules** in `src/lib/flow/`
  (AppShell, Nav, RouteProgress, PageTransition, Stepper, CommandPalette),
  **5 page patterns** (auth, checkout, dashboard, onboarding, settings).
- Verification at last full run (2026-09-30): 184 unit tests, 360/360 axe checks, build + publint
  clean. Screenshot suite now 336 baselines (55 pages × 3 themes × {light/comfortable,
  dark/compact} + 6 docs-shell captures) — **the baselines need one full regeneration** after the
  2026-10-01 change to content-only captures (see "Verification" in `CLAUDE.md`).
- 2026-10-13: **Rating**, **Banner**, **DescriptionList**, **Calendar** (Bits Calendar with per-day
  marks, ISO strings in/out) and **DatePicker** (Bits DatePicker sharing Calendar's grid via
  `calendar/CalendarBody.svelte`) — each with README, docs page, spec; `check` and `lint` clean;
  their unit tests pass on the Mac with `PW_CHROMIUM_PATH` pointed at Brave. `@internationalized/date`
  is now a direct dependency (Bits' peer). **Visual baselines for the five new pages are not yet
  captured**; the five pages pass axe in every theme × scheme (30/30, 2026-10-13).
- **CourtMap** (padel court to scale, tap/drag/nudge, heat view) added 2026-10-13 for Daybook's padel room.
- 2026-10-19: the Book now has a consumer side. `USING.md` (install via `npm run pack:local` tarballs,
  wiring, the **`public` / `app` profiles** and the one-codebase route-group recipe, the request
  loop), `REQUESTS.md` (the queue — seeded with MarketingShell, Section/Hero, Footer, ContextMenu,
  Timeline, Board, Chart, MoneyInput, MarkdownText), and `claude-code/` (a personal Claude Code
  skill installed with `npm run skill:install`, plus CLAUDE.md and settings snippets for new
  projects). `CLAUDE.md` gained performance and quality items (9–10) in the definition of done.
  The root `.gitignore` could not be edited from the session (protected dotfile) — `releases/` carries
  its own `.gitignore` instead. First tarball built: `releases/ethan-designbook-0.1.0.tgz` (160 KB,
  publint clean). svelte-package warns about `$app/*` imports — a false positive from the JSDoc
  example in `flow/page-transition/view-transition.ts`; the library has no `$app` import.
- `app` profile is covered; `public` profile has primitives and auth/checkout/onboarding patterns
  but no page-level anatomy yet — that is Phase 8 in `PLAN.md`.

## Next

1. Regenerate visual baselines once (`npm run test:visual:update`, then `npm run shots:optimize`).
2. Phase 5: VirtualList, then the DataTable layer (column resize, pinning, inline edit) on top
   of Table.
3. `npx designbook add <component>` CLI (Phase 6) — `registry.json` already lists dependencies.
4. Phase 8, public surface — `MarketingShell`, `Section`/`Hero`, `Footer` first (they unblock any
   client-facing project), then the sections `REQUESTS.md` orders by demand.
5. From `REQUESTS.md`: ContextMenu, Timeline, Board, Chart (small SVG set), MoneyInput, MarkdownText.
6. Density audit: `compact` on Table and AppShell pages; tighten `--row-h` if rows feel tall.
7. Run `npm run skill:install` once on the Mac (the session cannot reach `~/.claude`), and commit —
   531 files are uncommitted since the 2nd commit, which also keeps `test:changed` returning `all`.

## Environment

- Development happens on a Mac; the editing shell is a Linux VM on it with Node 22 but **no
  Chromium and no browser download** (Playwright's CDN is blocked), so unit (Vitest browser mode)
  and e2e suites run elsewhere — in a cloud workspace with `PW_CHROMIUM_PATH` pointing at an
  existing Chromium. Sessions that run directly on the Mac can point it at Brave:
  `PW_CHROMIUM_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"`. `npm run check`, `npm run lint`, `npm run build`, `gen:docs`,
  `changed-routes`, `shots-manifest` and `shots:optimize` all run fine locally.
- The repo is on GitHub (`Decimatum/EthanDesignBookFlex`); the owner commits from GitHub Desktop.
  AI sessions edit files but never commit.
- Syncing from a runner back to the Mac: tar only what `scripts/shots-manifest.js --diff` lists;
  a single file must stay under 20 MB; extract with `tar --overwrite` (the mount blocks unlink).
