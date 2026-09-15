# Heading

Semantic heading (h1–h6) in the theme's display face. Visual size is decoupled from the level so document outlines stay correct while the design does what it needs.

```svelte
<script>
	import { Heading } from '@ethan/designbook';
</script>

<Heading level={1}>Page title</Heading>
<Heading level={2} size="sm" plain>Section label</Heading>
<Heading level={3} size="display">Big number</Heading>
```

## Props

| Prop       | Type                                                         | Default      | Description                                         |
| ---------- | ------------------------------------------------------------ | ------------ | --------------------------------------------------- |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                                 | `2`          | Semantic level; picks a default size.               |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'display'` | from `level` | Visual size override.                               |
| `tone`     | `'default' \| 'muted' \| 'accent'`                           | `'default'`  |                                                     |
| `align`    | `'start' \| 'center' \| 'end'`                               | —            |                                                     |
| `plain`    | `boolean`                                                    | `false`      | Body font instead of display font (section labels). |
| `truncate` | `boolean`                                                    | `false`      | Single-line ellipsis.                               |
| `class`    | `string`                                                     | —            |                                                     |

Default sizes by level: 1 → `xl`, 2 → `lg`, 3 → `md`, 4 → `sm`, 5/6 → `xs`.

All other props are forwarded to the heading element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | The text.   |

## Keyboard

Not interactive.

## Accessibility

- Always choose `level` for document structure, then adjust `size` for looks; never skip levels for visual reasons.

## Tokens used

`--font-display`, `--font-display-*`, `--font-features-display`, `--text-*`, `--leading-*`, `--color-text*`, `--color-accent-text`

## Anatomy

```
<h2 class="db-heading" data-size data-tone [data-plain] [data-truncate]>
```
