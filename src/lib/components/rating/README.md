# Rating

A 1-to-_n_ rating entered as a row of numbered segments — value, confidence, effort, energy, mood. Numbers rather than stars, because a "3" means the same thing on every scale and the step labels say what it means. One tap sets, tapping the current step clears, and the whole thing is one tab stop.

```svelte
<script>
	import { Field, Rating } from '@ethan/designbook';
	let energy = $state(0);
</script>

<Field label="Energy" hint="How you felt on waking">
	<Rating bind:value={energy} labels={['Drained', 'Low', 'Okay', 'Good', 'Full']} />
</Field>
```

## Props

| Prop         | Type                      | Default    | Description                                                                    |
| ------------ | ------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `value`      | `number`                  | `0`        | Bindable. `0` is "not rated".                                                  |
| `max`        | `number`                  | `5`        | Number of steps.                                                               |
| `size`       | `'sm' \| 'md'`            | `'md'`     | Follows the density axis.                                                      |
| `labels`     | `string[]`                | —          | One per step from 1; the step's tooltip and accessible name.                   |
| `readonly`   | `boolean`                 | `false`    | Shows the value, takes no input.                                               |
| `disabled`   | `boolean`                 | from Field |                                                                                |
| `name`       | `string`                  | —          | Renders a hidden input for form submission.                                    |
| `aria-label` | `string`                  | —          | Accessible name when not inside a Field (the Field's label is used otherwise). |
| `onchange`   | `(value: number) => void` | —          | After the value changes by click or key.                                       |
| `class`      | `string`                  | —          |                                                                                |

All other props are forwarded to the root element.

## Keyboard

| Key                       | Does                                |
| ------------------------- | ----------------------------------- |
| `→` `↑`                   | One step up                         |
| `←` `↓`                   | One step down                       |
| `1`–`9`                   | Set that step                       |
| `0` `Backspace` `Delete`  | Clear                               |
| `Home` / `End`            | First / last step                   |
| `Space` `Enter` on a step | Set it (or clear, if it is current) |

## Accessibility

- `role="radiogroup"` with one `role="radio"` per step; `aria-checked` marks the current value. One roving tab stop.
- The accessible name comes from the Field's label (`aria-labelledby`) or `aria-label`.
- Each step's name is its number, plus the label when `labels` is given ("3 — Okay").
- Filled steps differ from empty ones in both colour and border, and the current step is bold, so the value is readable without colour.

## Tokens used

`--control-h-*`, `--control-text-*`, `--control-border-width`, `--control-radius`, `--space-1`, `--color-surface`, `--color-border-strong`, `--color-text-muted`, `--color-accent*`, `--color-bg-subtle`, `--color-component`, `--color-text-disabled`, `--focus-ring`, `--transition-colors`.

## Anatomy

```
.db-rating[role=radiogroup]
  .db-rating__step[role=radio] × max      [data-filled] [data-current]
    .db-rating__number
  input[type=hidden]                      when `name` is set
```
