# Stack

Vertical flex layout with a token-driven gap. The default way to space things top-to-bottom; reach for it before writing `margin`.

```svelte
<script>
	import { Stack } from '@ethan/designbook';
</script>

<Stack gap="6">
	<Heading>Title</Heading>
	<Text>Body</Text>
</Stack>
```

## Props

| Prop      | Type                                                                               | Default | Description                                  |
| --------- | ---------------------------------------------------------------------------------- | ------- | -------------------------------------------- |
| `as`      | `'div' \| 'section' \| 'article' \| 'ul' \| 'ol' \| 'nav' \| 'form' \| 'fieldset'` | `'div'` | Element to render. Lists lose their bullets. |
| `gap`     | `Space` (`'0'`…`'32'`)                                                             | `'4'`   | Gap from the spacing scale.                  |
| `align`   | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`                          | —       | Cross-axis alignment.                        |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'`                | —       | Main-axis distribution.                      |
| `class`   | `string`                                                                           | —       | Extra classes.                               |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | Items.      |

## Keyboard

Not interactive.

## Accessibility

- Pure layout; no roles added. Use `as="ul"` with `<li>` children for real lists.

## Tokens used

`--space-*`

## Anatomy

```
<div class="db-stack" style="--_gap">
```
