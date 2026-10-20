# Slider

Pick a number, or a range, by dragging along a track. Built on Bits UI's Slider for pointer, keyboard and touch handling. Use Input with `type="number"` when the exact value matters more than the gesture.

```svelte
<script>
	import { Slider, Field } from '@ethan/designbook';
	let volume = $state(40);
	let range = $state([20, 60]);
</script>

<Slider bind:value={volume} label="Volume" showValue format={(v) => `${v}%`} />
<Slider bind:value={range} min={0} max={100} step={5} ticks={5} aria-label="Price range" />

<Field label="Risk per trade" hint="Percent of equity">
	<Slider bind:value={risk} max={5} step={0.25} showValue />
</Field>
```

## Props

| Prop            | Type                        | Default   | Description                                               |
| --------------- | --------------------------- | --------- | --------------------------------------------------------- |
| `value`         | `number \| number[]`        | `0`       | Bindable. An array renders one thumb per entry (a range). |
| `min` / `max`   | `number`                    | `0`/`100` |                                                           |
| `step`          | `number`                    | `1`       | Keyboard and snap increment.                              |
| `disabled`      | `boolean`                   | `false`   | Also inherited from a surrounding Field.                  |
| `size`          | `'sm' \| 'md'`              | `'md'`    |                                                           |
| `label`         | `string`                    | —         | Visible label above the track; names the thumb(s).        |
| `showValue`     | `boolean`                   | `false`   | Show the current value(s) beside the label.               |
| `format`        | `(value: number) => string` | `String`  | Formats the shown value.                                  |
| `ticks`         | `number`                    | `0`       | Evenly spaced tick marks under the track (decorative).    |
| `aria-label`    | `string`                    | —         | Thumb name when there is no `label` and no Field.         |
| `name`          | `string`                    | —         | Renders hidden inputs for native form submission.         |
| `onValueChange` | `(value) => void`           | —         | Every change, including while dragging.                   |
| `onValueCommit` | `(value) => void`           | —         | When the user releases the thumb or finishes a key press. |
| `class`         | `string`                    | —         |                                                           |

## Keyboard

| Key            | Action                 |
| -------------- | ---------------------- |
| `← →` / `↓ ↑`  | Move by one `step`.    |
| `Page Up/Down` | Move by ten steps.     |
| `Home` / `End` | Jump to `min` / `max`. |

## Accessibility

- Each thumb is `role="slider"` with `aria-valuemin/max/now`, named by `label`, the surrounding Field's label, or `aria-label` (falling back to "Value", or "Minimum"/"Maximum" for a range).
- Inside a Field, the hint or error is wired as `aria-describedby` and `disabled` is inherited.
- Ticks are decorative (`aria-hidden`); the value itself is announced from the thumb.

## Tokens used

`--color-component`, `--color-accent*`, `--color-surface`, `--color-border-strong`, `--color-text*`, `--space-*`, `--text-sm`, `--weight-medium`, `--radius-full`, `--shadow-sm`, `--focus-ring`, `--font-numeric`, `--duration-fast`, `--ease-standard`

## Anatomy

```
<div class="db-slider" data-size [data-disabled]>
  <div class="db-slider__meta"><span class="db-slider__label"> <span class="db-slider__value">
  <span class="db-slider__root" [data-ticks]>
    <span class="db-slider__track"><span class="db-slider__range">
    <span class="db-slider__thumb" role="slider">
    <span class="db-slider__ticks"><span class="db-slider__tick">
  <input type="hidden">
```
