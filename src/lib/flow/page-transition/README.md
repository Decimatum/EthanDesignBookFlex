# PageTransition

Two ways to animate between screens.

**`viewTransition()`** — wire once with SvelteKit's `onNavigate`; uses the browser's View Transitions API (a crossfade or slide of the whole document) and does nothing where unsupported or when reduced motion is set. Animations live in `styles/transitions.css`, keyed by `data-transition` on `<html>`.

**`<PageTransition>`** — a component that animates its children whenever `key` changes, with Svelte transitions. Works everywhere, and inside a page (a wizard's steps, a tab body) rather than only across routes.

```svelte
<!-- +layout.svelte -->
<script>
	import { onNavigate } from '$app/navigation';
	import { viewTransition, slideByDepth } from '@ethan/designbook';
	onNavigate(viewTransition({ pick: slideByDepth }));
</script>

<!-- inside a page -->
<PageTransition key={step} kind="slide">
	{#if step === 1}<Details />{:else}<Review />{/if}
</PageTransition>
```

## `viewTransition(options)`

| Option | Type                          | Default  | Description                                        |
| ------ | ----------------------------- | -------- | -------------------------------------------------- |
| `kind` | `'fade' \| 'slide' \| 'none'` | `'fade'` |                                                    |
| `pick` | `(navigation) => kind`        | —        | Decide per navigation; `slideByDepth` is provided. |

Returns a function to pass to `onNavigate`. `supportsViewTransitions()` reports availability.

## `<PageTransition>` props

| Prop       | Type                              | Default           | Description                         |
| ---------- | --------------------------------- | ----------------- | ----------------------------------- |
| `key`      | `unknown`                         | —                 | **Required.** Change it to animate. |
| `kind`     | `'fade' \| 'slide' \| 'slide-up'` | `'fade'`          |                                     |
| `duration` | `number`                          | `--duration-slow` | ms.                                 |
| `class`    | `string`                          | —                 |                                     |

Old and new content overlap in one grid cell during the swap, so the layout never jumps.

## Accessibility

Both respect `prefers-reduced-motion` (instant swap). Neither moves focus — pair with a heading or `main.focus()` on route change, as SvelteKit does by default.

## Tokens used

`--duration-slow`, `--ease-standard`, `--ease-decelerate`

## Anatomy

```
<div class="db-page-transition" data-kind><div class="db-page-transition__page">
html[data-transition="fade|slide"]::view-transition-old/new(root)
```
