# Avatar

Image or initials for a person or entity. Falls back to initials automatically when there is no image or it fails to load, with a stable per-name background hue.

```svelte
<script>
	import { Avatar } from '@ethan/designbook';
</script>

<Avatar name="Ada Lovelace" />
<Avatar name="Ada Lovelace" src="/ada.jpg" size="lg" />
<Avatar name="Acme Corp" shape="square" />
```

## Props

| Prop    | Type                                   | Default    | Description                                          |
| ------- | -------------------------------------- | ---------- | ---------------------------------------------------- |
| `src`   | `string`                               | —          | Image URL.                                           |
| `name`  | `string`                               | —          | Used for initials, the hue and the accessible label. |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`     | 24 / 32 / 40 / 56 / 80px.                            |
| `shape` | `'circle' \| 'square'`                 | `'circle'` |                                                      |
| `class` | `string`                               | —          |                                                      |

All other props are forwarded to the root `<span>`. The `initials(name)` helper is also exported.

## Snippets

None.

## Keyboard

Not interactive.

## Accessibility

- Root has `role="img"` and `aria-label={name}`; the inner `<img>` has an empty `alt` so the name is announced once.
- Initials are `aria-hidden`.

## Tokens used

`--color-accent-subtle`, `--color-accent-text` (hue-rotated via `oklch(from …)`), `--radius-*`, `--font-body`, `--weight-semibold`

## Anatomy

```
<span class="db-avatar" role="img" data-size data-shape style="--_hue">
  <img class="db-avatar__img"> | <span class="db-avatar__initials">
```
