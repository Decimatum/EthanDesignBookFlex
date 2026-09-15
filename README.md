# Design Book

`@ethan/designbook` — a themeable Svelte 5 UI framework and component library, with a docs site
that doubles as the playground and test harness.

- Three themes (`slate`, `folio`, `terminal`) × light/dark × comfortable/compact, all via
  attributes on `<html>`.
- CSS custom properties only; no Tailwind, no runtime styling.
- Every component ships with types, browser tests, an axe check, screenshot baselines and a README.
- `CLAUDE.md` + `llms.txt` + `registry.json` make the library legible to AI tools.

## Develop

```sh
npm install
npx playwright install chromium   # once, for browser tests
npm run dev                       # docs site
```

| Command                   | What it does                                    |
| ------------------------- | ----------------------------------------------- |
| `npm run check`           | svelte-check                                    |
| `npm run lint`            | prettier + eslint                               |
| `npm run test:unit`       | Vitest (browser mode)                           |
| `npm run test:a11y`       | axe across every docs page, theme and scheme    |
| `npm run test:visual`     | screenshot regression (`:update` to rebaseline) |
| `npm run new:component x` | scaffold a component folder + docs page         |
| `npm run gen:docs`        | regenerate `llms.txt` and `registry.json`       |
| `npm run build`           | docs site + package build + publint             |

## Use in a project

```sh
npm install @ethan/designbook
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import '@ethan/designbook/styles';
	import '@ethan/designbook/fonts'; // optional
</script>
```

```svelte
<script>
	import { Button, theme } from '@ethan/designbook';
</script>

<Button onclick={() => theme.set({ scheme: 'dark' })}>Go dark</Button>
```

Copy the inline script from `src/app.html` into your own `app.html` to restore the visitor's
theme before first paint.

See `PLAN.md` for the roadmap and `CLAUDE.md` for conventions.
