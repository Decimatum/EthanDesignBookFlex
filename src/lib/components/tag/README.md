# Tag

A pill for user-controlled labels: filter chips, selected options, categories on an item. It can be static, removable (`onRemove`), or a toggle (`onSelect`). For read-only status use Badge.

```svelte
<script>
	import { Tag } from '@ethan/designbook';
	let filters = $state(['Tech', 'Energy']);
	let onlyOpen = $state(false);
</script>

{#each filters as f (f)}
	<Tag onRemove={() => (filters = filters.filter((x) => x !== f))}>{f}</Tag>
{/each}

<Tag bind:selected={onlyOpen} onSelect={(s) => console.log(s)} tone="accent">Open only</Tag>
```

## Props

| Prop       | Type                                                                    | Default     | Description                                         |
| ---------- | ----------------------------------------------------------------------- | ----------- | --------------------------------------------------- |
| `tone`     | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` |                                                     |
| `size`     | `'sm' \| 'md'`                                                          | `'md'`      |                                                     |
| `onRemove` | `() => void`                                                            | —           | Adds a "Remove" button. The caller removes the tag. |
| `selected` | `boolean`                                                               | `false`     | Bindable; only meaningful with `onSelect`.          |
| `onSelect` | `(selected: boolean) => void`                                           | —           | Makes the body a toggle button (`aria-pressed`).    |
| `disabled` | `boolean`                                                               | `false`     |                                                     |
| `class`    | `string`                                                                | —           |                                                     |

Snippets: `leading` (icon), `children` (label). All other props are forwarded to the root `<span>`.

## Keyboard

`Tab` reaches the toggle and the remove button separately; `Enter`/`Space` activates either.

## Accessibility

- A selectable tag is a real `<button aria-pressed>`; a static tag is plain text.
- The remove button is labelled "Remove"; give surrounding context (a heading or `aria-label` on the list) so "Remove" is unambiguous.
- Selected state inverts to the solid neutral colour so it is not conveyed by colour alone.

## Tokens used

`--color-component`, `--color-border`, `--color-neutral*`, `--color-*-subtle/-text/-border`, `--space-*`, `--text-*`, `--weight-medium`, `--radius-full`, `--focus-ring-inset`, `--transition-colors`

## Anatomy

```
<span class="db-tag" data-tone data-size [data-selected] [data-disabled] [data-removable]>
  <span|button class="db-tag__body [db-tag__toggle]"><span class="db-tag__icon"> <span class="db-tag__label">
  <button class="db-tag__remove" aria-label="Remove">
```
