# Design Book — conventions for AI assistants

This repo is `@ethan/designbook`: a Svelte 5 UI framework and component library plus its docs site
("the Design Book"). Read this file before touching anything. `PLAN.md` has the roadmap;
`llms.txt` indexes every component README; `registry.json` lists components and their dependencies.

## Layout

```
src/lib/                 the publishable library (svelte-package → dist/)
  tokens/                primitive.css → density.css → motion.css → semantic.css → themes/*.css → scheme.css
  styles/                reset.css, typography.css, fonts.css, index.css (entry)
  theme/                 theme.svelte.ts — the theme/scheme/density controller
  components/<name>/     <Name>.svelte, <Name>.svelte.spec.ts, README.md, index.ts
  layout/ flow/ actions/ motion/ utils/
  index.ts               barrel export — add every new component here
src/docs/                docs-only helpers ($docs alias): nav.ts, Demo.svelte, ThemeSwitcher.svelte
src/routes/              the docs site (fully prerendered, adapter-static)
e2e/                     Playwright: a11y.e2e.ts (axe, every page × theme × scheme), visual.e2e.ts (screenshots)
scripts/                 new-component.js (scaffold), gen-docs.js (llms.txt + registry.json)
```

## The three axes

Set as attributes on `<html>` (never via JS classes):

- `data-theme`: `slate` (default) | `folio` | `terminal` — palette, fonts, radii, shadows
- `data-scheme`: `light` | `dark` | `auto` — colour scheme only
- `data-density`: `comfortable` | `compact` — `--space-unit` and `--control-h-*` only

Any element can carry its own `data-theme` to theme a subtree. `theme.set({...})` from
`src/lib/theme/theme.svelte.ts` is the only way to change them at runtime.

## Token rules (non-negotiable)

1. Components reference **semantic tokens only** (`--color-*`, `--space-*`, `--text-*`, `--radius-*`,
   `--shadow-*`, `--duration-*`, `--ease-*`, `--control-*`, `--font-*`). Never `--n-5`, never a raw
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
  via `width/height: 1.15em`.
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
- e2e lives in `e2e/`; tag titles with `@a11y` or `@visual`. Set the theme by seeding
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
npm run test:a11y      axe across every page/theme/scheme
npm run test:visual    screenshot regression   (:update to rebaseline)
npm run new:component  scaffold a component folder + docs page
npm run gen:docs       regenerate llms.txt + registry.json
npm run build          docs site + svelte-package + publint
```

## Style of the thing

Three themes, deliberately different: `slate` is quiet and precise (Inter, 6px radii, hairlines);
`folio` is warm and editorial (Fraunces display, Instrument Sans body, 10px radii, soft shadows);
`terminal` is dense and data-first (IBM Plex, 3px radii, borders instead of shadows, slashed zeros).
A component is right when it looks native in all three without any theme-specific CSS.
