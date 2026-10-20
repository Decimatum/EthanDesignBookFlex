# Combobox

A text input that filters a list as you type — for long or searchable lists where Select's fixed menu would be tedious. `multiple` turns it into a multi-select with removable chips. Built on Bits UI's Combobox; integrates with Field like Input.

```svelte
<script>
	import { Combobox, Field } from '@ethan/designbook';
	const tickers = [
		{ value: 'msft', label: 'Microsoft', group: 'Tech', keywords: 'MSFT' },
		{ value: 'jpm', label: 'JPMorgan', group: 'Finance', keywords: 'JPM' }
	];
	let ticker = $state('');
	let watchlist = $state([]);
</script>

<Field label="Ticker" hint="Type a name or symbol">
	<Combobox items={tickers} bind:value={ticker} name="ticker" />
</Field>

<Combobox
	items={tickers}
	bind:value={watchlist}
	multiple
	aria-label="Watchlist"
	placeholder="Add symbols…"
/>
```

## Props

| Prop                                | Type                                  | Default        | Description                                                      |
| ----------------------------------- | ------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `items`                             | `ComboboxItem[]`                      | —              | **Required.** `{ value, label, disabled?, group?, keywords? }`.  |
| `value`                             | `string \| string[]`                  | —              | Bindable; an array when `multiple`.                              |
| `multiple`                          | `boolean`                             | `false`        | Chosen items render as chips; the list stays open between picks. |
| `placeholder`                       | `string`                              | `'Search…'`    |                                                                  |
| `size`                              | `'sm' \| 'md' \| 'lg'`                | `'md'`         |                                                                  |
| `invalid` / `disabled` / `required` | `boolean`                             | from Field     |                                                                  |
| `name`                              | `string`                              | —              | Hidden input(s) for native form submission.                      |
| `id`                                | `string`                              | from Field     |                                                                  |
| `emptyText`                         | `string`                              | `'No matches'` |                                                                  |
| `filter`                            | `(item, query) => boolean`            | contains       | Default matches `label` or `keywords`, case-insensitive.         |
| `onValueChange`                     | `(value: string \| string[]) => void` | —              |                                                                  |
| `aria-label`                        | `string`                              | —              | Name when not inside a Field.                                    |
| `class`                             | `string`                              | —              |                                                                  |

Snippet: `leading` (icon inside the field, before the text).

`value` is read at mount to fill the input with the selected label; later programmatic changes to `value` update the selection but not the text until the list next closes.

## Keyboard

| Key         | Action                                                     |
| ----------- | ---------------------------------------------------------- |
| Type        | Opens the list and filters it.                             |
| `↓` / `↑`   | Open the list / move the highlight.                        |
| `Enter`     | Select the highlighted item.                               |
| `Escape`    | Close; the input reverts to the selected label.            |
| `Backspace` | In `multiple`, with an empty input, removes the last chip. |

## Accessibility

- The input has `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-activedescendant` from Bits UI; options are `role="option"` in a `listbox`.
- Inside a Field the label, hint/error and `invalid`/`disabled`/`required` are wired automatically. Outside one, pass `aria-label`.
- Chip remove buttons are labelled "Remove {label}" and skipped by Tab (use Backspace) so a long selection doesn't add a tab stop per chip.

## Tokens used

`--color-surface`, `--color-surface-overlay`, `--color-border*`, `--color-component*`, `--color-text*`, `--color-accent-text`, `--color-danger`, `--color-focus`, `--control-*`, `--space-*`, `--text-*`, `--radius-*`, `--shadow-lg`, `--focus-ring`, `--z-popover`, `--duration-*`, `--ease-*`

## Anatomy

```
<div class="db-combobox" data-size [data-invalid] [data-disabled] [data-multiple] [data-open]>
  <span class="db-combobox__adornment">
  <span class="db-combobox__chip"><span class="db-combobox__chip-label"> <button class="db-combobox__chip-remove">
  <input class="db-combobox__input" role="combobox">
  <button class="db-combobox__toggle">
<input type="hidden">
<div class="db-combobox__content" role="listbox"><div class="db-combobox__viewport">
  <div class="db-combobox__group-label">
  <div class="db-combobox__item" role="option" [data-highlighted] [data-selected] [data-disabled]>
  <div class="db-combobox__empty">
```
