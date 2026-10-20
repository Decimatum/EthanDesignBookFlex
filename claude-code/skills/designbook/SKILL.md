---
name: designbook
description: Build UI with Ethan's Design Book (@ethan/designbook, Svelte 5 + SvelteKit) — components, layout, theming, forms, tables, app shell, page flow. Load before writing any .svelte markup or CSS in a project that uses it, and whenever a UI component seems to be missing.
when_to_use: Any UI work in a Svelte project — new page, screen, form, table, dashboard, landing page, dialog, navigation, theme or styling question; "is there a component for…"; a component that seems missing.
paths: ['**/*.svelte', 'src/routes/**', 'src/lib/**', 'src/app.html', 'src/app.css']
---

# Design Book

The library lives at `/Users/ethanpak/ProgrammingLab/WebDesignFramework` ("the Book"). It is
installed in the app as `@ethan/designbook`. The Book is the single source of UI; the app never
grows its own design system.

## Before writing UI

1. Read the Book's `llms.txt` once per session — one line per component and flow module (51 + 6).
2. For each component you use, read `src/lib/components/<name>/README.md` (flow modules:
   `src/lib/flow/<name>/README.md`): props, snippets, keyboard, tokens. Do not guess props from
   the name. `node_modules/@ethan/designbook/dist/index.d.ts` is the exact export list.
3. Name the profile (next section). The project's `CLAUDE.md` states it; if it doesn't, ask once.

## Profiles

Read `USING.md` §3 in the Book for the full table. The short form:

- **`public`** (client-facing): `folio` or `slate`, fixed theme, `comfortable`, `scheme: auto`.
  Header + footer composition (`MarketingShell` once it exists), `PageTransition`, `Stepper` for
  checkout/sign-up. Prerender every page; only the theme's fonts; ≤ 100 KB gzipped JS on the
  landing route. Reach for Heading, Text, Container, Grid, Card, Button, Link, Field + inputs,
  Accordion, Alert, Tabs. Avoid dense tables, CommandPalette, Kbd, Ticker.
- **`app`** (admin / internal): `slate` or `terminal`, user-switchable theme/scheme/density,
  `compact` on data screens. `AppShell` + `CommandPalette` + `RouteProgress` + `Toaster`. Lists
  past ~100 rows use `VirtualList`/`DataTable`; server-side sort/page past ~1,000 (`onSort`).
  Reach for Table, Stat, Delta, Pagination, Combobox, DatePicker, Menu, Drawer, Banner,
  DescriptionList, EmptyState, Skeleton, Kbd.
- Both in one codebase: SvelteKit route groups `(public)` and `(app)`, one shell per group, theme
  set on `<html>` per group (overlays are portalled to `<body>`). Recipe in `USING.md` §3.

## Rules in the app

- Never hand-write a button, input, select, card, dialog, menu, table, nav, shell, toast or
  tooltip — the Book has one. Compose; don't fork.
- Styling: semantic tokens only (`--color-*`, `--space-*`, `--text-*`, `--radius-*`, `--shadow-*`,
  `--duration-*`, `--ease-*`, `--font-*`), scoped `<style>`, no Tailwind, no hex values, no px
  except `1px` borders. Never a `prefers-color-scheme` or `[data-scheme]` rule in app code.
- Layout with `Stack` / `Inline` / `Grid` / `Container` before writing margin.
- Theme changes only through `theme.set(...)`; attributes live on `<html>`.
- Svelte 5 runes, snippets, callback props — the Book's own conventions (`CLAUDE.md` §Component rules).
- Accessibility is not optional: every interactive thing keyboard-reachable, labels via `Field`,
  axe-clean. Motion honours `prefers-reduced-motion` (the Book's `motion.css` does this globally).

## When a component is missing

Do **not** build it in the app. Follow the request loop (`USING.md` §4):

1. Check `llms.txt` again and try composing from existing parts.
2. Append an entry to the Book's `REQUESTS.md` (format is at the top of that file): project,
   what the user is doing, components tried, proposed name and one-line API.
3. Ship the app with the simplest stand-in — an existing component used plainly, or a stub in
   `src/lib/_pending/<Name>.svelte` marked `// TODO(designbook): replace with <Name>`, plain markup
   on semantic tokens.
4. Tell Ethan the request was filed so the Book session can build it to the definition of done,
   bump, `npm run pack:local`, and the app can swap the stub for the real thing.

## Installing / upgrading

Tarball in the Book's `releases/`: `npm i ../WebDesignFramework/releases/ethan-designbook-<ver>.tgz`.
Wiring (`+layout.svelte` imports, `app.html` attributes + init script, `<Toaster />`) is in
`USING.md` §2. Linked installs need `resolve.dedupe: ['svelte']` in `vite.config.ts`.
