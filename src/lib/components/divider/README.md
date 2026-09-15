# Divider

A hairline separator, horizontal or vertical, with an optional centred label.

```svelte
<script>
	import { Divider } from '@ethan/designbook';
</script>

<Divider spacing="4" />
<Divider>or</Divider>

<Inline>
	<Text>Left</Text>
	<Divider orientation="vertical" />
	<Text>Right</Text>
</Inline>
```

## Props

| Prop          | Type                         | Default        | Description                       |
| ------------- | ---------------------------- | -------------- | --------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |                                   |
| `spacing`     | `Space`                      | `'0'`          | Margin on the perpendicular axis. |
| `class`       | `string`                     | —              |                                   |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description                       |
| ---------- | --------------------------------- |
| `children` | Optional label (horizontal only). |

## Keyboard

Not interactive.

## Accessibility

- Renders `role="separator"` with `aria-orientation`.

## Tokens used

`--color-border`, `--color-text-subtle`, `--text-sm`, `--space-*`

## Anatomy

```
<div class="db-divider" role="separator" data-orientation [data-labelled]>
  <span class="db-divider__label">
```
