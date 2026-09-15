# Tooltip

A short label shown on hover or keyboard focus. For icon-only buttons and truncated text — never for content the user needs to act on.

```svelte
<script>
	import { Tooltip, Button } from '@ethan/designbook';
	import { Trash2 } from '@lucide/svelte';
</script>

<Tooltip text="Delete">
	{#snippet children(props)}
		<Button {...props} iconOnly aria-label="Delete" variant="ghost" tone="neutral">
			{#snippet leading()}<Trash2 />{/snippet}
		</Button>
	{/snippet}
</Tooltip>
```

## Props

| Prop       | Type                                     | Default    | Description        |
| ---------- | ---------------------------------------- | ---------- | ------------------ |
| `text`     | `string`                                 | —          | Tooltip text.      |
| `side`     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    |                    |
| `align`    | `'start' \| 'center' \| 'end'`           | `'center'` |                    |
| `delay`    | `number`                                 | `300`      | Hover delay in ms. |
| `disabled` | `boolean`                                | `false`    |                    |
| `class`    | `string`                                 | —          |                    |

## Snippets

| Snippet    | Params  | Description                                                             |
| ---------- | ------- | ----------------------------------------------------------------------- |
| `children` | `props` | **Required.** Spread onto the described element — it must be focusable. |
| `content`  | —       | Rich content instead of `text`.                                         |

## Keyboard

| Key      | Action                              |
| -------- | ----------------------------------- |
| `Tab`    | Focusing the trigger shows the tip. |
| `Escape` | Hides it.                           |

## Accessibility

- The trigger gets `aria-describedby` pointing at the tooltip (`role="tooltip"`).
- A tooltip supplements, never replaces, an accessible name: an icon button still needs `aria-label`.
- Shows on focus as well as hover, so keyboard users get it too.

## Tokens used

`--z-tooltip`, `--color-neutral`, `--color-neutral-fg`, `--shadow-md`, `--radius-md`, `--text-xs`, `--weight-medium`, `--duration-fast`

## Anatomy

```
<div class="db-tooltip" role="tooltip" data-state data-side>
  <span class="db-tooltip__arrow">
```
