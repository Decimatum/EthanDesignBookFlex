# Pagination

Page controls for long lists and tables. The number of slots stays constant as the page changes, so the control never jumps in width.

```svelte
<script>
	import { Pagination } from '@ethan/designbook';
	let page = $state(1);
</script>

<Pagination bind:page pages={20} />
<Pagination bind:page count={items.length} perPage={25} size="sm" onPageChange={load} />
```

## Props

| Prop           | Type                     | Default        | Description                                          |
| -------------- | ------------------------ | -------------- | ---------------------------------------------------- |
| `page`         | `number`                 | `1`            | Bindable, 1-based current page.                      |
| `pages`        | `number`                 | —              | Total pages. Alternatively pass `count` + `perPage`. |
| `count`        | `number`                 | —              | Total items.                                         |
| `perPage`      | `number`                 | `10`           | Items per page, used with `count`.                   |
| `siblings`     | `number`                 | `1`            | Pages shown either side of the current one.          |
| `size`         | `'sm' \| 'md'`           | `'md'`         |                                                      |
| `onPageChange` | `(page: number) => void` | —              | Called only when the page actually changes.          |
| `label`        | `string`                 | `'Pagination'` | Accessible name of the `<nav>` landmark.             |
| `class`        | `string`                 | —              |                                                      |

## Keyboard

Every page is a button: `Tab` between them, `Enter`/`Space` to activate. Previous/next are disabled at the edges.

## Accessibility

- `<nav aria-label>` with buttons labelled "Page N", "Previous page" and "Next page".
- The current page carries `aria-current="page"`.
- Ellipses are `aria-hidden` text.

## Tokens used

`--color-accent`, `--color-accent-fg`, `--color-component`, `--color-text*`, `--control-h-*`, `--control-radius`, `--space-*`, `--text-*`, `--font-numeric`, `--focus-ring`, `--transition-colors`

## Anatomy

```
<nav class="db-pagination" aria-label data-size>
  <button class="db-pagination__btn" aria-label="Previous page">
  <button class="db-pagination__btn db-pagination__page" [aria-current="page"]>
  <span class="db-pagination__ellipsis">
  <button class="db-pagination__btn" aria-label="Next page">
```
