# Table

A data table driven by a column definition: sortable headers, numeric columns with tabular figures, custom cell snippets, clickable rows and an empty state. Sorting is client-side by default; pass `onSort` to take over (server-side paging, large data).

```svelte
<script lang="ts">
	import { Table, type TableColumn, type SortState } from '@ethan/designbook';

	interface Position {
		id: number;
		symbol: string;
		qty: number;
		pnl: number;
	}
	const rows: Position[] = load();
	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', header: 'Symbol', sortable: true },
		{ key: 'qty', header: 'Qty', numeric: true, sortable: true },
		{ key: 'pnl', header: 'P&L', numeric: true, sortable: true, cell: pnl }
	];
	let sort = $state<SortState>({ key: 'pnl', direction: 'desc' });
</script>

{#snippet pnl(row: Position)}
	<span class={row.pnl < 0 ? 'negative' : 'positive'}>{row.pnl.toFixed(2)}</span>
{/snippet}

<Table {columns} {rows} rowKey={(r) => r.id} bind:sort caption="Open positions" stickyHeader />
```

## Props

| Prop           | Type                                          | Default     | Description                                                         |
| -------------- | --------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `columns`      | `TableColumn<T>[]`                            | —           | **Required.** See below.                                            |
| `rows`         | `T[]`                                         | —           | **Required.**                                                       |
| `rowKey`       | `(row: T, index: number) => string \| number` | index       | Stable key per row; use an id whenever rows can reorder.            |
| `sort`         | `SortState`                                   | —           | Bindable `{ key, direction }`. Applied client-side unless `onSort`. |
| `onSort`       | `(sort: SortState) => void`                   | —           | Take over sorting: rows are then rendered as given.                 |
| `onRowClick`   | `(row: T) => void`                            | —           | Makes rows focusable and activatable with Enter/Space.              |
| `caption`      | `string`                                      | —           | Visually hidden `<caption>`; the table's accessible name.           |
| `stickyHeader` | `boolean`                                     | `false`     | Header stays put while the wrapper scrolls.                         |
| `striped`      | `boolean`                                     | `false`     |                                                                     |
| `emptyText`    | `string`                                      | `'No data'` | Shown in a single full-width cell when `rows` is empty.             |
| `empty`        | `Snippet`                                     | —           | Rendered instead of `emptyText` (e.g. an `EmptyState`).             |
| `class`        | `string`                                      | —           | Applied to the scrolling wrapper.                                   |

### `TableColumn<T>`

| Field       | Type                                   | Description                                                      |
| ----------- | -------------------------------------- | ---------------------------------------------------------------- |
| `key`       | `string`                               | Row property to display and sort by, or a unique id with `cell`. |
| `header`    | `string`                               |                                                                  |
| `align`     | `'start' \| 'center' \| 'end'`         | Defaults to `end` for numeric columns.                           |
| `numeric`   | `boolean`                              | Tabular figures, right-aligned.                                  |
| `sortable`  | `boolean`                              | Renders the header as a toggle button.                           |
| `width`     | `string`                               | CSS width.                                                       |
| `cell`      | `Snippet<[T]>`                         | Custom renderer; default is `String(row[key])`, nullish → empty. |
| `sortValue` | `(row: T) => string \| number \| null` | Custom sort accessor. Nullish values always sort last.           |

Numbers sort numerically; everything else uses `localeCompare` with `numeric: true`, so `'v10'` sorts after `'v9'`.

## Keyboard

| Key               | Action                                           |
| ----------------- | ------------------------------------------------ |
| `Tab`             | Sortable headers, then clickable rows, in order. |
| `Enter` / `Space` | Toggle sort on a header, or activate a row.      |

## Accessibility

- A real `<table>` with `<th scope="col">`; sortable headers carry `aria-sort`.
- Give every table a `caption` so screen readers can name it.
- Row click handlers are also reachable from the keyboard (`tabindex="0"` + Enter/Space). Keep the primary action available elsewhere too (a link or button in a cell) if rows carry more than one action.

## Tokens used

`--color-surface`, `--color-bg-subtle`, `--color-border`, `--color-component`, `--color-text*`, `--color-accent-text`, `--control-h-md`, `--row-h`, `--space-*`, `--text-sm`, `--radius-*`, `--font-numeric`, `--focus-ring*`, `--z-raised`, `--transition-colors`

## Anatomy

```
<div class="db-table-wrap" [data-sticky]>
  <table class="db-table" [data-striped] [data-clickable]>
    <caption class="sr-only">
    <thead class="db-table__head"><tr><th class="db-table__th" data-align [aria-sort]>
      <button class="db-table__sort"> <span> <span class="db-table__sort-icon">
    <tbody><tr class="db-table__row"><td class="db-table__td" data-align [data-numeric]>
           <tr><td class="db-table__empty">
```
