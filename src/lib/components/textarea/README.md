# Textarea

Multi-line text input. Optional auto-resize grows with content instead of scrolling.

```svelte
<script>
	import { Textarea, Field } from '@ethan/designbook';
	let notes = $state('');
</script>

<Field label="Notes" hint="Markdown supported">
	<Textarea bind:value={notes} rows={4} />
</Field>

<Textarea aria-label="Comment" autoResize placeholder="Write a comment…" />
```

## Props

| Prop                         | Type             | Default    | Description                                  |
| ---------------------------- | ---------------- | ---------- | -------------------------------------------- |
| `value`                      | `string \| null` | `''`       | Bindable.                                    |
| `rows`                       | `number`         | `3`        | Initial visible rows.                        |
| `autoResize`                 | `boolean`        | `false`    | Grow to fit content; disables manual resize. |
| `invalid`                    | `boolean`        | from Field |                                              |
| `disabled`, `required`, `id` | native           | from Field |                                              |
| `class`                      | `string`         | —          |                                              |

All other props are forwarded to the native `<textarea>`.

## Snippets

None.

## Keyboard

Native textarea behaviour.

## Accessibility

- Label via Field or `aria-label`.
- `aria-invalid` and `aria-describedby` come from Field.

## Tokens used

`--control-h-md`, `--control-px-md`, `--control-text-md`, `--input-py`, `--control-radius`, `--color-surface`, `--color-border-strong`, `--color-focus`, `--color-danger`, `--focus-ring`

## Anatomy

```
<textarea class="db-textarea" [data-invalid] [data-auto-resize]>
```
