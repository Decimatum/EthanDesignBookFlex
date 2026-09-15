# Dialog

A modal window built on Bits UI's Dialog: focus is trapped, the page behind is inert and scroll-locked, Escape and overlay clicks close it (unless `dismissible={false}`), and focus returns to the trigger on close.

```svelte
<script>
	import { Dialog, Button } from '@ethan/designbook';
	let open = $state(false);
</script>

<Dialog bind:open title="Delete file" description="This cannot be undone.">
	{#snippet trigger(props)}<Button {...props} tone="danger">Delete</Button>{/snippet}
	<p>The file will be removed from every device.</p>
	{#snippet footer({ close })}
		<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
		<Button
			tone="danger"
			onclick={() => {
				remove();
				close();
			}}>Delete</Button
		>
	{/snippet}
</Dialog>

<!-- programmatic: no trigger, just bind open -->
<Dialog bind:open={showTerms} title="Terms" size="lg">…</Dialog>
```

## Props

| Prop           | Type                             | Default | Description                                                                  |
| -------------- | -------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `open`         | `boolean`                        | `false` | Bindable.                                                                    |
| `title`        | `string`                         | —       | **Required.** Accessible name, rendered as the heading.                      |
| `description`  | `string`                         | —       | Linked with `aria-describedby`.                                              |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'`  | 24 / 32 / 48rem / viewport.                                                  |
| `dismissible`  | `boolean`                        | `true`  | Escape, overlay click and the X close it. `false` forces an explicit action. |
| `hideClose`    | `boolean`                        | `false` | Hide the corner X while keeping Escape/overlay.                              |
| `onOpenChange` | `(open: boolean) => void`        | —       |                                                                              |
| `class`        | `string`                         | —       | Extra classes on the panel.                                                  |

## Snippets

| Snippet    | Params      | Description                                            |
| ---------- | ----------- | ------------------------------------------------------ |
| `trigger`  | `props`     | Spread `props` onto the element that opens the dialog. |
| `children` | `{ close }` | Body.                                                  |
| `footer`   | `{ close }` | Right-aligned action row.                              |

## Keyboard

| Key          | Action                              |
| ------------ | ----------------------------------- |
| `Escape`     | Close (when dismissible).           |
| `Tab`/`⇧Tab` | Cycle focus inside the dialog only. |

## Accessibility

- `role="dialog"` with `aria-modal`, `aria-labelledby` (title) and `aria-describedby` (description) — all wired by Bits UI.
- Focus moves into the dialog on open and back to the trigger on close.
- Content outside is `aria-hidden` and scroll-locked while open.
- Always give the primary action a visible button in `footer`; never rely on Escape alone.

## Tokens used

`--z-overlay`, `--z-modal`, `--color-surface-overlay`, `--color-border`, `--color-bg-subtle`, `--shadow-overlay`, `--radius-xl`, `--space-*`, `--font-display*`, `--text-*`, `--duration-*`, `--ease-*`

## Anatomy

```
<div class="db-dialog__overlay" data-state>
<div class="db-dialog" role="dialog" data-size data-state>
  <header class="db-dialog__header"> <h2 class="db-dialog__title"> <p class="db-dialog__description"> <button class="db-dialog__close">
  <div class="db-dialog__body">
  <footer class="db-dialog__footer">
```
