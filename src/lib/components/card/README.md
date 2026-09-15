# Card

A surface that groups related content. Three variants (outlined, elevated, filled), optional header and footer rows, and an interactive mode for clickable cards.

```svelte
<script>
	import { Card, Heading, Text, Button } from '@ethan/designbook';
</script>

<Card>
	{#snippet header()}<Heading level={3} size="sm">Account</Heading>{/snippet}
	<Text>Body content.</Text>
	{#snippet footer()}<Button size="sm">Save</Button>{/snippet}
</Card>

<Card href="/orders/42" variant="elevated">Clickable card</Card>
<Card padding="none"><table>…</table></Card>
```

## Props

| Prop          | Type                                             | Default      | Description                                      |
| ------------- | ------------------------------------------------ | ------------ | ------------------------------------------------ |
| `as`          | `'div' \| 'section' \| 'article' \| 'li' \| 'a'` | `'div'`      | Element (becomes `a` automatically with `href`). |
| `variant`     | `'outlined' \| 'elevated' \| 'filled'`           | `'outlined'` |                                                  |
| `padding`     | `'none' \| 'sm' \| 'md' \| 'lg'`                 | `'md'`       | Inner padding; `none` for edge-to-edge content.  |
| `interactive` | `boolean`                                        | `false`      | Hover/focus affordance. Implied by `href`.       |
| `href`        | `string`                                         | —            | Render as a link.                                |
| `class`       | `string`                                         | —            |                                                  |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description                        |
| ---------- | ---------------------------------- |
| `header`   | Top row, separated by a rule.      |
| `children` | Body.                              |
| `footer`   | Bottom row on a subtle background. |

## Keyboard

| Key     | Action                              |
| ------- | ----------------------------------- |
| `Tab`   | Focuses the card when it is a link. |
| `Enter` | Follows the link.                   |

## Accessibility

- A card with `href` is a single link; keep interactive children out of it (nested interactive elements are invalid).
- Use `as="article"` or `as="section"` with a heading for content cards so the outline stays meaningful.

## Tokens used

`--color-surface`, `--color-bg-subtle`, `--color-border*`, `--shadow-md`, `--radius-lg`, `--space-*`, `--focus-ring`, `--transition-*`

## Anatomy

```
<div class="db-card" data-variant data-padding [data-interactive]>
  <div class="db-card__header">
  <div class="db-card__body">
  <div class="db-card__footer">
```
