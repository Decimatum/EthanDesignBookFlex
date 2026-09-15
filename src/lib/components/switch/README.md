# Switch

An on/off toggle for settings that take effect immediately. Use a Checkbox instead when the choice is submitted with a form.

```svelte
<script>
	import { Switch } from '@ethan/designbook';
	let dark = $state(false);
</script>

<Switch bind:checked={dark}>Dark mode</Switch>
<Switch labelPosition="start" description="Sends a push notification">Alerts</Switch>
```

## Props

| Prop                     | Type               | Default    | Description                      |
| ------------------------ | ------------------ | ---------- | -------------------------------- |
| `checked`                | `boolean`          | `false`    | Bindable.                        |
| `size`                   | `'sm' \| 'md'`     | `'md'`     |                                  |
| `labelPosition`          | `'start' \| 'end'` | `'end'`    | Label before or after the track. |
| `description`            | `string`           | —          |                                  |
| `disabled`, `name`, `id` | native             | from Field |                                  |
| `class`                  | `string`           | —          |                                  |

All other props are forwarded to the native input.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | The label.  |

## Keyboard

| Key     | Action  |
| ------- | ------- |
| `Space` | Toggle. |

## Accessibility

- Native `<input type="checkbox" role="switch">`, so state is announced as on/off.
- Thumb animation respects reduced motion through the global duration tokens.

## Tokens used

`--color-border-strong`, `--color-accent`, `--color-text*`, `--radius-full`, `--shadow-sm`, `--focus-ring`, `--duration-base`, `--ease-spring`

## Anatomy

```
<label class="db-switch" data-size data-label-position [data-disabled]>
  <input class="db-switch__control sr-only" type="checkbox" role="switch">
  <span class="db-switch__track"><span class="db-switch__thumb"></span>
  <span class="db-switch__text">
```
