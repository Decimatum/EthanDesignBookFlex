# Progress

A horizontal bar for determinate progress (0–100) or an indeterminate sweep while the length of a task is unknown. For an inline "working…" indicator use Spinner.

```svelte
<script>
	import { Progress } from '@ethan/designbook';
</script>

<Progress value={62} label="Uploading statement.pdf" showValue />
<Progress label="Syncing" />
<!-- indeterminate -->
<Progress value={90} tone="warning" size="sm" aria-label="Margin used" />
```

## Props

| Prop        | Type                                             | Default    | Description                                     |
| ----------- | ------------------------------------------------ | ---------- | ----------------------------------------------- |
| `value`     | `number`                                         | —          | 0–100 (clamped). Omit for an indeterminate bar. |
| `label`     | `string`                                         | —          | Visible label; also the accessible name.        |
| `showValue` | `boolean`                                        | `false`    | Show the rounded percentage beside the label.   |
| `size`      | `'sm' \| 'md' \| 'lg'`                           | `'md'`     |                                                 |
| `tone`      | `'accent' \| 'success' \| 'warning' \| 'danger'` | `'accent'` |                                                 |
| `class`     | `string`                                         | —          |                                                 |

All other props are forwarded to the root element. `aria-label` is applied to the progressbar itself when there is no visible `label`.

## Accessibility

- `role="progressbar"` with `aria-valuemin/max/now`; `aria-valuenow` is omitted while indeterminate.
- Named by the visible label (`aria-labelledby`) or by `aria-label`, falling back to "Progress".
- The indeterminate animation stops under reduced motion.

## Tokens used

`--color-accent`, `--color-success`, `--color-warning`, `--color-danger`, `--color-component`, `--color-text*`, `--space-*`, `--text-sm`, `--weight-medium`, `--radius-full`, `--font-numeric`, `--duration-slow`, `--ease-*`

## Anatomy

```
<div class="db-progress" data-size data-tone>
  <div class="db-progress__meta"><span class="db-progress__label"> <span class="db-progress__value">
  <div class="db-progress__track" role="progressbar" [data-indeterminate]><div class="db-progress__bar">
```
