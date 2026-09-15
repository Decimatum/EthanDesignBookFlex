# Alert

An inline message that stays in the page: status, warnings, errors, or context the user should read before acting. For transient feedback use Toast instead.

```svelte
<script>
	import { Alert, Button } from '@ethan/designbook';
</script>

<Alert tone="warning" title="Market closed">Orders placed now will queue until the open.</Alert>

<Alert tone="danger" title="Connection lost" dismissible onDismiss={retry}>
	Reconnecting automatically…
	{#snippet actions()}<Button size="sm" tone="danger" variant="soft">Retry now</Button>{/snippet}
</Alert>
```

## Props

| Prop          | Type                                                        | Default  | Description                                    |
| ------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------- |
| `tone`        | `'info' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'info'` |                                                |
| `title`       | `string`                                                    | —        | Bold first line.                               |
| `dismissible` | `boolean`                                                   | `false`  | Adds a close button; the alert removes itself. |
| `onDismiss`   | `() => void`                                                | —        |                                                |
| `icon`        | `Snippet \| null`                                           | by tone  | Replace the icon, or `null` to hide it.        |
| `class`       | `string`                                                    | —        |                                                |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description                |
| ---------- | -------------------------- |
| `children` | The message.               |
| `actions`  | Buttons or links below it. |

## Keyboard

| Key   | Action                                  |
| ----- | --------------------------------------- |
| `Tab` | Reaches the dismiss button and actions. |

## Accessibility

- `danger` and `warning` render `role="alert"` (assertive); the rest `role="status"` (polite). Override with the `role` prop if an alert is present at page load and should not be announced.
- The icon is decorative; the tone must be clear from the text.

## Tokens used

`--color-*-subtle`, `--color-*-border`, `--color-*-text`, `--color-bg-subtle`, `--color-border`, `--color-text*`, `--radius-lg`, `--space-*`, `--text-sm`, `--weight-semibold`, `--control-h-sm`, `--focus-ring`

## Anatomy

```
<div class="db-alert" role="status|alert" data-tone>
  <span class="db-alert__icon">
  <div class="db-alert__content"> <p class="db-alert__title"> <div class="db-alert__body"> <div class="db-alert__actions">
  <button class="db-alert__close">
```
