# Text

Body text with size, weight and tone from tokens. Also handles the recurring needs of application text: tabular numerals, truncation and line clamping.

```svelte
<script>
	import { Text } from '@ethan/designbook';
</script>

<Text>Regular paragraph.</Text>
<Text size="sm" tone="muted">Helper copy.</Text>
<Text as="span" weight="semibold" numeric>1,234.56</Text>
<Text tone="negative" numeric>−2.31%</Text>
<Text lines={2}>Long description clamped to two lines…</Text>
```

## Props

| Prop       | Type                                                                                                                                    | Default     | Description                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `as`       | `'p' \| 'span' \| 'div' \| 'label' \| 'strong' \| 'em' \| 'small' \| 'dt' \| 'dd' \| 'li' \| 'figcaption'`                              | `'p'`       |                                                         |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                                                  | `'md'`      |                                                         |
| `weight`   | `'regular' \| 'medium' \| 'semibold' \| 'bold'`                                                                                         | `'regular'` |                                                         |
| `tone`     | `'default' \| 'muted' \| 'subtle' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'positive' \| 'negative' \| 'inherit'` | `'default'` | Colour. `positive`/`negative` are for financial deltas. |
| `align`    | `'start' \| 'center' \| 'end'`                                                                                                          | —           |                                                         |
| `mono`     | `boolean`                                                                                                                               | `false`     | Monospace family.                                       |
| `numeric`  | `boolean`                                                                                                                               | `false`     | Tabular numerals.                                       |
| `truncate` | `boolean`                                                                                                                               | `false`     | Single-line ellipsis.                                   |
| `lines`    | `number`                                                                                                                                | —           | Clamp to N lines.                                       |
| `class`    | `string`                                                                                                                                | —           |                                                         |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | The text.   |

## Keyboard

Not interactive.

## Accessibility

- Tone colours meet 4.5:1 against the page background in every theme and scheme.
- Truncation hides content visually only; provide a `title` or tooltip when the full text matters.

## Tokens used

`--font-body`, `--font-mono`, `--font-numeric`, `--text-*`, `--weight-*`, `--leading-*`, `--color-text*`, `--color-*-text`

## Anatomy

```
<p class="db-text" data-size data-weight data-tone [data-mono] [data-numeric] [data-truncate] [data-clamp]>
```
