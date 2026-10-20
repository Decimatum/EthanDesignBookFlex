# Stepper

Shows where the user is in a multi-step flow — onboarding, checkout, an order ticket — and lets them jump back to completed steps. Pair it with `<PageTransition>` for the step bodies.

```svelte
<script>
	import { Stepper } from '@ethan/designbook';
	const steps = [
		{ id: 'details', label: 'Details', description: 'Name and email' },
		{ id: 'funding', label: 'Funding' },
		{ id: 'review', label: 'Review' }
	];
	let current = $state('funding');
</script>

<Stepper {steps} bind:current onStepClick={(id) => (current = id)} />
<Stepper {steps} bind:current orientation="vertical" size="sm" />
```

## Props

| Prop          | Type                         | Default        | Description                                          |
| ------------- | ---------------------------- | -------------- | ---------------------------------------------------- |
| `steps`       | `Step[]`                     | —              | **Required.** `{ id, label, description?, error? }`. |
| `current`     | `string`                     | first id       | Bindable id of the current step.                     |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |                                                      |
| `size`        | `'sm' \| 'md'`               | `'md'`         |                                                      |
| `onStepClick` | `(id: string) => void`       | —              | Makes steps clickable.                               |
| `linear`      | `boolean`                    | `true`         | Only completed steps are clickable.                  |
| `label`       | `string`                     | `'Progress'`   | Landmark name.                                       |
| `class`       | `string`                     | —              |                                                      |

`error: true` on a completed step shows a warning marker — use it when validation fails on a step the user already left.

## Keyboard

Clickable steps are buttons: `Tab` between them, `Enter`/`Space` to jump.

## Accessibility

- `<nav aria-label>` with an ordered list; the current step carries `aria-current="step"`.
- Each label is prefixed with visually hidden "Step N of M, completed:" text so state is not conveyed by colour alone.
- Non-clickable steps are plain text, not disabled buttons.

## Tokens used

`--color-accent*`, `--color-danger*`, `--color-surface`, `--color-border-strong`, `--color-text*`, `--space-*`, `--text-*`, `--weight-*`, `--radius-*`, `--font-numeric`, `--focus-ring`, `--transition-colors`

## Anatomy

```
<nav class="db-stepper" data-orientation data-size>
  <ol class="db-stepper__list"><li class="db-stepper__step" data-state [aria-current="step"]>
    <button|div class="db-stepper__item">
      <span class="db-stepper__marker" data-state [data-error]> <span class="db-stepper__text">
        <span class="db-stepper__label" data-state> <span class="db-stepper__description">
    <span class="db-stepper__connector">
```
