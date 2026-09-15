# Popover

A floating panel anchored to its trigger, for filters, pickers, small forms and previews. Positioning, collision avoidance, focus management and dismissal come from Bits UI.

```svelte
<script>
	import { Popover, Button, Stack, Checkbox } from '@ethan/designbook';
</script>

<Popover>
	{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral">Filters</Button
		>{/snippet}
	{#snippet children({ close })}
		<Stack gap="2">
			<Checkbox>Open orders</Checkbox>
			<Checkbox>Filled today</Checkbox>
			<Button size="sm" onclick={close}>Apply</Button>
		</Stack>
	{/snippet}
</Popover>
```

## Props

| Prop           | Type                                     | Default    | Description                         |
| -------------- | ---------------------------------------- | ---------- | ----------------------------------- |
| `open`         | `boolean`                                | `false`    | Bindable.                           |
| `side`         | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side; flips on collision. |
| `align`        | `'start' \| 'center' \| 'end'`           | `'center'` |                                     |
| `sideOffset`   | `number`                                 | `8`        | Gap in px.                          |
| `arrow`        | `boolean`                                | `true`     |                                     |
| `width`        | `string`                                 | content    | Any CSS length.                     |
| `flush`        | `boolean`                                | `false`    | No padding, for lists and menus.    |
| `onOpenChange` | `(open: boolean) => void`                | —          |                                     |
| `class`        | `string`                                 | —          |                                     |

## Snippets

| Snippet    | Params      | Description                                   |
| ---------- | ----------- | --------------------------------------------- |
| `trigger`  | `props`     | **Required.** Spread onto the toggle element. |
| `children` | `{ close }` | Panel content.                                |

## Keyboard

| Key      | Action                                 |
| -------- | -------------------------------------- |
| `Escape` | Close and return focus to the trigger. |
| `Tab`    | Moves through the panel's controls.    |

## Accessibility

- Trigger gets `aria-expanded` and `aria-controls`; the panel receives focus on open and returns it on close.
- Clicking outside closes it. Use Dialog instead when the task must be completed.

## Tokens used

`--z-popover`, `--color-surface-overlay`, `--color-border`, `--shadow-lg`, `--radius-lg`, `--space-4`, `--text-sm`, `--duration-*`, `--ease-*`

## Anatomy

```
<div class="db-popover" data-state data-side [data-flush]>
  <span class="db-popover__arrow">
```
