# Using the Design Book in a project

How a website or app consumes `@ethan/designbook`, how Claude Code is told about it, and how a
component that is missing gets added to the Book instead of to the app. `CLAUDE.md` is for
_developing_ the Book; this file is for _using_ it.

## 1. Install

The package is not on npm. Three ways in, pick by situation:

| Situation                                      | Method                                                                                                                                                                                                                            |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal project (default)                       | **Tarball.** `npm run pack:local` here, then in the app `npm i ../WebDesignFramework/releases/ethan-designbook-<version>.tgz`                                                                                                     |
| Building the app and the Book at the same time | **Link.** `npm i ../WebDesignFramework` (symlink) + the Vite `dedupe` below; `npm run prepack` here after every change                                                                                                            |
| One-off site that must not carry a dependency  | **Copy-in.** Follow `registry.json`: copy `shared` (tokens, styles, utils, theme) once, then each component's `files` and its `dependencies`, into `src/lib/designbook/`. (`npx designbook add` will do this once Phase 6 lands.) |

`npm run pack:local` runs `prepack` (svelte-package + publint) and writes a versioned tarball to
`releases/` (git-ignored). Bump the version first (`npx changeset` → `npx changeset version`, or
`npm version patch`) so the app's lockfile sees a new version and installs it cleanly.

For the link method, add to the app's `vite.config.ts`:

```ts
export default defineConfig({
	plugins: [sveltekit()],
	resolve: { dedupe: ['svelte'] }, // one Svelte runtime, not the Book's copy too
	server: { fs: { allow: ['..'] } }
});
```

Requirements: Svelte 5 and SvelteKit (the library itself has no `$app` imports, so plain Vite +
Svelte works too — you lose `RouteProgress`'s `navigating` hook and the patterns, nothing else).

## 2. Wire it up

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import '@ethan/designbook/styles';
	import { Toaster } from '@ethan/designbook';
	let { children } = $props();
</script>

<Toaster />
{@render children()}
```

Fonts: `import '@ethan/designbook/fonts'` loads the families of **all three** themes (six
packages). Fine for an internal app; on a public site import only what your theme uses:

| Theme      | Import                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `slate`    | `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`                                            |
| `folio`    | `@fontsource-variable/fraunces`, `@fontsource-variable/instrument-sans`, `@fontsource-variable/jetbrains-mono` |
| `terminal` | `@fontsource/ibm-plex-sans/{400,500,600}.css`, `@fontsource/ibm-plex-mono/{400,500}.css`                       |

`src/app.html`: set the defaults on `<html data-theme="…" data-scheme="auto" data-density="…">`
and paste the inline script from this repo's `src/app.html` (or render `themeInitScript`) so a
returning visitor's choice is applied before first paint.

Then components are plain imports: `import { Button, Field, Input, theme } from '@ethan/designbook'`.
Per-component READMEs (`src/lib/components/<name>/README.md`) are the reference; `llms.txt` is the index.

## 3. Two profiles: public and app

A client-facing site and an internal tool are different products built from the same parts.
The Book supports both through composition — shell, defaults, motion and which components are
reached for — not through a fourth axis. Name the profile at the start of every project.

|                        | **`public`** — client-facing                                                                                                                                               | **`app`** — admin / internal                                                                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goal                   | Trust, clarity, speed to first impression                                                                                                                                  | Throughput, density, keyboard, no surprises                                                                                                                                                                                      |
| Theme                  | `folio` (warm, editorial) or `slate`; **fixed** by the brand, no theme switcher                                                                                            | `slate` or `terminal`; **user-switchable** theme/scheme/density (ship a ThemeSwitcher)                                                                                                                                           |
| Scheme                 | `auto` — follows the visitor                                                                                                                                               | `auto` by default, user override persisted                                                                                                                                                                                       |
| Density                | `comfortable`                                                                                                                                                              | `compact` default on data screens; user override                                                                                                                                                                                 |
| Shell                  | `MarketingShell` (see `REQUESTS.md`); until it lands: `Container` + `Nav orientation="horizontal"` + a footer                                                              | `AppShell` (sidebar, collapsible) + `CommandPalette` + `RouteProgress` + `Toaster`                                                                                                                                               |
| Flow                   | `PageTransition` fade / slide-by-depth; `Stepper` for checkout and sign-up                                                                                                 | Instant navigation (no page transitions beyond `RouteProgress`); `Drawer` for detail views                                                                                                                                       |
| Reach for              | Heading, Text, Container, Grid, Card, Button, Link, Field/Input/Select, Accordion (FAQ), Alert, Avatar, Badge, Tag, Tabs, Stepper                                          | Table / VirtualList / DataTable, Stat, Delta, Ticker, Pagination, Combobox, DatePicker, Menu, Kbd, Banner, DescriptionList, EmptyState, Skeleton                                                                                 |
| Avoid                  | Dense tables, CommandPalette, Kbd, Ticker, Stat grids outside pricing                                                                                                      | Marketing sections, decorative motion, long prose                                                                                                                                                                                |
| Patterns to start from | `auth`, `checkout`, `onboarding`                                                                                                                                           | `dashboard`, `settings`                                                                                                                                                                                                          |
| Performance budget     | Prerender every page (`export const prerender = true`); ≤ 100 KB gzipped JS on the landing route; LCP ≤ 2.5 s on throttled 4G; only the theme's fonts; images sized + lazy | Lists over ~100 rows go through `VirtualList` / `DataTable`; sort and page on the server past ~1,000 rows (`onSort`); every interaction answers in < 100 ms (optimistic UI, `Skeleton` while loading); no layout thrash in loops |
| Accessibility bar      | Axe-clean, keyboard-complete, `prefers-reduced-motion` honoured                                                                                                            | Same, plus every list/table action reachable by keyboard and a `CommandPalette` entry                                                                                                                                            |

### One codebase, both profiles

Most products are both: a public site and the tool behind it. Use SvelteKit route groups, one
shell per group, and set the theme per group:

```
src/routes/
  (public)/+layout.svelte   ← MarketingShell / header + footer, data-theme="folio"
  (public)/+page.svelte
  (public)/pricing/…
  (app)/+layout.svelte      ← AppShell + CommandPalette, data-theme="terminal", user-switchable
  (app)/dashboard/…
```

Set the group's theme on `<html>`, not on a wrapper `<div>`: overlays (Dialog, Menu, Select,
Tooltip) are portalled to `<body>` and would otherwise render in the other group's theme. In the
group layout:

```svelte
<script>
	import { theme } from '@ethan/designbook';
	// Public pages are always the brand theme; don't persist, so the app's choice survives.
	$effect(() => theme.set({ theme: 'folio', density: 'comfortable' }, { persist: false }));
</script>

<svelte:head>
	{@html `<script>document.documentElement.dataset.theme='folio'</script>`}
</svelte:head>
```

The `<svelte:head>` line applies the theme before first paint on a server-rendered page; the
`$effect` keeps it after client-side navigation between groups. The `(app)` layout does the same
with its own defaults but **with** persistence, reading `theme.current` first so a user's choice wins.

Subtree theming (`data-theme` on any element) is still right for small islands: a terminal-themed
ticker on a folio page, a folio-styled preview inside the admin.

## 4. When a component is missing — the request loop

The Book grows from real projects. The rule in the app is: **no bespoke component that the Book
should own.** The loop:

1. **In the app (Claude Code session):** check `llms.txt` and the nearest README; compose from
   existing parts if that gives the right result. If a real component is missing, append an entry
   to this repo's `REQUESTS.md` (the app session has read/write access via `--add-dir`), and ship
   the app with the simplest stand-in: an existing component used plainly, or a local stub in the
   app's `src/lib/_pending/<Name>.svelte` marked `// TODO(designbook): replace with <Name>`. Stubs
   are plain markup on semantic tokens — never a second design system.
2. **In the Book:** take the entry from `REQUESTS.md`, `npm run new:component <name>`, build to the
   definition of done in `CLAUDE.md` (types, tests, axe, visual baselines, README, docs page,
   `gen:docs`), add a changeset, bump, `npm run pack:local`.
3. **Back in the app:** install the new tarball, replace the stub, delete `_pending/`, and mark
   the request done in `REQUESTS.md` with the version that shipped it.

A request is a good one when it says which project needs it, what the user is doing when they
meet it, and which existing components were tried first. The API is proposed in the Book, not in
the app.

## 5. Tell Claude Code

Three things, once per machine and once per project:

1. **Personal skill** (once per machine): `npm run skill:install` symlinks
   `claude-code/skills/designbook` into `~/.claude/skills/designbook`, so every Claude Code
   session on this Mac knows to use the Book for UI work. The skill loads only when relevant and
   points at `llms.txt`, the READMEs, the profiles above and the request loop.
2. **Project `CLAUDE.md`** (once per project): paste `claude-code/CLAUDE.snippet.md` and fill in
   the profile line.
3. **Read access to the Book** (once per project): paste `claude-code/settings.snippet.json` into
   the app's `.claude/settings.json` (or run `claude --add-dir ~/ProgrammingLab/WebDesignFramework`).
   This lets the session open READMEs and `.svelte` sources directly and append to `REQUESTS.md`.
   The Book's own `CLAUDE.md` is deliberately not loaded in the app — those are rules for building
   the Book.

## 6. Upgrading an app

`npm i ../WebDesignFramework/releases/ethan-designbook-<new>.tgz`, read `CHANGELOG.md` for the
range, run the app's `check` and e2e. Breaking changes are rare and always a `major` changeset.
