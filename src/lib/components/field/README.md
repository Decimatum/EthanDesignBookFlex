# Field

Wraps a form control with a label, optional hint and error message, and wires the accessibility attributes for you: the label's `for`, the control's `aria-describedby`, `aria-invalid`, `required` and `disabled` all flow through context.

```svelte
<script>
	import { Field, Input, Textarea } from '@ethan/designbook';
	let email = $state('');
</script>

<Field label="Email" hint="We never share it." required>
	<Input type="email" bind:value={email} />
</Field>

<Field label="Bio" error={bio.length > 200 ? 'Keep it under 200 characters' : undefined}>
	<Textarea bind:value={bio} />
</Field>

<!-- groups of controls -->
<Field as="fieldset" label="Notifications">
	<Checkbox>Email</Checkbox>
	<Checkbox>Push</Checkbox>
</Field>
```

## Props

| Prop       | Type                  | Default   | Description                                                              |
| ---------- | --------------------- | --------- | ------------------------------------------------------------------------ |
| `label`    | `string`              | —         | Visible label (a `<legend>` when `as="fieldset"`).                       |
| `hint`     | `string`              | —         | Helper text. Hidden while `error` is set.                                |
| `error`    | `string`              | —         | Error message; marks the control invalid and announces via `role=alert`. |
| `required` | `boolean`             | `false`   | Adds the asterisk and `required` on the control.                         |
| `disabled` | `boolean`             | `false`   | Disables the control.                                                    |
| `as`       | `'div' \| 'fieldset'` | `'div'`   | Use `fieldset` for groups.                                               |
| `id`       | `string`              | generated | Control id.                                                              |
| `class`    | `string`              | —         |                                                                          |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description                                  |
| ---------- | -------------------------------------------- |
| `children` | The control(s). One control per `div` Field. |

## Context

`getFieldContext()` returns `{ id, describedBy, invalid, required, disabled }` (all reactive getters). Input, Textarea, Checkbox, Switch and Radio read it automatically; a custom control can do the same.

## Keyboard

Not interactive itself.

## Accessibility

- The label is a real `<label for>` (or `<legend>`), so clicking it focuses the control.
- Hint and error are linked with `aria-describedby`; the error has `role="alert"` so it is announced when it appears.
- The required asterisk is decorative; `required` on the control carries the semantics.

## Tokens used

`--text-sm`, `--weight-medium`, `--leading-snug`, `--color-text*`, `--color-danger-text`, `--space-*`

## Anatomy

```
<div class="db-field" [data-invalid] [data-disabled]>
  <label class="db-field__label" for>
  <div class="db-field__control">
  <p class="db-field__hint" id> | <p class="db-field__error" id role="alert">
```
