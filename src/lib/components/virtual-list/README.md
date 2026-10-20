# VirtualList

A scrolling list that renders only the rows in view (plus a small overscan), so a list of ten thousand items costs the same as one of twenty. Rows are absolutely positioned inside a track sized to the whole list, so the scrollbar is honest and `scrollToIndex` is exact. Row heights are fixed by default (`itemHeight`); with `measure` each rendered row is measured and later rows shift accordingly. Dependency-free. For columns, headers and sorting use `Table`; for very long tables use the DataTable layer, which is built on this.

```svelte
<script>
	import { VirtualList } from '@ethan/designbook';
	let list;
	const items = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: `Row ${i}` }));
</script>

<VirtualList bind:this={list} {items} itemHeight={36} height="20rem" divided label="Rows">
	{#snippet row(item, index)}
		<div class="row">{index + 1}. {item.name}</div>
	{/snippet}
</VirtualList>
<button onclick={() => list.scrollToIndex(5000, 'center')}>Jump to 5000</button>
```

## Props

| Prop            | Type                              | Default      | Description                                                                                      |
| --------------- | --------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `items`         | `T[]`                             | —            | **Required.**                                                                                    |
| `row`           | `Snippet<[T, number]>`            | —            | **Required.** Renders one row; the list positions it. Give the content its own padding.          |
| `itemHeight`    | `number`                          | `40`         | Row height in px. With `measure`, only the estimate for rows not yet rendered.                   |
| `measure`       | `boolean`                         | `false`      | Measure rendered rows with a `ResizeObserver` so heights may vary.                               |
| `height`        | `string`                          | `'20rem'`    | Height of the scrolling viewport (any CSS length).                                               |
| `overscan`      | `number`                          | `4`          | Extra rows rendered above and below the viewport.                                                |
| `itemKey`       | `(item: T, index: number) => Key` | index        | Stable key per item. Set it when items are inserted or removed so DOM rows are reused correctly. |
| `label`         | `string`                          | `'List'`     | Accessible name of the scrolling region.                                                         |
| `divided`       | `boolean`                         | `false`      | Hairline between rows.                                                                           |
| `emptyText`     | `string`                          | `'No items'` | Shown when `items` is empty.                                                                     |
| `empty`         | `Snippet`                         | —            | Rendered instead of `emptyText`, e.g. an `EmptyState`.                                           |
| `onRangeChange` | `(range: { start, end }) => void` | —            | Called when the rendered window changes (indices include overscan).                              |
| `onEndReached`  | `() => void`                      | —            | Called once each time the last `endThreshold` rows come into view — load the next page here.     |
| `endThreshold`  | `number`                          | `5`          |                                                                                                  |
| `class`         | `string`                          | —            |                                                                                                  |

### Methods (via `bind:this`)

| Method                        | Description                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `scrollToIndex(index, align)` | `align` is `'start'`, `'center'`, `'end'` or `'nearest'` (default: scroll the least distance, or not at all). |
| `getRange()`                  | The currently rendered `{ start, end }`.                                                                      |

## Snippets

| Snippet | Arguments       |
| ------- | --------------- |
| `row`   | `(item, index)` |
| `empty` | —               |

## Keyboard

The viewport is a focusable scrollable region, so the native keys work: `↑`/`↓`, `PageUp`/`PageDown`, `Home`/`End`, `Space`. Interactive content inside rows is reachable with `Tab` as usual; rows that scroll out of the window are removed from the DOM, so keep focusable controls in rows short-lived or manage focus with `scrollToIndex` first.

## Accessibility

- The root is `role="region"` with `aria-label` and `tabindex="0"` (a scrollable region must be keyboard-focusable — axe `scrollable-region-focusable`). Focus shows the inset ring.
- The track is `role="list"` and every rendered row `role="listitem"` with `aria-setsize` / `aria-posinset`, so assistive tech announces "row 4,312 of 10,000" even though only ~20 rows exist in the DOM.
- Under reduced motion nothing changes: the list has no animation of its own.
- `overflow-anchor: none` prevents the browser's scroll anchoring from fighting the virtual window when rows are swapped.

## Tokens used

`--color-border`, `--color-surface`, `--color-text`, `--color-text-muted`, `--radius-md`, `--focus-ring-inset`, `--space-6`, `--text-sm`.

## Anatomy

```
.db-virtual-list            viewport: role=region, scrolls, height from `height`
  .db-virtual-list__track   ul role=list, height = total of all rows
    .db-virtual-list__row   li, absolutely positioned via transform, one per rendered item
  .db-virtual-list__empty   shown instead of the track when items is empty
```

## Notes

- `measure` costs one `ResizeObserver` entry per rendered row and a prefix-sum rebuild when a height changes; fine for thousands of rows, pointless for fixed-height rows — leave it off when heights are known.
- Before layout (SSR and first paint) a screenful of rows (`12 × itemHeight`) is rendered so prerendered HTML is not empty.
