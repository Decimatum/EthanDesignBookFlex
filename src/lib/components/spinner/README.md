# Spinner

Indeterminate loading indicator. Inherits `currentColor` and scales with font size, so it drops into buttons, inputs and text without configuration.

```svelte
<script>
	import { Spinner } from '@ethan/designbook';
</script>

<Spinner />
<Spinner size="2rem" label="Loading orders" />
```

## Props

| Prop    | Type             | Default     | Description                                                                          |
| ------- | ---------------- | ----------- | ------------------------------------------------------------------------------------ |
| `size`  | `string`         | `'1em'`     | Diameter, any CSS length.                                                            |
| `label` | `string \| null` | `'Loading'` | Accessible name (`role="status"`). Pass `null` to hide it from assistive technology. |
| `class` | `string`         | —           | Extra classes on the root `<svg>`.                                                   |

All other props are forwarded to the `<svg>` element.

## Accessibility

- Renders `role="status"` with `aria-label` by default so screen readers announce it once.
- Pass `label={null}` when a parent already announces loading (Button does this and sets `aria-busy`).
- Honours `prefers-reduced-motion` by slowing the rotation rather than removing it, since a frozen spinner reads as broken.

## Tokens used

`--duration-slower`
