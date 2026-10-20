# NumberInput

A numeric field with step buttons, keyboard stepping and locale-aware formatting. Use it for quantities, prices, percentages and sizes — anywhere a plain `<input type="number">` would be too loose (it accepts `e`, ignores formatting and looks different in every browser). Editing shows the plain number; on blur the committed value is displayed with grouping, a currency symbol or a percent sign. For free text that happens to contain digits (phone numbers, card numbers, postcodes) use `Input` with `numeric` instead.

```svelte
<script>
	import { NumberInput, Field } from '@ethan/designbook';
	let qty = $state(1);
	let price = $state(1234.5);
</script>

<Field label="Quantity">
	<NumberInput bind:value={qty} min={1} max={99} controls="split" />
</Field>

<Field label="Limit price">
	<NumberInput bind:value={price} step={0.01} format="currency" currency="USD" />
</Field>
```

## Props

| Prop                                                    | Type                                              | Default     | Description                                                                 |
| ------------------------------------------------------- | ------------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `value`                                                 | `number \| null`                                  | `null`      | Bindable. `null` when empty.                                                |
| `min`, `max`                                            | `number`                                          | —           | Bounds; typed and stepped values are clamped on commit.                     |
| `step`                                                  | `number`                                          | `1`         | Increment for arrows and buttons. Its decimals set the default `precision`. |
| `precision`                                             | `number`                                          | from `step` | Decimal places the value is rounded to.                                     |
| `format`                                                | `'plain' \| 'decimal' \| 'currency' \| 'percent'` | `'plain'`   | Display when not editing. `percent` shows `50` as `50%`.                    |
| `currency`                                              | `string`                                          | `'USD'`     | ISO code for `format="currency"`.                                           |
| `locale`                                                | `string`                                          | browser     | Decides grouping and decimal separators for display _and_ parsing.          |
| `controls`                                              | `'stacked' \| 'split' \| 'none'`                  | `'stacked'` | Chevrons at the end, − / + either side, or none.                            |
| `size`                                                  | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Follows the density axis.                                                   |
| `invalid`                                               | `boolean`                                         | from Field  | Danger border + `aria-invalid`.                                             |
| `name`                                                  | `string`                                          | —           | Renders a hidden input carrying the numeric value for form submission.      |
| `onValueChange`                                         | `(value: number \| null) => void`                 | —           | Fires on every committed change (typing, stepping, blur).                   |
| `disabled`, `required`, `readonly`, `id`, `placeholder` | native                                            | from Field  |                                                                             |
| `class`                                                 | `string`                                          | —           | Extra classes on the wrapper.                                               |

Other native input attributes are forwarded to the control.

## Snippets

| Snippet    | Description                                      |
| ---------- | ------------------------------------------------ |
| `leading`  | Decorative icon or text before the value (`$`).  |
| `trailing` | Decorative icon or text after the value (`USD`). |

## Keyboard

| Key                 | Action                                  |
| ------------------- | --------------------------------------- |
| `↑` / `↓`           | Step by `step`.                         |
| `Shift` + `↑`/`↓`   | Step by 10 × `step`.                    |
| `PageUp`/`PageDown` | Step by 10 × `step`.                    |
| `Home` / `End`      | Jump to `min` / `max` (when set).       |
| `Enter`             | Commit the typed text without blurring. |

Press and hold a step button to repeat.

## Accessibility

- The control is `role="spinbutton"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an `aria-valuetext` carrying the formatted value ("$1,234.50"), so screen readers announce the meaning, not the digits.
- Step buttons are `aria-hidden` and outside the tab order: the spinbutton already exposes stepping, so they would only add noise. They keep focus in the input when clicked.
- `inputmode` is `numeric` for integers and `decimal` when the step has decimals or negatives are allowed, so mobile keyboards fit.
- Typed text is parsed leniently (grouping separators, currency symbols and stray characters are dropped), so pasting "$1,234.50" works.

## Tokens used

`--color-surface`, `--color-bg-subtle`, `--color-border*`, `--color-focus`, `--color-danger`, `--color-text*`, `--color-component-*`, `--control-h-*`, `--control-px-*`, `--control-text-*`, `--control-radius`, `--control-border-width`, `--font-numeric`, `--focus-ring`, `--transition-colors`

## Anatomy

```
<div class="db-number-input" data-size data-controls [data-invalid] [data-disabled] [data-readonly]>
  [<button class="db-number-input__step" data-direction="down">]     split only
  [<span class="db-number-input__adornment">]                          leading
  <input class="db-number-input__control" role="spinbutton">
  [<span class="db-number-input__adornment">]                          trailing
  [<button class="db-number-input__step" data-direction="up">]       split only
  [<span class="db-number-input__stack"> <button up> <button down> ]   stacked only
  [<input type="hidden" name>]
```
