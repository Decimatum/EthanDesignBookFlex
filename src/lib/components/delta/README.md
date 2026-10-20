# Delta

A signed change — `+3.46%`, `−$1,250.00` — coloured by whether it is good or bad, with an arrow and a screen-reader direction. `invert` handles metrics where up is bad (costs, latency, drawdown).

```svelte
<script>
	import { Delta } from '@ethan/designbook';
</script>

<Delta value={3.456} format="percent" />
<Delta value={-1250} format="currency" currency="USD" />
<Delta value={12} format="percent" invert variant="pill" />
```

## Props

| Prop       | Type                                  | Default    | Description                                 |
| ---------- | ------------------------------------- | ---------- | ------------------------------------------- |
| `value`    | `number`                              | —          | **Required.** Sign sets direction and tone. |
| `format`   | `'number' \| 'percent' \| 'currency'` | `'number'` |                                             |
| `currency` | `string`                              | `'USD'`    | ISO code for `currency`.                    |
| `locale`   | `string`                              | browser    | `Intl.NumberFormat` locale.                 |
| `digits`   | `number`                              | `2`        | Fraction digits.                            |
| `invert`   | `boolean`                             | `false`    | Positive is bad.                            |
| `arrow`    | `boolean`                             | `true`     |                                             |
| `variant`  | `'text' \| 'pill'`                    | `'text'`   |                                             |
| `size`     | `'sm' \| 'md'`                        | `'md'`     |                                             |

Other props are forwarded to the root `<span>`.

## Accessibility

- The arrow is decorative; a visually hidden ", up" / ", down" / ", unchanged" follows the number so direction is never colour-only.
- Uses the `positive`/`negative` text tokens, which pass contrast on subtle fills in every theme.

## Tokens used

`--color-positive-text`, `--color-negative-text`, `--color-success-subtle`, `--color-danger-subtle`, `--color-component`, `--color-text-muted`, `--text-*`, `--weight-medium`, `--font-numeric`, `--radius-full`

## Anatomy

```
<span class="db-delta" data-tone data-direction data-variant data-size>
  <span class="db-delta__arrow"> <span class="db-delta__value"> <span class="sr-only">
```
