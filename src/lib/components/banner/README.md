# Banner

A full-width, single-line notice that belongs to a page or a section rather than to a form field: "3 of 3 in progress — the limit", "September is not closed yet", "2 captures unsent, retrying". Where an Alert is a boxed message inside the flow, a Banner runs edge to edge across the top of its container, carries one message and, optionally, one or two actions.

```svelte
<script>
	import { Banner, Button } from '@ethan/designbook';
</script>

<Banner tone="warning" title="September is still open" dismissible>
	Budgeted 4,800 · spent 4,615 · 185 under.
	{#snippet actions()}<Button size="sm" variant="outline" tone="neutral">Close the month</Button
		>{/snippet}
</Banner>
```

## Props

| Prop          | Type                                                                    | Default  | Description                                     |
| ------------- | ----------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| `tone`        | `'info' \| 'success' \| 'warning' \| 'danger' \| 'neutral' \| 'accent'` | `'info'` |                                                 |
| `title`       | `string`                                                                | —        | Bold lead-in before the message.                |
| `dismissible` | `boolean`                                                               | `false`  | Adds a close button; the banner removes itself. |
| `open`        | `boolean`                                                               | `true`   | Bindable visibility.                            |
| `onDismiss`   | `() => void`                                                            | —        |                                                 |
| `icon`        | `Snippet \| null`                                                       | by tone  | Replace the icon, or `null` to hide it.         |
| `class`       | `string`                                                                | —        |                                                 |

All other props are forwarded to the root element.

## Snippets

- `children` — the message.
- `actions` — buttons or links, kept at the end of the line; they wrap under the message when narrow.

## Keyboard

The close button is a normal button (`Tab`, `Enter`/`Space`). Actions are whatever you put in them.

## Accessibility

- `role="alert"` for `danger` and `warning`, `role="status"` otherwise (override with `role`).
- Tone is carried by icon and text as well as colour; every tone pairs its text colour with its subtle background at ≥ 4.5:1.
- The close button has `aria-label="Dismiss"`.

## Tokens used

`--color-{info,success,warning,danger,accent}-{subtle,text,border}`, `--color-bg-subtle`, `--color-border`, `--color-text`, `--color-component-hover`, `--control-h-sm`, `--control-h-md`, `--control-radius`, `--space-*`, `--text-sm`, `--focus-ring`.

## Anatomy

```
.db-banner[data-tone]
  .db-banner__icon
  .db-banner__body
    .db-banner__title
    .db-banner__message
  .db-banner__actions
  .db-banner__close
```
