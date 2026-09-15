# Badge

Small status label. Three variants and six tones cover statuses, counts and categories; a `dot` adds a status indicator.

```svelte
<script>
	import { Badge } from '@ethan/designbook';
</script>

<Badge>Draft</Badge>
<Badge tone="success" dot>Live</Badge>
<Badge variant="solid" tone="danger">Failed</Badge>
<Badge variant="outline" tone="accent" pill>Beta</Badge>
```

## Props

| Prop      | Type                                                                    | Default     | Description         |
| --------- | ----------------------------------------------------------------------- | ----------- | ------------------- |
| `variant` | `'soft' \| 'solid' \| 'outline'`                                        | `'soft'`    |                     |
| `tone`    | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` |                     |
| `size`    | `'sm' \| 'md'`                                                          | `'md'`      |                     |
| `dot`     | `boolean`                                                               | `false`     | Leading status dot. |
| `pill`    | `boolean`                                                               | `false`     | Fully rounded.      |
| `class`   | `string`                                                                | —           |                     |

All other props are forwarded to the root `<span>`.

## Snippets

| Snippet    | Description            |
| ---------- | ---------------------- |
| `leading`  | Icon before the label. |
| `children` | The label.             |

## Keyboard

Not interactive. For removable tags use the (upcoming) Tag component.

## Accessibility

- Purely presentational; the label text is the meaning. Don't rely on colour alone — the text should say "Failed", not just be red.
- Icons and the dot are `aria-hidden`.

## Tokens used

`--color-*` for each tone, `--radius-sm`, `--radius-full`, `--text-xs`, `--weight-medium`, `--space-*`

## Anatomy

```
<span class="db-badge" data-variant data-tone data-size [data-pill]>
  <span class="db-badge__dot">
  <span class="db-badge__icon">
```
