# Ticker

A continuously scrolling strip of labelled figures — the market tape. Use it for a watchlist, headline rates, or any short list of live numbers that should be glanceable without taking vertical space. It is a `role="marquee"` region with a pause button (WCAG 2.2.2), pauses on hover and focus, and under `prefers-reduced-motion` it stops entirely and becomes a plain horizontally scrollable row. Values that change flash briefly so movement is visible without a chart. For a list the user must read fully, use `Table` instead.

```svelte
<script>
	import { Ticker } from '@ethan/designbook';
	let items = $state([
		{ id: 'nvda', label: 'NVDA', value: 902.5, change: 1.24 },
		{ id: 'aapl', label: 'AAPL', value: 189.9, change: -0.42 },
		{
			id: 'btc',
			label: 'BTC',
			value: 64210,
			change: 1850,
			changeFormat: 'currency',
			href: '/q/btc'
		}
	]);
</script>

<Ticker {items} label="Watchlist" speed={50} />
```

## Props

| Prop           | Type                         | Default    | Description                                                                          |
| -------------- | ---------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `items`        | `TickerItem[]`               | —          | **Required.** `{ id, label, value, change?, changeFormat?, href? }`.                 |
| `speed`        | `number`                     | `40`       | Pixels per second. Duration is derived from the measured content width.              |
| `direction`    | `'left' \| 'right'`          | `'left'`   |                                                                                      |
| `pauseOnHover` | `boolean`                    | `true`     | Also pauses while focus is inside the strip.                                         |
| `paused`       | `boolean`                    | `false`    | Bindable; the pause button toggles it.                                               |
| `controls`     | `boolean`                    | `true`     | Show the pause / play button. Only turn it off if you supply your own pause control. |
| `label`        | `string`                     | `'Ticker'` | Accessible name of the region.                                                       |
| `size`         | `'sm' \| 'md'`               | `'md'`     |                                                                                      |
| `digits`       | `number`                     | `2`        | Decimals for numeric `value`s (and number/currency changes).                         |
| `locale`       | `string`                     | browser    |                                                                                      |
| `currency`     | `string`                     | `'USD'`    | For `changeFormat: 'currency'`.                                                      |
| `flash`        | `boolean`                    | `true`     | Tint an item for 800 ms when its numeric value changes.                              |
| `onItemClick`  | `(item: TickerItem) => void` | —          | Makes items without `href` buttons.                                                  |
| `class`        | `string`                     | —          |                                                                                      |

`TickerItem.value` may be a string (shown as-is) or a number (formatted with `digits`). `change` renders as a `Delta` (`percent` by default).

## Keyboard

| Key             | Action                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `Tab`           | Through the items of the first copy (links/buttons), then the pause button. Focus inside pauses the strip. |
| `Enter`/`Space` | Follow the link or fire `onItemClick`.                                                                     |

## Accessibility

- The root is `role="marquee"` with `aria-label`, which tells screen readers the content moves and is not a live region to announce.
- The loop is built from repeated copies of the item list; only the first copy is exposed — the rest are `aria-hidden` and their links are `tabindex="-1"`.
- A visible pause / play button is always present (`aria-pressed`), and hover or focus pauses the motion as well.
- `prefers-reduced-motion: reduce` disables the animation and the edge fade; the strip becomes a normal, keyboard-focusable scrollable row with a single copy of the items.

## Tokens used

`--color-surface`, `--color-bg-subtle`, `--color-border`, `--color-text*`, `--color-component-hover`, `--color-success-subtle`, `--color-danger-subtle`, `--control-h-*`, `--radius-*`, `--space-*`, `--text-*`, `--font-mono`, `--font-numeric`, `--weight-semibold`, `--focus-ring-inset`, `--transition-colors`

## Anatomy

```
<div class="db-ticker" role="marquee" data-size data-direction [data-paused] [data-reduced]>
  <div class="db-ticker__viewport">
    <div class="db-ticker__track" style="--_duration; --_group-w">
      <ul class="db-ticker__group">            first copy (exposed)
        <li class="db-ticker__item" [data-flash="up|down"]>
          <a|button|span class="db-ticker__link">
            <span class="db-ticker__label"> <span class="db-ticker__value"> <Delta>
      <ul class="db-ticker__group" aria-hidden> …repeated copies
  <button class="db-ticker__control" aria-pressed>
```
