# EmptyState

What a list, table or page shows when there is nothing in it yet: a title, an explanation and the action that fills it. Use it inside Table's `empty` snippet, a Card, or a full page.

```svelte
<script>
	import { EmptyState, Button } from '@ethan/designbook';
	import { Inbox } from '@lucide/svelte';
</script>

<EmptyState title="No open orders" description="Orders you place will appear here until they fill.">
	{#snippet icon()}<Inbox />{/snippet}
	{#snippet actions()}
		<Button>New order</Button>
		<Button variant="ghost" tone="neutral">Import</Button>
	{/snippet}
</EmptyState>
```

## Props

| Prop          | Type                   | Default | Description            |
| ------------- | ---------------------- | ------- | ---------------------- |
| `title`       | `string`               | —       | **Required.**          |
| `description` | `string`               | —       |                        |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Padding and icon size. |
| `class`       | `string`               | —       |                        |

Snippets: `icon` (decorative, hidden from assistive tech), `actions` (buttons, laid out in a row). All other props are forwarded to the root element.

## Accessibility

- The title is a paragraph, not a heading, so an empty state never disturbs the page outline. Put a real heading above it when the empty state is the whole page.
- The icon is `aria-hidden`; the title and description carry the meaning.

## Tokens used

`--color-text*`, `--font-display*`, `--space-*`, `--text-*`, `--leading-normal`

## Anatomy

```
<div class="db-empty-state" data-size>
  <div class="db-empty-state__icon" aria-hidden="true">
  <p class="db-empty-state__title">
  <p class="db-empty-state__description">
  <div class="db-empty-state__actions">
```
