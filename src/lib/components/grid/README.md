# Grid

CSS grid with two modes: a fixed column count, or responsive auto-fit columns with a minimum width. Both keep a token-driven gap.

```svelte
<script>
	import { Grid } from '@ethan/designbook';
</script>

<!-- exactly three columns -->
<Grid columns={3} gap="4">…</Grid>

<!-- as many 16rem columns as fit, collapsing to one on narrow screens -->
<Grid min="16rem">…</Grid>

<!-- raw template -->
<Grid columns="1fr 2fr">…</Grid>
```

## Props

| Prop      | Type                                 | Default | Description                                                                        |
| --------- | ------------------------------------ | ------- | ---------------------------------------------------------------------------------- |
| `as`      | `'div' \| 'section' \| 'ul' \| 'ol'` | `'div'` |                                                                                    |
| `columns` | `number \| string`                   | `2`     | Column count, or a raw `grid-template-columns` value. Ignored when `min` is set.   |
| `min`     | `string`                             | —       | Minimum column width; switches to `repeat(auto-fit, minmax(min(min, 100%), 1fr))`. |
| `gap`     | `Space`                              | `'4'`   | Column gap (and row gap unless `rowGap` is set).                                   |
| `rowGap`  | `Space`                              | —       | Separate row gap.                                                                  |
| `align`   | `Align`                              | —       | `align-items`.                                                                     |
| `class`   | `string`                             | —       |                                                                                    |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | Cells.      |

## Keyboard

Not interactive.

## Accessibility

- Pure layout; source order is reading order.

## Tokens used

`--space-*`

## Anatomy

```
<div class="db-grid" style="grid-template-columns; column-gap; row-gap">
```
