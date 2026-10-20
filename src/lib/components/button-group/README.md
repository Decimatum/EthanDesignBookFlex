# ButtonGroup

Lays out related buttons as one unit: a segmented set of options, a split action, or a toolbar row. Attached groups collapse the inner radii so outlines read as a single bar.

```svelte
<script>
	import { ButtonGroup, Button } from '@ethan/designbook';
	let range = $state('1D');
</script>

<ButtonGroup label="Chart range">
	{#each ['1D', '1W', '1M', '1Y'] as r (r)}
		<Button
			variant={range === r ? 'solid' : 'outline'}
			tone="neutral"
			size="sm"
			onclick={() => (range = r)}
		>
			{r}
		</Button>
	{/each}
</ButtonGroup>

<ButtonGroup attached={false}>
	<Button variant="outline" tone="neutral">Cancel</Button>
	<Button>Save</Button>
</ButtonGroup>
```

## Props

| Prop          | Type                         | Default        | Description                                |
| ------------- | ---------------------------- | -------------- | ------------------------------------------ |
| `attached`    | `boolean`                    | `true`         | Joined borders; `false` keeps a small gap. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |                                            |
| `label`       | `string`                     | —              | Accessible name for the `role="group"`.    |
| `class`       | `string`                     | —              |                                            |

Snippet: `children` — `Button` components. Other props are forwarded to the root element.

## Keyboard

Each button is its own tab stop. For a single-choice segmented control where arrow keys should move the selection, use Tabs with `variant="pill"` or a RadioGroup instead.

## Accessibility

- `role="group"` with `aria-label` so the set is announced together.
- The selected option in a segmented group should differ by more than colour — the example uses `solid` vs `outline`.
- Hover and focus lift the button above its neighbours so the focus ring is never clipped.

## Tokens used

`--space-2`, `--control-border-width`, `--control-radius`, `--color-bg`, `--focus-ring`

## Anatomy

```
<div class="db-button-group" role="group" [data-attached] data-orientation>
  <button class="db-button"> …
```
