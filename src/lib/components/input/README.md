# Input

Single-line text input with optional leading/trailing adornments. Reads label, hint, error, required and disabled from a surrounding Field.

```svelte
<script>
	import { Input, Field } from '@ethan/designbook';
	import { Search } from '@lucide/svelte';
	let q = $state('');
</script>

<Input bind:value={q} placeholder="Search…" aria-label="Search">
	{#snippet leading()}<Search />{/snippet}
</Input>

<Field label="Amount">
	<Input type="number" numeric inputmode="decimal">
		{#snippet leading()}${/snippet}
		{#snippet trailing()}USD{/snippet}
	</Input>
</Field>
```

## Props

| Prop                         | Type                       | Default    | Description                     |
| ---------------------------- | -------------------------- | ---------- | ------------------------------- |
| `value`                      | `string \| number \| null` | `''`       | Bindable.                       |
| `type`                       | `string`                   | `'text'`   | Any native input type.          |
| `size`                       | `'sm' \| 'md' \| 'lg'`     | `'md'`     | Follows the density axis.       |
| `invalid`                    | `boolean`                  | from Field | Danger border + `aria-invalid`. |
| `numeric`                    | `boolean`                  | `false`    | Tabular numerals.               |
| `disabled`, `required`, `id` | native                     | from Field |                                 |
| `class`                      | `string`                   | —          | Extra classes on the wrapper.   |

All other props are forwarded to the native `<input>`.

## Snippets

| Snippet    | Description          |
| ---------- | -------------------- |
| `leading`  | Icon or text before. |
| `trailing` | Icon or text after.  |

## Keyboard

Native text input behaviour.

## Accessibility

- Always provide a label: wrap in Field, or pass `aria-label`.
- Adornments are `aria-hidden`; put meaning in the label or hint, not the icon.
- Focus ring is drawn on the wrapper via `:focus-within` so adornments stay inside it.

## Tokens used

`--control-h-*`, `--control-px-*`, `--control-text-*`, `--control-radius`, `--control-border-width`, `--color-surface`, `--color-border-strong`, `--color-focus`, `--color-danger`, `--color-text*`, `--font-numeric`, `--focus-ring`

## Anatomy

```
<div class="db-input" data-size [data-invalid] [data-disabled] [data-numeric]>
  <span class="db-input__adornment">
  <input class="db-input__control">
  <span class="db-input__adornment">
```
