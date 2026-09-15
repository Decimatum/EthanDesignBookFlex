# Skeleton

Loading placeholder that mirrors the shape of the content it stands in for. Hidden from assistive technology; announce loading with `aria-busy` on the region instead.

```svelte
<script>
	import { Skeleton } from '@ethan/designbook';
</script>

<Skeleton lines={3} />
<Skeleton variant="rect" height="10rem" />
<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
```

## Props

| Prop      | Type                           | Default  | Description                                             |
| --------- | ------------------------------ | -------- | ------------------------------------------------------- |
| `variant` | `'text' \| 'rect' \| 'circle'` | `'text'` |                                                         |
| `lines`   | `number`                       | `1`      | Text lines; the last is shorter when there are several. |
| `width`   | `string`                       | —        | CSS width.                                              |
| `height`  | `string`                       | —        | CSS height.                                             |
| `class`   | `string`                       | —        |                                                         |

All other props are forwarded to the root element.

## Snippets

None.

## Keyboard

Not interactive.

## Accessibility

- `aria-hidden="true"` always. Put `aria-busy="true"` on the container being loaded.
- Shimmer stops under `prefers-reduced-motion`.

## Tokens used

`--color-component`, `--color-component-hover`, `--radius-*`, `--space-2`

## Anatomy

```
<div class="db-skeleton" data-variant aria-hidden="true">
  <span class="db-skeleton__line" [data-last]>
```
