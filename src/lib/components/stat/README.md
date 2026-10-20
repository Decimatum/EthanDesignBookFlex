# Stat

A KPI tile: a label, a big number, an optional delta and hint, and room for a sparkline or progress bar underneath. Lay several out in a `Grid` at the top of a dashboard.

```svelte
<script>
	import { Stat, Grid, Progress } from '@ethan/designbook';
</script>

<Grid min="14rem" gap="4">
	<Stat label="Net liquidation" value="$1.24M" delta={1.8} hint="vs. yesterday" />
	<Stat label="Day P&L" value="+$4,210" delta={2.4} />
	<Stat label="Margin used" value="42%" delta={3} deltaInvert>
		<Progress value={42} aria-label="Margin used" size="sm" />
	</Stat>
	<Stat label="Open orders" value="7" loading />
</Grid>
```

## Props

| Prop          | Type                                  | Default     | Description                           |
| ------------- | ------------------------------------- | ----------- | ------------------------------------- |
| `label`       | `string`                              | —           | **Required.**                         |
| `value`       | `string`                              | —           | **Required.** Already formatted.      |
| `hint`        | `string`                              | —           | Small text under the value.           |
| `delta`       | `number`                              | —           | Rendered as a `Delta` pill.           |
| `deltaFormat` | `'number' \| 'percent' \| 'currency'` | `'percent'` |                                       |
| `deltaInvert` | `boolean`                             | `false`     | Positive delta is bad.                |
| `loading`     | `boolean`                             | `false`     | Skeletons instead of the value.       |
| `size`        | `'sm' \| 'md' \| 'lg'`                | `'md'`      | Value size and padding.               |
| `variant`     | `'card' \| 'flush'`                   | `'card'`    | Own surface, or flush inside another. |

Snippets: `icon` (top-right, decorative), `children` (below the value). Other props go to the root `<article>`.

## Accessibility

- `aria-busy` while loading; the value uses display type and tabular numerals so columns of stats line up.
- The label is plain text, not a heading — put stats under a real section heading.

## Tokens used

`--color-surface`, `--color-border`, `--color-text*`, `--font-display*`, `--font-numeric`, `--space-*`, `--text-*`, `--radius-lg`

## Anatomy

```
<article class="db-stat" data-size data-variant [aria-busy]>
  <div class="db-stat__head"><span class="db-stat__label"> <span class="db-stat__icon">
  <div class="db-stat__row"><span class="db-stat__value"> <span class="db-delta">
  <span class="db-stat__hint">
  <div class="db-stat__extra">
```
