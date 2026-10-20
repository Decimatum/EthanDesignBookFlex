# RouteProgress

A thin bar along the top of the viewport that trickles while a navigation is in flight and completes when it lands — the cue that a click did something on a slow route. Render one in the root layout and drive it from SvelteKit's `navigating` state (or any boolean: a fetch, a form submit).

```svelte
<script>
	import { RouteProgress } from '@ethan/designbook';
	import { navigating } from '$app/state';
</script>

<RouteProgress active={navigating.to !== null} />
```

## Props

| Prop     | Type      | Default          | Description                                               |
| -------- | --------- | ---------------- | --------------------------------------------------------- |
| `active` | `boolean` | —                | **Required.** True while loading.                         |
| `delay`  | `number`  | `150`            | ms before showing, so fast navigations never flash a bar. |
| `height` | `string`  | `'3px'`          |                                                           |
| `label`  | `string`  | `'Loading page'` | Accessible name.                                          |
| `class`  | `string`  | —                |                                                           |

## Behaviour

Starts at 15% and trickles towards 90% with shrinking steps; it never completes by itself. When `active` turns false it jumps to 100%, fades and unmounts.

## Accessibility

`role="progressbar"` with `aria-valuenow`; it is `pointer-events: none` and never takes focus.

## Tokens used

`--color-accent`, `--z-toast`, `--duration-*`, `--ease-*`

## Anatomy

```
<div class="db-route-progress" role="progressbar" [data-done]><div class="db-route-progress__bar">
```
