# Toast

Transient notifications. Call `toast()` from anywhere (components, load functions, stores) and render one `<Toaster />` near the root of the app. Toasts auto-dismiss, pause while hovered or focused, and are announced through a polite live region.

```svelte
<!-- +layout.svelte -->
<script>
	import { Toaster } from '@ethan/designbook';
</script>

<Toaster position="bottom-right" />
```

```ts
import { toast } from '@ethan/designbook';

toast('Saved');
toast.success('Order filled', { description: '100 AAPL @ 189.20' });
toast.danger('Failed to save', { duration: 0, action: { label: 'Retry', onClick: retry } });

// update in place
const id = toast('Uploading…', { duration: 0, dismissible: false });
toast.success('Uploaded', { id });

// or track a promise
await toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: (e) => `Failed: ${e}` });
```

## `toast(title, options)`

| Option        | Type                                                        | Default     | Description                                                         |
| ------------- | ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `tone`        | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Shortcuts: `toast.info()`, `.success()`, `.warning()`, `.danger()`. |
| `description` | `string`                                                    | —           | Second line.                                                        |
| `duration`    | `number`                                                    | `5000`      | ms before auto-dismiss; `0` = sticky.                               |
| `action`      | `{ label, onClick }`                                        | —           | One button; dismisses after click.                                  |
| `id`          | `string`                                                    | generated   | Reuse to update an existing toast.                                  |
| `dismissible` | `boolean`                                                   | `true`      | Show the close button.                                              |
| `icon`        | `Snippet`                                                   | by tone     |                                                                     |

Returns the toast id. Also: `toast.dismiss(id)`, `toast.clear()`, `toast.promise(p, { loading, success, error })`. The underlying store is exported as `toasts` (`items`, `max`).

## Toaster props

| Prop       | Type                                                                                              | Default          |
| ---------- | ------------------------------------------------------------------------------------------------- | ---------------- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` |

## Keyboard

| Key   | Action                                             |
| ----- | -------------------------------------------------- |
| `Tab` | Reaches action and dismiss buttons; pauses timers. |

## Accessibility

- New toasts are announced via an `aria-live="polite"` region; focus is never moved.
- `danger` toasts use `role="alert"`, others `role="status"`.
- Timers pause on hover and on keyboard focus, so a user can always finish reading.
- Keep at most a handful visible (`toasts.max`, default 5); older ones are dropped.

## Tokens used

`--z-toast`, `--color-surface-overlay`, `--color-border`, `--color-component*`, `--color-*-text`, `--shadow-lg`, `--radius-lg`, `--control-h-sm`, `--space-*`, `--text-*`, `--duration-base`, `--ease-decelerate`

## Anatomy

```
<div class="db-toaster" role="region" aria-label="Notifications" data-position>
  <div class="sr-only" aria-live="polite">
  <div class="db-toast" role="status|alert" data-tone>
    <span class="db-toast__icon"> <div class="db-toast__content"> <button class="db-toast__action"> <button class="db-toast__close">
```
