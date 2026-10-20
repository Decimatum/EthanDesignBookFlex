# Drawer

A panel that slides in from an edge of the viewport — filters, detail views, settings, mobile navigation. It is a modal dialog (focus trap, scroll lock) built on Bits UI's Dialog, so everything that applies to Dialog applies here.

```svelte
<script>
	import { Drawer, Button } from '@ethan/designbook';
	let open = $state(false);
</script>

<Drawer bind:open title="Filters" description="Narrow the order list.">
	{#snippet trigger(props)}<Button {...props} variant="outline">Filters</Button>{/snippet}
	…form fields…
	{#snippet footer({ close })}
		<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
		<Button onclick={close}>Apply</Button>
	{/snippet}
</Drawer>

<Drawer side="bottom" size="50vh" title="Order ticket">…</Drawer>
```

## Props

| Prop           | Type                            | Default   | Description                                                    |
| -------------- | ------------------------------- | --------- | -------------------------------------------------------------- |
| `open`         | `boolean`                       | `false`   | Bindable.                                                      |
| `title`        | `string`                        | —         | **Required.** Rendered as the heading and the accessible name. |
| `description`  | `string`                        | —         | Subtitle under the title, wired as `aria-describedby`.         |
| `side`         | `'right' \| 'left' \| 'bottom'` | `'right'` | Edge the panel slides in from.                                 |
| `size`         | `string`                        | `'24rem'` | Width (left/right) or height (bottom); capped at the viewport. |
| `dismissible`  | `boolean`                       | `true`    | Escape, overlay click and the X button close it.               |
| `onOpenChange` | `(open: boolean) => void`       | —         |                                                                |
| `class`        | `string`                        | —         | Applied to the panel.                                          |

Snippets: `trigger(props)` (spread `props` onto your own button), `children({ close })`, `footer({ close })`.

## Keyboard

| Key      | Action                               |
| -------- | ------------------------------------ |
| `Tab`    | Cycles within the drawer while open. |
| `Escape` | Closes (when `dismissible`).         |

## Accessibility

- `role="dialog" aria-modal="true"`, labelled by the title and described by the description.
- Focus moves into the panel on open and returns to the trigger on close.
- Slide and fade use `--duration-slow`; reduced motion shows and hides instantly.
- Prefer Dialog for short confirmations; use Drawer when the content is a form or a list the user scrolls.

## Tokens used

`--color-surface-overlay`, `--color-bg-subtle`, `--color-border`, `--color-component`, `--color-text*`, `--font-display*`, `--space-*`, `--text-*`, `--control-h-sm`, `--control-radius`, `--radius-xl`, `--shadow-overlay`, `--duration-*`, `--ease-*`, `--focus-ring`, `--z-overlay`, `--z-modal`

## Anatomy

```
<div class="db-drawer__overlay" data-state>
<div class="db-drawer" role="dialog" data-side data-state style="--_size">
  <header class="db-drawer__header">
    <div class="db-drawer__heading"><h2 class="db-drawer__title"> <p class="db-drawer__description">
    <button class="db-drawer__close">
  <div class="db-drawer__body">
  <footer class="db-drawer__footer">
```
