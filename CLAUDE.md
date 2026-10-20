# Design Book — conventions for AI assistants

This repo is `@ethan/designbook`: a Svelte 5 UI framework and component library plus its docs site
("the Design Book"). Read this file before touching anything, then **`STATUS.md`** (one page:
current state, next steps, environment). `PLAN.md` is the stable roadmap — skim §1–2 once, you
rarely need the rest. `HISTORY.md` is the long session log — only open it to learn _why_ something
was done. `llms.txt` indexes every component README; `registry.json` lists components and their
dependencies. `USING.md` is the guide for projects that _consume_ the Book (install, wiring, the
`public`/`app` profiles, Claude Code setup); `REQUESTS.md` is the queue of components those
projects asked for.

## Working cheaply

Development is resource-bound by verification, not by writing code. The rules:

1. **Read little.** `CLAUDE.md` + `STATUS.md` is the whole briefing. Open a component's
   `README.md` or `.svelte` only when you work on it; `button/` is the reference when in doubt.
2. **Verify in tiers.** For every change: `npm run check` and `npm run lint` (seconds, no
   browser). Then the unit tests of the files you touched (`npx vitest --run <path>`), not the
   whole suite. Then e2e **only for the affected routes**: `npm run test:changed` maps uncommitted
   changes to docs routes via `registry.json` (a component → its page, its dependants and the
   pattern pages; tokens/styles/shell/docs layout → everything). Or set `E2E_ROUTES=button,input`
   by hand. The full matrix (`npm run test:a11y && npm run test:visual`) is for review passes,
   token/theme/shell work, and before a release — not for every component.
3. **Baselines are precious bytes.** Each page's screenshot is its content surface (`main#main`),
   so adding a page to the nav does not invalidate other pages; the docs shell has its own
   `shell-*` baselines (home page, full page). `npm run test:visual:update` rewrites only
   baselines that changed; never `rm -rf e2e/__screenshots__` — if one page captures wrong
   (nested scroll containers), delete _that page's_ PNGs and re-run for that route. After any
   update run `npm run shots:optimize` (oxipng, lossless, ~25% smaller) before syncing or committing.
4. **Sync only diffs.** When tests run on another machine, ship back only what
   `node scripts/shots-manifest.js --diff <other.manifest>` lists, plus the source files you
   changed. Never re-ship all baselines or `node_modules`.
5. **Write little.** Finish by updating the counts and "Next" in `STATUS.md` (a few lines) and,
   only if a decision needs explaining later, a short entry in `HISTORY.md`. Don't duplicate the
   status into other docs.

## Layout

```
src/lib/                 the publishable library (svelte-package → dist/)
  tokens/                primitive.css → density.css → motion.css → semantic.css → themes/*.css → scheme.css
  styles/                reset.css, typography.css, fonts.css, index.css (entry)
  theme/                 theme.svelte.ts — the theme/scheme/density controller
  components/<name>/     <Name>.svelte, <Name>.svelte.spec.ts, README.md, index.ts
  flow/<name>/           app patterns (AppShell, Nav, RouteProgress, PageTransition, Stepper, CommandPalette) — same file set as components
  utils/
  index.ts               barrel export — add every new component here
src/docs/                docs-only helpers ($docs alias): nav.ts, Demo.svelte, ThemeSwitcher.svelte
src/routes/              the docs site (fully prerendered, adapter-static)
e2e/                     Playwright: a11y.e2e.ts (axe, every page × theme × scheme), visual.e2e.ts (screenshots),
                         routes.ts (E2E_ROUTES subset filter shared by both)
scripts/                 new-component.js (scaffold), gen-docs.js (llms.txt + registry.json),
                         changed-routes.js / test-changed.js (e2e for affected routes only),
                         shots-manifest.js (hash list for diff-only sync), optimize-shots.js (lossless PNG shrink via oxipng),
                         install-skill.sh (symlink the Claude Code skill into ~/.claude/skills)
claude-code/             what a consuming project installs: skills/designbook (the personal skill),
                         CLAUDE.snippet.md, settings.snippet.json
releases/                local tarballs from `npm run pack:local` (git-ignored)
USING.md · REQUESTS.md   consumer guide · component request queue
```

## The three axes

Set as attributes on `<html>` (never via JS classes):

- `data-theme`: `slate` (default) | `folio` | `terminal` — palette, fonts, radii, shadows
- `data-scheme`: `light` | `dark` | `auto` — colour scheme only
- `data-density`: `comfortable` | `compact` — `--space-unit` and `--control-h-*` only

Any element can carry its own `data-theme` to theme a subtree. `theme.set({...})` from
`src/lib/theme/theme.svelte.ts` is the only way to change them at runtime.

## Two profiles, one library

Consuming projects declare a profile — **`public`** (client-facing: fixed brand theme, comfortable,
marketing shell, page transitions, prerendered, strict JS budget) or **`app`** (admin/internal:
user-switchable theme/scheme/density, AppShell + CommandPalette, dense data, virtualised lists).
The table is in `USING.md` §3. In the Book this means: every component must look right and
behave well in **both** profiles (a Table in `folio comfortable` and in `terminal compact`); flow
modules and patterns say which profile they serve; and nothing in the library assumes one of
them (no app-only globals, no marketing-only assumptions in shared tokens).

## Requests from consuming projects

Apps never build their own components; they file an entry in `REQUESTS.md` and ship a stub
(`USING.md` §4). A Book session picks from `REQUESTS.md`, scaffolds with `new:component`, builds
to the definition of done, adds a changeset (`npx changeset`), bumps, runs `npm run pack:local`,
and moves the entry to "Shipped" with the version. Design the API here, not in the app: the
request says what the user was doing and what was tried; the Book decides the shape.

## Token rules (non-negotiable)

1. Components reference **semantic tokens only** (`--color-*`, `--space-*`, `--text-*`, `--radius-*`,
   `--shadow-*`, `--duration-*`, `--ease-*`, `--control-*`, `--font-*`, and `--shell-*` for the app
   shell and nav). Never `--n-5`, never a raw
   colour, never a px value that isn't `1px` for a border.
2. Colour ramps are 12 steps: 1–2 backgrounds, 3–5 component fills, 6–8 borders, 9–10 solid fills,
   11–12 text. Themes define `--n-N-light/-dark` and `--a-N-light/-dark`; `scheme.css` picks one.
3. Never write a `prefers-color-scheme` or `[data-scheme]` rule in a component. If a component
   needs a colour that differs in dark mode, the semantic token is wrong — fix it in `semantic.css`.
4. Sizes come from `--control-h-{sm,md,lg}` and spacing from `--space-N`, so density works for free.
5. Motion uses `--duration-*` and `--ease-*` (or the `--transition-*` presets). Reduced motion is
   handled globally in `motion.css`.

## Component rules

- **Svelte 5 runes only**: `$props()`, `$state`, `$derived`, `$effect`, `$bindable`. Snippets, never
  slots. No `createEventDispatcher` — use callback props (`onclick`, `onchange`).
- Props are declared in an exported interface inside `<script lang="ts" module>` (so the type is
  exported from the component), e.g. `export interface ButtonProps extends HTMLButtonAttributes {...}`.
  Variants are string unions, never boolean flags per variant.
- Accept `class?: string` and spread `...rest` onto the root element. Use the array form
  `class={['db-button', className]}`.
- Variants are expressed as `data-variant`, `data-size`, `data-tone` attributes styled with
  attribute selectors, not class concatenation. Root class is `db-<name>`, inner parts
  `db-<name>__part`.
- Private CSS custom properties inside a component are prefixed `--_` (e.g. `--_bg`).
- Styles are scoped `<style>` blocks. `:global` only for children rendered via snippets.
- Native elements first (`<button>`, `<a>`, `<input>`). Overlay/selection components (Dialog,
  Popover, Menu, Select, Tabs, Tooltip) are built on **Bits UI** primitives; everything else is
  dependency-free. Bits conventions used here: the trigger is exposed as a `trigger(props)` snippet
  the caller spreads onto its own element (`{#snippet trigger(props)}<Button {...props}>…`); floating
  panels are portalled, styled through `:global(.db-*)` rules and animated via `data-state` with the
  keyframes in `styles/overlays.css`; pass `class` to Bits as a string (`cn(...)`), not an array.
- Toasts: `toast()` from `components/toast/toast.svelte.ts` plus one `<Toaster />` in the root
  layout. Alerts are inline and static; toasts are transient.
- Icons: `@lucide/svelte`, rendered inside a snippet (`leading`/`trailing`), sized by the component
  via `width/height: 1.15em`. Adornment snippets are decorative (`aria-hidden`); a control that must
  stay interactive goes in a dedicated snippet that is not hidden (Input's `action`).
- Moving content (Ticker) must offer a pause control and honour `prefers-reduced-motion` via
  `matchMedia` in JS (the CSS rule in a component is still forbidden), falling back to a focusable
  scrollable region.
- SSR-safe: guard `window`/`document` (`typeof document !== 'undefined'`). No `$app/*` imports in
  `src/lib` — the library must work outside SvelteKit.
- IDs for aria wiring come from `$props.id()`.

## Definition of done (a component is not finished until all are true)

1. `src/lib/components/<name>/` has `<Name>.svelte`, `<Name>.svelte.spec.ts`, `README.md`, `index.ts`.
2. Exported from `src/lib/index.ts`.
3. README has: one-paragraph purpose, import example, props table (name/type/default/description),
   snippets, keyboard table, accessibility notes, "Tokens used", anatomy.
4. Docs page at `src/routes/components/<name>/+page.svelte` using `$docs/Demo.svelte`, added to
   `src/docs/nav.ts` (this enrols it in the a11y and visual suites automatically).
5. `npm run check`, `npm run lint`, `npm run test:unit -- --run` pass.
6. `npm run test:a11y` passes (zero axe violations in every theme × scheme).
7. Visual baselines updated deliberately with `npm run test:visual:update` and reviewed.
8. `npm run gen:docs` run so `llms.txt` and `registry.json` include it.
9. **Performance.** No work on render that `$derived` can memoise; no `$effect` for anything
   derivable; event handlers never read layout (`getBoundingClientRect`, `offsetHeight`) inside a
   loop or a scroll/resize handler without `requestAnimationFrame`; animations only on `transform`
   and `opacity`; anything that repeats per item (lists, grids, tables) is checked at 1,000 items
   in the docs demo — if it stutters, it virtualises or it is not done. No new runtime dependency
   without a line in `REQUESTS.md` saying why (Bits UI and Lucide are the standing exceptions).
10. **Quality.** Keyboard walkthrough done by hand in all three themes; SSR renders without
    `window`/`document` (the docs site is prerendered, so `npm run build:docs` is the check);
    every state in the README has a demo (default, hover/focus visible in the docs, disabled,
    loading, error, empty); works in both profiles (`USING.md` §3) without profile-specific CSS.

Scaffold all of this with `npm run new:component <name>`.

## Reference implementation

`src/lib/components/button/` is the canonical example. When in doubt, copy its structure: module
script with types → instance script with `$props` → snippet for shared content → markup with
data-attributes → scoped styles organised as base / sizes / tones / variants / modifiers / parts.

## Testing conventions

- Unit/component tests: Vitest browser mode. `import { render } from 'vitest-browser-svelte'`,
  `const screen = render(Component, props)`, assert with `await expect.element(screen.getByRole(...))`.
  Pass snippets with `createRawSnippet` from `svelte`.
- Imports use NodeNext resolution: always write the `.js` extension for TS modules
  (`'$lib/index.js'`, `'./theme.svelte.js'`, `'$docs/nav.js'`); `.svelte` imports keep `.svelte`.
- `vitest.setup.ts` loads the design-system styles into every component test, so computed-style
  assertions (colours, focus rings) are meaningful. Test behaviour first; assert CSS only to pin a
  bug that was CSS.
- `createRawSnippet` must return a single root element (`<div><span/><span/></div>`, not two spans).
- Visual matrix: per theme, `light/comfortable` and `dark/compact` (scheme and density are
  orthogonal, so this covers both without the 9-combo product). Pages capture `main#main` only,
  with the shell header hidden through `e2e/visual-content.css` (`toHaveScreenshot`'s `stylePath`
  — note that an unknown option like `style` is silently ignored, TS does not check it).
  Tolerance is `maxDiffPixels: 20`: captures are deterministic on the pinned Chromium, and a
  ratio-based tolerance let whole badges change unnoticed on tall pages.
  Known quirk: a page with nested scroll containers (the embedded AppShell demo) can render offset
  when Playwright re-captures over a mismatching baseline — delete that page's PNGs and re-run
  with `E2E_ROUTES=/flow/app-shell/` rather than regenerating everything.
- e2e lives in `e2e/`; tag titles with `@a11y` or `@visual`; subset with `E2E_ROUTES`. Set the theme by seeding
  `localStorage` with `page.addInitScript` **before** `goto` — never by writing `data-*` after
  navigation, which races hydration and makes results order-dependent.

## Docs conventions

- Pages are prose + `<Demo>` blocks + a props table. Keep the `code` prop of `<Demo>` to what a
  reader would paste.
- The docs site must itself obey the token rules — it is the biggest demo.

## Commands

```
npm run dev            docs site with HMR
npm run check          svelte-check
npm run lint           prettier + eslint
npm run test:unit      vitest (browser mode)
npm run test:changed   a11y + visual for the routes your uncommitted changes affect (-- --grep @visual)
npm run test:a11y      axe across every page/theme/scheme        (E2E_ROUTES=… for a subset)
npm run test:visual    screenshot regression   (:update to rebaseline only what changed)
npm run shots:optimize lossless PNG shrink of the baselines (oxipng; skips if absent) — run after :update
npm run shots:manifest sha1 list of baselines (--diff other.manifest → files to sync)
npm run build:docs     docs site only (what the e2e server uses; `build` also packages + publint)
npm run new:component  scaffold a component folder + docs page
npm run gen:docs       regenerate llms.txt + registry.json
npm run build          docs site + svelte-package + publint
npm run pack:local     prepack + versioned tarball into releases/ (what consuming apps install)
npm run skill:install  symlink claude-code/skills/designbook into ~/.claude/skills (once per machine)
```

## Style of the thing

Three themes, deliberately different: `slate` is quiet and precise (Inter, 6px radii, hairlines);
`folio` is warm and editorial (Fraunces display, Instrument Sans body, 10px radii, soft shadows);
`terminal` is dense and data-first (IBM Plex, 3px radii, borders instead of shadows, slashed zeros).
A component is right when it looks native in all three without any theme-specific CSS.
