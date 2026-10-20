# Design Book — Project Plan

A Svelte 5 UI framework and component library, built as a personal design system that future websites (and Claude) can pull from.

**Decisions locked in:** Svelte 5 + SvelteKit · CSS custom properties + scoped CSS (no Tailwind) · three visual directions kept as switchable themes · full test stack (Vitest + Playwright + axe + visual regression) · package `@ethan/designbook` · Lucide icons · Bits UI for headless primitives · charts deferred past v1 · fonts per theme in §6.1.

---

## 1. Goals, restated as design constraints

Your eleven requirements collapse into five architectural rules. Every later decision in this plan is checked against them.

| Rule                                         | Comes from                                    | What it forces                                                                                                                                                                         |
| -------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Copy-out, not install-in**                 | #4 extractable, #6 general                    | Each component is a self-contained folder that can be copied into any Svelte project. No global state, no framework-wide runtime, no build plugin required.                            |
| **Tokens are the only source of style**      | #1 beautiful, #2 maintainable, #11 your style | Components never hard-code a colour, size, or font. Changing the look means editing tokens, not components. Your "style" lives in one place.                                           |
| **Flow is a first-class layer**              | #3 flow between screens, #5 interactive       | Page transitions, steppers, app shells and navigation state are part of the library, not left to each project.                                                                         |
| **Docs are machine-readable first**          | #8 documented, #9 AI-referenceable            | Every component ships a README with a props table and usage example, plus a root `CLAUDE.md` / `llms.txt` index. The human docs site is generated from these, not the other way round. |
| **Every component has a definition of done** | #7 comprehensive, #10 minimal bugs            | No component is "in" until it has types, tests, an a11y check, a demo, and a README. Comprehensive means finished, not started.                                                        |

---

## 2. Architecture

### 2.1 Repository layout

One SvelteKit repo. `src/lib` is the publishable library (via `svelte-package`); `src/routes` is the docs site. This keeps one `npm run dev` and lets the docs site double as the component playground, so you do not need Storybook.

```
WebDesignFramework/
├── CLAUDE.md                  # entry point for AI: rules, conventions, where things are
├── llms.txt                   # index of every component README (for AI + humans)
├── registry.json              # component manifest: name, path, deps, description
├── src/
│   ├── lib/
│   │   ├── tokens/            # primitive.css, semantic.css, themes/*.css, density.css
│   │   ├── styles/            # reset.css, typography.css, utilities.css
│   │   ├── components/
│   │   │   ├── button/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Button.test.ts
│   │   │   │   ├── README.md          # props, slots/snippets, events, examples, a11y notes
│   │   │   │   └── index.ts
│   │   │   └── … one folder per component
│   │   ├── layout/            # AppShell, Page, Stack, Grid, Container, Split
│   │   ├── flow/              # PageTransition, Stepper, Wizard, RouteProgress
│   │   ├── actions/           # use:clickOutside, use:focusTrap, use:tooltip, use:shortcut
│   │   ├── motion/            # easing + duration tokens, shared transition presets
│   │   ├── utils/             # cn(), portal, id generator, media queries, keyboard helpers
│   │   └── index.ts           # barrel export
│   └── routes/                # the Design Book docs site
│       ├── (book)/            # foundations, components, patterns, flows
│       └── playground/        # live prop editor for any component
├── scripts/
│   ├── gen-docs.ts            # builds llms.txt + registry.json from component READMEs
│   └── add.ts                 # `npx designbook add button` — copies a component + deps
├── tests/
│   ├── e2e/                   # Playwright: flows, keyboard nav, screenshots
│   └── a11y/                  # axe runs against every docs page
└── package.json
```

### 2.2 Token system (three tiers)

This is the part that makes the framework feel like _yours_ while staying general.

1. **Primitive tokens** — raw values, never used directly in components. `--slate-500`, `--space-4`, `--font-sans`, `--radius-md`, `--duration-fast`.
2. **Semantic tokens** — meaning, not value. `--color-bg`, `--color-surface`, `--color-text-muted`, `--color-accent`, `--color-danger`, `--shadow-overlay`. Components only ever reference these.
3. **Component tokens** (sparingly) — `--button-height`, `--input-border`. Only where a component needs an override hook.

Three independent axes, all applied as attributes on `<html>` so any project can set them in one line:

| Axis           | Values                                                                                             | What changes                                   |
| -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `data-theme`   | `slate` (minimal & precise, default) · `folio` (warm & editorial) · `terminal` (dense & data-rich) | Palette, type family, radius, shadow character |
| `data-scheme`  | `light` · `dark` · `auto`                                                                          | Colour scheme only                             |
| `data-density` | `comfortable` · `compact`                                                                          | Spacing scale and control heights              |

Separating scheme and density from theme is deliberate: a "dark, dense trading dashboard" is `terminal + dark + compact`, but nothing stops a `slate + dark + comfortable` marketing site. This also means every component gets tested across all combinations automatically, which is where most style bugs surface.

On top of the three axes sit two **profiles** — `public` (client-facing) and `app` (admin/internal) — which are not a fourth attribute but named compositions: which shell, which defaults, which components are reached for, which budgets apply. A product that is both uses SvelteKit route groups with one shell and one theme per group. The table and the recipe live in `USING.md` §3.

### 2.3 Headless foundation for the hard components

Recommendation: build overlay and selection components (Dialog, Popover, Menu, Select, Combobox, Tabs, Tooltip) on top of **Bits UI** (headless Svelte 5 primitives) rather than hand-rolling focus trapping, aria wiring, typeahead, and positioning. These are where 80% of accessibility bugs live in home-grown libraries. Everything visual and everything simple (Button, Input, Card, Badge, Stack…) stays hand-written with zero dependencies.

Trade-off: extracted overlay components carry one peer dependency. Given requirement #10 (minimal bugs), this is worth it. If you'd rather be fully dependency-free, the plan still works — Phase 3 just takes roughly twice as long.

### 2.4 Component conventions (enforced by a template)

Every component folder is generated from a template so they're identical in shape:

- Svelte 5 runes only (`$props`, `$state`, `$derived`, `$bindable`), snippets instead of slots.
- Props typed via an exported `interface ButtonProps`; variants typed as string unions, never booleans-for-variants.
- `class` prop passthrough and `...rest` forwarded to the root element.
- Styles scoped, referencing semantic tokens only; a `data-variant` / `data-size` attribute pattern instead of class concatenation.
- A `README.md` with: purpose, import line, props table, snippets, events, keyboard interactions, a11y notes, three examples (basic, composed, edge case).

---

## 3. Development phases

Estimates assume evenings/weekends. Each phase ends with something usable; you can stop at any phase boundary and still have a coherent library.

### Phase 0 — Foundation (≈ 1 week)

Scaffold SvelteKit with TypeScript strict mode, ESLint + Prettier with the Svelte plugins, Vitest with `@testing-library/svelte`, Playwright, `axe-core` wired into Playwright, and Changesets for versioning. Write `CLAUDE.md` with the conventions from §2.4 _before_ writing any component — it's cheaper to keep AI-generated components consistent than to fix them later. Set up the component-folder generator script. Deliverable: an empty but fully-tooled repo where `npm test` and `npm run check` pass.

### Phase 1 — Tokens & themes (≈ 1–2 weeks)

Build the three-tier token system and all three themes. Ship the reset, typography scale, and a `ThemeProvider`-free approach (just attributes on `<html>` plus a tiny `setTheme()` util that persists to `localStorage`). Build the docs site's _Foundations_ section: colour, type, spacing, radius, elevation, motion — each page renders live from the tokens so the docs can never drift from the code.

This is the phase to nail "your style". Spend the time here on the type pairing and the accent colours for each theme; everything downstream inherits it.

### Phase 2 — Primitives (≈ 2 weeks)

The building blocks everything else composes from.

| Category   | Components                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------- |
| Typography | Text, Heading, Code, Kbd, Link                                                                |
| Layout     | Box, Stack, Inline, Grid, Container, Divider, Spacer, AspectRatio                             |
| Controls   | Button, IconButton, ButtonGroup, Toggle                                                       |
| Inputs     | Input, Textarea, Checkbox, Radio, Switch, Slider, Field (label + hint + error wrapper)        |
| Display    | Icon (wrapper around Lucide or your own SVG set), Avatar, Badge, Tag, Card, Skeleton, Spinner |

Also in this phase: the shared `actions/` (clickOutside, focusTrap, shortcut, tooltip) and `utils/`.

### Phase 3 — Composite components (≈ 3 weeks)

| Category   | Components                                                                           |
| ---------- | ------------------------------------------------------------------------------------ |
| Overlays   | Dialog, Drawer/Sheet, Popover, Tooltip, Toast, ContextMenu, DropdownMenu             |
| Selection  | Select, Combobox, MultiSelect, DatePicker, ColorPicker (optional)                    |
| Navigation | Tabs, Breadcrumb, Pagination, NavBar, SideNav, CommandPalette (⌘K)                   |
| Feedback   | Alert, Banner, Progress, EmptyState, ErrorBoundary                                   |
| Data       | Table (sortable, sticky header), DescriptionList, Stat/KPI tile, Timeline, Accordion |
| Forms      | Form (with validation adapter, e.g. Zod), FieldSet, FileUpload                       |

### Phase 4 — Flow & app patterns (≈ 2 weeks)

This is requirement #3 and where most libraries stop short.

- `PageTransition` — View Transitions API with Svelte transition fallback; per-route transition hints (slide, fade, shared-element).
- `AppShell` — header / sidebar / content / rail composition with responsive collapse, and a `MarketingShell` variant for landing pages.
- `Stepper` and `Wizard` — multi-screen flows with URL-synced state, back/forward, validation gates.
- `RouteProgress` — top loading bar tied to SvelteKit navigation.
- Patterns section in the docs: auth flow, onboarding flow, settings pages, dashboard layout, checkout — each a working multi-route demo, so future projects start from a flow rather than a blank page.

### Phase 5 — Data-rich components (≈ 1–2 weeks)

`DataTable` (virtualised rows, column resize, pinning, inline edit), `VirtualList`, `NumberInput` with formatting, `PriceChange` / `Delta` indicators with tabular numerals, `Ticker` list. The `terminal` theme is designed with these in mind. Charts (`Sparkline` and a token-coloured chart wrapper, likely over LayerChart or D3 scales) are deferred to a post-1.0 phase.

### Phase 6 — Docs & AI integration (≈ 1 week, but runs continuously)

- `scripts/gen-docs.ts` builds `llms.txt` and `registry.json` from every README.
- `npx designbook add <component>` copies a component folder plus its internal dependencies into another project (the shadcn model). This is what makes #4 real.
- Playground route with a live prop editor, theme/scheme/density toggles, and a "copy code" button.
- `CLAUDE.md` finalised: how to add a component, how to compose flows, which tokens to use for what, anti-patterns.

### Phase 8 — Public surface (after Phase 5; can run alongside 6–7)

The library serves two profiles (`USING.md` §3): **`app`** — admin and internal tools — is
covered by AppShell, Nav, CommandPalette, Table/VirtualList/DataTable, Stat, Delta, Ticker and
the dashboard/settings patterns. **`public`** — client-facing sites — has the primitives and the
auth/checkout/onboarding patterns but not the page-level anatomy. This phase closes that gap:

- `MarketingShell` (flow): brand + horizontal Nav + CTA header, transparent-to-frosted on scroll,
  mobile drawer, footer slot — the public counterpart of AppShell.
- `Section` / `Hero`, `Footer`, `FeatureGrid`, `Pricing` (built from Card + Stat), `Testimonial`,
  `LogoCloud`, `CTA`, `FAQ` (on Accordion), `Prose` typography (`.db-prose`, also what
  `MarkdownText` renders into), `ContactForm` pattern.
- Patterns: `landing`, `pricing`, `article`, `contact`, `legal`.
- Public budgets enforced in the docs site: pattern pages prerendered, Lighthouse run in review
  passes (performance and accessibility ≥ 95), only the active theme's fonts loaded on those pages.
- Theme-per-route-group recipe (`USING.md` §3) demonstrated: the docs site's own landing page
  runs the `public` profile; the component pages stay `app`.

Which sections come first depends on the first client-facing project; `REQUESTS.md` orders them.

### Phase 7 — Hardening & v1.0 (≈ 1 week)

Full axe sweep across every docs page × 3 themes × 2 schemes. Playwright screenshot baselines for every component in every theme. Keyboard-only walkthrough of every flow pattern. Bundle-size budget per component (tree-shaking check). Tag `v1.0.0`; from here on Changesets handles releases.

Total: roughly 13–14 weeks of part-time work to v1.0, with a usable library from about week 5.

---

## 4. Definition of done (per component)

A component is complete when all of these are true. This checklist becomes a PR template.

1. Types exported; all props documented in README with defaults.
2. Renders correctly in `slate`, `folio`, `terminal` × light/dark × comfortable/compact.
3. Vitest unit tests covering variants, disabled/loading states, and event emission.
4. axe passes with zero violations in the docs demo.
5. Full keyboard operability documented and tested in Playwright.
6. Playwright screenshot baseline committed.
7. Demo page in the Design Book with at least three examples.
8. Listed in `registry.json` and `llms.txt`.

---

## 5. Suggested improvements beyond the original brief

**Split colour scheme and density out of "theme".** You picked three aesthetics that partly describe palette and partly describe density. Modelling them as three orthogonal axes gives you 12 combinations from 3 themes' worth of work and prevents the "dark theme is also the compact theme" coupling.

**Use the docs site as the test harness.** Every demo page is also the a11y and screenshot target. One artefact, three jobs; no Storybook to maintain.

**Ship a copy-in CLI, not just an npm package.** Publishing to npm is fine for your own use, but `add <component>` is what makes extraction painless and lets you fork a component per-project without ejecting the whole library.

**Write `CLAUDE.md` first.** Since Claude will build a lot of this with you, the conventions file is your highest-leverage document. Include a worked example of a "perfect" component so generated code matches.

**Adopt a headless primitive layer for overlays.** See §2.3 — the single biggest bug-reducer available.

**Add a motion token layer.** Durations and easings as tokens, with a `prefers-reduced-motion` switch built into the transition presets, so flows feel consistent and accessible without per-component effort.

**Version from day one with Changesets.** Future projects will pin versions; you'll want a changelog when you upgrade one of them a year from now.

**Consider a small icon strategy early.** Wrapping Lucide gives 1,500 consistent icons immediately; you can add your own SVGs to the same `Icon` component later without changing any call sites.

---

## 6. Decisions (resolved)

| Question            | Decision                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package name        | `@ethan/designbook` — also the CLI name (`npx designbook add <component>`)                                                                          |
| Icon set            | Lucide, wrapped by a single `Icon` component so custom SVGs can be added later without changing call sites                                          |
| Headless primitives | Bits UI for overlays and selection components; everything else dependency-free                                                                      |
| Charts              | Deferred — out of v1. Phase 5 ships DataTable, VirtualList, NumberInput, Delta and Ticker; Sparkline and the chart wrapper move to a post-1.0 phase |
| Fonts               | See below                                                                                                                                           |

### 6.1 Typography per theme

All families are open-licensed and self-hosted through `@fontsource-variable/*` packages, so extracted components never depend on an external font CDN.

| Theme      | Headings       | Body / UI       | Mono (code, numerals, data) | Why                                                                                                                                                                                                                              |
| ---------- | -------------- | --------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slate`    | Inter Variable | Inter Variable  | JetBrains Mono              | Best-hinted UI sans available; true tabular figures; stylistic sets (`cv11`, `ss01`) tune personality without a font change. Swap to Geist Sans/Mono if it feels too common.                                                     |
| `folio`    | Fraunces       | Instrument Sans | JetBrains Mono              | Fraunces is a variable serif with optical sizing and a "wonk" axis — restrained at text sizes, expressive at display sizes. Body stays sans because serif form controls read poorly. Alternatives: Instrument Serif, Newsreader. |
| `terminal` | IBM Plex Sans  | IBM Plex Sans   | IBM Plex Mono               | One family for dense mixed layouts; Plex Mono's slashed zero and clean tabular digits suit price columns. Alternatives: Geist Mono, Commit Mono.                                                                                 |

Implementation rules: each theme defines `--font-display`, `--font-body`, `--font-mono`; fallback stacks use `size-adjust` metrics to limit layout shift; `font-variant-numeric: tabular-nums` is exposed as a `--font-numeric` token and applied by default in Table, Stat, NumberInput, Delta and Ticker across _all_ themes, not only `terminal`.

---

## 7. Status and next steps

The plan above is stable. Current state, verification counts, environment notes and the next
steps live in **`STATUS.md`** (one page, kept current). The full session-by-session log lives in
**`HISTORY.md`** — read it only when you need to know _why_ something was done.
