# Select

A single-choice dropdown built on Bits UI's Select, styled to match Input. Takes a flat `items` array (optionally grouped), works inside Field, and submits through a hidden input when given a `name`.

```svelte
<script>
	import { Select, Field } from '@ethan/designbook';
	let ticker = $state();
	const items = [
		{ value: 'aapl', label: 'Apple', group: 'Tech' },
		{ value: 'msft', label: 'Microsoft', group: 'Tech' },
		{ value: 'jpm', label: 'JPMorgan', group: 'Finance' },
		{ value: 'old', label: 'Delisted', disabled: true }
	];
</script>

<Field label="Ticker" hint="Search by typing">
	<Select {items} bind:value={ticker} placeholder="Choose…" name="ticker" />
</Field>
```

## Props

| Prop                         | Type                      | Default     | Description                                 |
| ---------------------------- | ------------------------- | ----------- | ------------------------------------------- |
| `items`                      | `SelectItem[]`            | —           | `{ value, label, disabled?, group? }`.      |
| `value`                      | `string`                  | —           | Bindable.                                   |
| `placeholder`                | `string`                  | `'Select…'` |                                             |
| `size`                       | `'sm' \| 'md' \| 'lg'`    | `'md'`      |                                             |
| `invalid`                    | `boolean`                 | from Field  |                                             |
| `disabled`, `required`, `id` | native                    | from Field  |                                             |
| `name`                       | `string`                  | —           | Renders a hidden input for form submission. |
| `allowDeselect`              | `boolean`                 | `false`     | Re-selecting the chosen item clears it.     |
| `onValueChange`              | `(value: string) => void` | —           |                                             |
| `class`                      | `string`                  | —           |                                             |

## Snippets

| Snippet   | Description            |
| --------- | ---------------------- |
| `leading` | Icon before the value. |

## Keyboard

| Key                     | Action                         |
| ----------------------- | ------------------------------ |
| `Space` / `Enter` / `↓` | Open the list.                 |
| `↑ ↓`                   | Move highlight.                |
| Letters                 | Typeahead.                     |
| `Enter`                 | Choose the highlighted option. |
| `Escape`                | Close without changing.        |

## Accessibility

- The trigger is a `<button>` with `aria-haspopup="listbox"`, `aria-expanded` and (via Field) a real `<label for>`; the list is `role="listbox"` with `role="option"` items and `aria-selected`.
- `aria-invalid` and `aria-describedby` come from Field.

## Tokens used

Same as Input, plus `--z-popover`, `--color-surface-overlay`, `--color-accent-text`, `--shadow-lg`, `--radius-lg`

## Anatomy

```
<button class="db-select" data-size [data-invalid] [data-placeholder]>
  <span class="db-select__adornment"> <span class="db-select__value"> <svg class="db-select__chevron">
<div class="db-select__content" role="listbox" data-state>
  <div class="db-select__viewport">
    <div class="db-select__group-label">
    <div class="db-select__item" role="option" [data-highlighted] [data-selected] [data-disabled]>
      <span class="db-select__item-label"> <svg class="db-select__item-check">
```
