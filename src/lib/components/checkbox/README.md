# Checkbox

A native checkbox with a custom box. Supports an indeterminate state for "select all" and an optional description line.

```svelte
<script>
	import { Checkbox } from '@ethan/designbook';
	let agreed = $state(false);
</script>

<Checkbox bind:checked={agreed}>I agree to the terms</Checkbox>
<Checkbox description="Get a summary every Monday.">Weekly digest</Checkbox>
<Checkbox indeterminate>Select all</Checkbox>
```

## Props

| Prop                              | Type           | Default    | Description                                    |
| --------------------------------- | -------------- | ---------- | ---------------------------------------------- |
| `checked`                         | `boolean`      | `false`    | Bindable.                                      |
| `indeterminate`                   | `boolean`      | `false`    | Mixed state (visual + `aria-checked="mixed"`). |
| `size`                            | `'sm' \| 'md'` | `'md'`     |                                                |
| `invalid`                         | `boolean`      | from Field |                                                |
| `description`                     | `string`       | —          | Secondary line under the label.                |
| `disabled`, `name`, `value`, `id` | native         | from Field |                                                |
| `class`                           | `string`       | —          |                                                |

All other props are forwarded to the native `<input type="checkbox">`.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | The label.  |

## Keyboard

| Key     | Action  |
| ------- | ------- |
| `Space` | Toggle. |

## Accessibility

- The native input stays in the DOM (visually hidden with `.sr-only`), so form submission, labels and screen readers all work normally.
- Focus ring is shown on the custom box via `:focus-visible + .db-checkbox__box`.
- Clicking the label or description toggles the box.

## Tokens used

`--control-border-width`, `--color-border-strong`, `--color-surface`, `--color-accent`, `--color-accent-fg`, `--color-danger`, `--color-text*`, `--radius-sm`, `--focus-ring`, `--duration-fast`, `--ease-spring`

## Anatomy

```
<label class="db-checkbox" data-size [data-invalid] [data-disabled]>
  <input class="db-checkbox__control sr-only" type="checkbox">
  <span class="db-checkbox__box"><svg class="db-checkbox__icon"></span>
  <span class="db-checkbox__text">
    <span class="db-checkbox__label">
    <span class="db-checkbox__description">
```
