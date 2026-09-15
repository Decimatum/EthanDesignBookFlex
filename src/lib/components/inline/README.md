# Inline

Horizontal flex layout that wraps by default. Use for button rows, tag clouds, toolbars and metadata lines.

```svelte
<script>
	import { Inline } from '@ethan/designbook';
</script>

<Inline gap="2">
	<Badge>One</Badge>
	<Badge>Two</Badge>
</Inline>

<Inline justify="between" wrap={false}>
	<Text>Left</Text>
	<Button>Right</Button>
</Inline>
```

## Props

| Prop      | Type                                                               | Default    | Description                    |
| --------- | ------------------------------------------------------------------ | ---------- | ------------------------------ |
| `as`      | `'div' \| 'span' \| 'nav' \| 'ul' \| 'ol' \| 'header' \| 'footer'` | `'div'`    | Element to render.             |
| `gap`     | `Space`                                                            | `'3'`      | Gap (both axes when wrapping). |
| `align`   | `Align`                                                            | `'center'` | Cross-axis alignment.          |
| `justify` | `Justify`                                                          | —          | Main-axis distribution.        |
| `wrap`    | `boolean`                                                          | `true`     | Allow wrapping.                |
| `class`   | `string`                                                           | —          |                                |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | Items.      |

## Keyboard

Not interactive.

## Accessibility

- Pure layout. Use `as="nav"` with an `aria-label` for navigation rows.

## Tokens used

`--space-*`

## Anatomy

```
<div class="db-inline" style="--_gap">
```
