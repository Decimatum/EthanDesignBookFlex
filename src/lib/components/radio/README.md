# Radio & RadioGroup

Single choice from a small set. `RadioGroup` owns the value, name, label, hint and error; `Radio` renders one option and reads the group through context.

```svelte
<script>
	import { RadioGroup, Radio } from '@ethan/designbook';
	let plan = $state('pro');
</script>

<RadioGroup label="Plan" bind:value={plan} hint="You can change this later.">
	<Radio value="basic">Basic</Radio>
	<Radio value="pro" description="Most popular">Pro</Radio>
	<Radio value="team">Team</Radio>
</RadioGroup>

<RadioGroup label="Layout" orientation="horizontal" bind:value={layout}>
	<Radio value="grid">Grid</Radio>
	<Radio value="list">List</Radio>
</RadioGroup>
```

## RadioGroup props

| Prop            | Type                         | Default      | Description                              |
| --------------- | ---------------------------- | ------------ | ---------------------------------------- |
| `value`         | `string`                     | —            | Bindable selected value.                 |
| `name`          | `string`                     | generated    | Shared form field name.                  |
| `label`         | `string`                     | —            | Legend.                                  |
| `hint`          | `string`                     | —            |                                          |
| `error`         | `string`                     | —            | Marks the group invalid, `role="alert"`. |
| `required`      | `boolean`                    | `false`      |                                          |
| `disabled`      | `boolean`                    | `false`      | Disables every radio.                    |
| `orientation`   | `'vertical' \| 'horizontal'` | `'vertical'` |                                          |
| `onValueChange` | `(value: string) => void`    | —            | Called after selection changes.          |

## Radio props

| Prop          | Type           | Default    | Description                            |
| ------------- | -------------- | ---------- | -------------------------------------- |
| `value`       | `string`       | —          | Required. This option's value.         |
| `checked`     | `boolean`      | `false`    | Standalone use only (outside a group). |
| `size`        | `'sm' \| 'md'` | `'md'`     |                                        |
| `description` | `string`       | —          |                                        |
| `disabled`    | `boolean`      | from group |                                        |

## Snippets

| Component | Snippet    | Description |
| --------- | ---------- | ----------- |
| Group     | `children` | The radios. |
| Radio     | `children` | The label.  |

## Keyboard

| Key       | Action                             |
| --------- | ---------------------------------- |
| `Tab`     | Moves focus into/out of the group. |
| `↑ ↓ ← →` | Moves selection between options.   |
| `Space`   | Selects the focused option.        |

## Accessibility

- Native radios in a `<fieldset>` with a `<legend>`, plus `role="radiogroup"` on the option container carrying `aria-required`, `aria-invalid` and `aria-describedby`.
- Arrow-key navigation comes from the browser because all radios share one `name`.

## Tokens used

Same as Checkbox, plus `--space-4` for horizontal spacing.

## Anatomy

```
<fieldset class="db-radio-group" data-orientation [data-invalid]>
  <legend class="db-radio-group__legend">
  <div class="db-radio-group__items" role="radiogroup">
    <label class="db-radio"> <input type="radio" class="sr-only"> <span class="db-radio__circle"> <span class="db-radio__text">
  <p class="db-radio-group__hint"> | <p class="db-radio-group__error" role="alert">
```
