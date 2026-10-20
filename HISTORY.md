# Design Book — development history

The full status log, newest entry last. Read `STATUS.md` for the current state; this file is only for digging into why something was done.

**2026-09-15 — Phase 0 complete, Phase 1 substantially complete, Button + Spinner done.**

- Repo scaffolded (SvelteKit, Svelte 5, TS strict, ESLint, Prettier, Vitest browser mode, Playwright, axe, Changesets, adapter-static).
- Token system built: 12-step ramps, `scheme.css` light/dark switch, three themes, density and motion axes, nested `data-theme` support. All key token pairs verified ≥ 4.5:1 contrast in every theme × scheme.
- `theme.svelte.ts` controller + no-flash init script in `app.html`.
- Docs site with Foundations (colors, typography, spacing, motion) and component pages; the docs site is itself the a11y and visual test target.
- `Button` (reference implementation) and `Spinner` through the full definition of done: 9 + 2 tests, 42/42 axe checks, 24 screenshot baselines.
- `CLAUDE.md`, `llms.txt`, `registry.json`, `npm run new:component`, `npm run gen:docs` in place.
- Known constraint: Playwright cannot download browsers from the local Linux VM, so browser tests currently run in the cloud workspace (set `PW_CHROMIUM_PATH` to reuse an existing Chromium). Screenshot baselines were generated there.

**2026-09-15 (later) — Phase 2 primitives complete: 19 components.**

- Layout: Stack, Inline, Grid, Container, Divider. Typography: Text, Heading. Display: Badge, Card, Avatar, Skeleton. Forms: Field, Input, Textarea, Checkbox, Radio + RadioGroup, Switch.
- Shared vocab in `src/lib/types.ts` (`Space`, `Align`, `Justify`, `Tone`, `Size`) so every layout prop uses the same scale keys.
- Field → control wiring via Svelte context (`getFieldContext`): label `for`, `aria-describedby`, `aria-invalid`, `required`, `disabled` all propagate; RadioGroup does the same for radios.
- Form controls keep the native input in the DOM (`.sr-only`) so forms, labels and screen readers work unchanged; only the visuals are custom.
- Docs: `src/docs/PropsTable.svelte` for prop tables (prettier mangles hand-written tables in `.svelte`); `svelte/no-useless-mustaches` is off for docs routes.
- Verification: 56 unit tests, 144/144 axe checks (24 pages × 3 themes × 2 schemes), 171 screenshot baselines (theme × scheme at comfortable density + one compact per theme). e2e emulates `prefers-reduced-motion` so axe never samples a colour mid-transition — that was the only flake found.
- Deviation from the original Phase 2 list: Icon, IconButton, ButtonGroup, Toggle, Slider, Tag, Code/Kbd/Link, Box/Spacer/AspectRatio are still open. Icon is covered adequately by `@lucide/svelte` used directly inside snippets; the rest move to the start of Phase 3.

**2026-09-15 (review pass) — bugs fixed, no regressions.**

- Text: a default-tone Text nested inside a toned Text inherited the parent's colour (private `--_color` is inherited like any custom property). Base rule now sets `--_color` explicitly; `tone="inherit"` uses `color: inherit` directly, since `inherit` inside `var()` inherits the variable, not the colour.
- Input: two focus rings (wrapper `:focus-within` plus the global `:focus-visible` on the inner control). Inner ring suppressed.
- Textarea `autoResize` measured once; now re-fits on width, font-load and density changes via `ResizeObserver` + `document.fonts.ready`, and clears its inline height when switched off.
- Avatar: a failed image never retried after `src` changed. Reset on change.
- Checkbox: `indeterminate` is re-asserted after a click so the parent stays in control of the mixed state.
- Tests: component tests now load the design-system CSS (`vitest.setup.ts`), which is what let the Text and Input bugs be pinned by assertions. e2e no longer sets `data-*` after navigation (raced hydration → order-dependent baselines and stale auto-resize measurements); it seeds `localStorage` before load instead. 171 baselines regenerated and verified stable across two runs with different worker counts.
- Docs: props tables on Button/Spinner and in the generator template moved to `PropsTable`; skip-to-content link added to the layout.

**2026-09-15 (Phase 3a/3b) — 27 components; overlays on Bits UI.**

- Bits UI–backed: Dialog, Popover, Tooltip, Menu (+ MenuItem, MenuCheckboxItem, MenuGroup, MenuSeparator), Select, Tabs (+ TabList, Tab, TabPanel). Hand-written: Alert, Toast (`toast()` store + `<Toaster />`).
- Shared `styles/overlays.css` keyframes; every floating layer animates from Bits' `data-state`, so reduced-motion zeroes it all through the motion tokens.
- API shape settled for overlays: `trigger(props)` snippet the caller spreads onto its own element, `children({ close })`, bindable `open`. Documented in CLAUDE.md.
- Select integrates with Field (label `for`, `aria-describedby`, invalid/disabled) and renders a hidden input for forms; groups via an `items[].group` key.
- Toast timers pause on hover/focus and survive in-place updates (monotonic `seq`); `toast.promise()` covers loading → success/error.
- Verification: 83 unit tests (all overlays exercised with real clicks and keyboard), 192/192 axe checks (32 pages × 3 × 2), 243 screenshot baselines regenerated and verified stable.
- Docs layout now mounts `<Toaster />` so the Toast page is live.
- Found and fixed while testing: Tooltip content lacked `role="tooltip"` (Bits doesn't add it), so it now does; the pointer position persisting between browser tests correctly paused toast timers — tests park the mouse first.

**2026-09-18 (Phase 3c + stragglers + review pass) — 39 components.**

- New composites: Table (generic column definition, client-side or `onSort` sorting, numeric columns, custom `cell` snippets, clickable rows, sticky header, striping, `empty` snippet), Accordion (+ AccordionItem, Bits), Breadcrumb (collapses with an ellipsis), Pagination (constant slot count near the edges), Progress (determinate/indeterminate), EmptyState, Drawer (Bits Dialog sliding from right/left/bottom).
- Phase 2 stragglers closed: Slider (Bits; single or range, ticks, Field-aware), Tag (static / removable / `aria-pressed` toggle), Kbd (`keys="mod+k"` with platform glyphs decided after mount), Link, ButtonGroup (attached or detached, both orientations).
- Review pass, all with regression tests: Alert `role` prop now overrides the derived role and `open` is bindable; Field context gained `labelId` and hands out `id`/`describedBy` only outside fieldsets (no duplicate ids or double descriptions in groups), Checkbox/Switch now take their id and `required` from Field; Table ignores clicks on controls inside cells; Toaster announces each toast once (polite + assertive sr-only regions, visible cards carry no live role) and clears timers on unmount; Breadcrumb tolerates `maxItems < 3`; Pagination/Slider are NaN-proof for `perPage=0` / `max===min`; Card `interactive` without `href` is a keyboard-operable button; labelled Divider no longer breaks vertically; Switch thumb uses a new semantic `--color-knob` instead of the primitive `--white`; Avatar/Textarea/Kbd drop effect-driven state.
- Verification: 132 unit tests, 264/264 axe checks (44 pages × 3 themes × 2 schemes), 351 screenshot baselines regenerated and verified stable on a second run; `npm run build` + publint clean.

**2026-09-18 (Combobox + Phase 4 flow layer) — 40 components + 5 flow patterns.**

- Combobox (Bits UI): searchable single select or `multiple` with chips; `keywords` searched alongside labels; grouped options; Field-aware (label, hint/error, invalid/disabled/required) with hidden inputs for forms; custom `filter`; input text mirrors the selection and reverts on Escape.
- Flow layer in `src/lib/flow/`: AppShell (header / off-canvas-then-column sidebar / main / aside / footer, breakpoints at 64rem and 80rem, `embedded` mode for nesting, `--db-app-shell-min-height` hook), RouteProgress (delayed trickle bar driven by any boolean), PageTransition (keyed Svelte transitions) plus `viewTransition()` / `slideByDepth` for the View Transitions API with `styles/transitions.css`, and Stepper (linear/non-linear, error state, sr-only step text). The docs site now runs RouteProgress and view transitions itself; docs get a "Flow" nav section and the visual suite covers it.
- Theme controller: `resolvedScheme` is backed by a live `matchMedia` listener so `auto` follows the OS, and `set()` is inert on the server so the module singleton can't leak between SSR requests. First unit tests for the controller.
- `gen-docs` indexes `src/lib/flow/` as well; `registry.json` entries carry `kind: component | flow`.
- CommandPalette (Bits Command inside a Dialog): grouped commands with hints, Kbd shortcuts, icons, `href` links or `onSelect`, keyword search, configurable global `mod+k` toggle.
- Verification: 158 unit tests, 300/300 axe checks (50 pages), 405 screenshot baselines regenerated and stable on a second run; build + publint clean.

**2026-09-18 (AppShell redesign) — layered surfaces + nav system.**

- AppShell rebuilt as layered surfaces: a canvas, the sidebar directly on it, the page as a rounded surface floating above; header transparent until scrolled, then frosted (`backdrop-filter`); `brand` and `sidebarFooter` snippets; `collapsed` icon rail with animated column width; `contentWidth`; `embedded` mode now scrolls only its main area (no nested sticky).
- New `--shell-*` semantic tokens with per-theme overrides: slate hairline + soft tint, folio paper-on-linen (warm canvas, soft shadow, pill nav, no rail), terminal bordered panels + rail indicator. Token rule in CLAUDE.md extended to `--shell-*`.
- Nav system (`flow/nav`): `Nav` (URL-derived active state, one accent indicator that slides between items with spring easing), `NavSection` (uppercase heading, collapsible; hairline when collapsed), `NavItem` (icon, badge with tones, disabled, link or button; monogram + tooltip in the rail). Active item is centred in its own scroll container on load without moving the page.
- The docs site now runs on AppShell + Nav + CommandPalette (⌘K jumps to any page or theme axis), so every page demos the shell in all three themes.
- Navigation orientation: `Nav` takes `orientation` (vertical list or horizontal bar with a sliding underline; sections become inline labelled groups) and defaults it from the AppShell placement. `AppShell navigation="top"` renders the same `sidebar` snippet as a horizontal bar in the header on wide viewports and as the vertical drawer below 64rem (`NavHost` sets the placement context per copy). Tokens `--shell-nav-underline-h`, `--shell-nav-active-bg-h`.
- Verification: 165 unit tests, 306/306 axe checks (51 pages), 414 screenshot baselines regenerated clean and verified; build + publint clean.

**2026-09-18 (Patterns + Stat/Delta) — 42 components, 6 flow patterns, 2 page patterns.**

- Delta (signed change with good/bad tone, `invert`, percent/currency/number formats, pill variant, sr-only direction) and Stat (KPI tile: label, display-type value, Delta pill, hint, icon, `children` for a bar/sparkline, `loading` skeletons, `flush` variant).
- New "Patterns" docs section with working screens built only from the library: **Dashboard** (AppShell + Nav, Stat row, pill Tabs, sortable Table with Delta/Progress cells inside a flush Card, side cards) and **Onboarding** (four-step Stepper + PageTransition wizard with per-step validation, Field/Input/Select/Combobox/RadioGroup/Slider/Checkbox, state that survives going back, completion screen). Both enrolled in the axe and visual suites.
- Docs prose styles are now scoped to direct children of the page, so components inside demos are never restyled by the docs (the h2 rule was underlining `Heading` inside the dashboard).
- Folio dark `--n-10` lifted (60% → 63% L) so subtle text passes 4.5:1 on component fills and the shell canvas.
- Verification: 170 unit tests, 330/330 axe checks (55 pages), 450 screenshot baselines regenerated clean and verified; build + publint clean.

**2026-09-30 (Auth / Settings / Checkout patterns + NumberInput + Ticker + review fixes) — 44 components, 5 page patterns.**

- Patterns: **Auth** (brand panel + card; sign in / sign up / reset / sent modes sharing one form state, PageTransition between modes, submit-time validation on the fields, server errors in an Alert, password strength meter, brand-free passkey/SSO buttons), **Settings** (vertical Tabs, one Card per section, `draft` vs `saved` compared by value so the save bar slides in only while dirty, validation jumps to the owning section, Appearance really switches the site theme on save, typed-confirmation delete Dialog, invoices Table), **Checkout** (three-step Stepper form beside a sticky live order summary; NumberInput quantities, promo code via Input `action`, card number / expiry formatting in `oninput`, bank-transfer path, success screen). The Dashboard pattern gained a market tape (Ticker).
- Input: new `action` snippet for an interactive trailing control (clear, show/hide password). Unlike `leading`/`trailing` it is not `aria-hidden`; a plain `<button>` inside is styled. Regression test asserts it has no aria-hidden ancestor.
- NumberInput (Phase 5): `role="spinbutton"` text input with `aria-value*` + `aria-valuetext`; plain digits while editing, `plain`/`decimal`/`currency`/`percent` display on blur; locale-aware parsing (de-DE `1.234,56` round-trips); precision from `step`; clamping; ↑/↓, Shift/PageUp ×10, Home/End; stacked chevrons or split − / + with press-and-hold repeat, kept out of the tab order and `aria-hidden` since the spinbutton already exposes stepping; hidden input for forms; Field-aware. Formatted value is seeded into SSR HTML. 8 tests.
- Ticker (Phase 5): `role="marquee"` strip; duration derived from measured width ÷ `speed`; enough `aria-hidden` copies to cover the viewport so the loop is seamless; pause/play button (`aria-pressed`), pause on hover and focus-within; `prefers-reduced-motion` → no animation, single copy, keyboard-focusable scrollable row; values that change flash up/down for 800 ms; items can be links or buttons. 4 tests.
- Review fixes: **Grid** rows were N× too tall whenever a `min` grid sat in a centre-aligned flex container (Chrome sized rows in the intrinsic pass as if there were one column) — visible in the Input page's Adornments/States demos and every pattern; fixed with a definite `width: 100%` and pinned by a regression test that fails without it. Vertical `TabList` gained `min-width: 9rem`. Ticker's max-content track no longer counts towards ancestors' intrinsic width (`contain: inline-size`).
- Verification: 184 unit tests, 360/360 axe checks (60 pages × 3 themes × 2 schemes), 495 screenshot baselines regenerated from scratch and verified stable on a second run; build + publint clean.

Next up: Phase 5 continues with VirtualList and the DataTable layer (column resize, pinning, inline edit), then the `designbook add` CLI, DatePicker, ContextMenu, Banner, DescriptionList, Timeline.

**2026-10-01 (later) — VirtualList (Phase 5) + visual-suite fixes — 45 components.**

- VirtualList: dependency-free windowed list; fixed `itemHeight` or `measure` (ResizeObserver per rendered row, prefix-sum offsets, binary search on scroll); `role="region"` focusable viewport + `role="list"` track with `aria-setsize`/`aria-posinset`; `scrollToIndex(index, align)` and `getRange()` via `bind:this`; `onEndReached` fires once per approach and re-arms when items grow; SSR renders a screenful. 6 tests. Docs page: 10,000 fills, variable-height messages, load-more, empty.
- Visual suite: content captures now hide the sticky shell header (`stylePath` → `e2e/visual-content.css`); it was rendering in its frosted scrolled state over every page's h1. Tolerance changed from `maxDiffPixelRatio: 0.002` (≈2,000 px on a page — enough for a badge to vanish) to `maxDiffPixels: 20`; a full re-run at 0 px showed no run-to-run noise on the pinned Chromium.
- `changed-routes`: `src/docs/nav.ts` now maps to `/` (the shell baseline) instead of everything.
