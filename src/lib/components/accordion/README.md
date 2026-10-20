# Accordion

Vertically stacked disclosure sections. Built on Bits UI's Accordion for keyboard navigation and ARIA wiring; compose it from `Accordion` and `AccordionItem`.

```svelte
<script>
	import { Accordion, AccordionItem } from '@ethan/designbook';
	let open = $state('fees');
</script>

<Accordion bind:value={open}>
	<AccordionItem value="fees" title="Fees" description="What you pay per trade">
		Zero commission on stocks and ETFs.
	</AccordionItem>
	<AccordionItem value="limits" title="Limits">Daily limits apply to withdrawals.</AccordionItem>
	<AccordionItem value="closed" title="Closed" disabled>Unavailable.</AccordionItem>
</Accordion>

<Accordion type="multiple" variant="divided" value={['a', 'b']}>…</Accordion>
```

## Accordion props

| Prop            | Type                                  | Default      | Description                                            |
| --------------- | ------------------------------------- | ------------ | ------------------------------------------------------ |
| `type`          | `'single' \| 'multiple'`              | `'single'`   | One open item at a time, or any number.                |
| `value`         | `string \| string[]`                  | —            | Bindable: a string for `single`, array for `multiple`. |
| `variant`       | `'bordered' \| 'divided'`             | `'bordered'` | Outlined card, or hairlines only.                      |
| `disabled`      | `boolean`                             | `false`      | Disables every item.                                   |
| `onValueChange` | `(value: string \| string[]) => void` | —            |                                                        |
| `class`         | `string`                              | —            |                                                        |

## AccordionItem props

| Prop          | Type      | Default | Description                        |
| ------------- | --------- | ------- | ---------------------------------- |
| `value`       | `string`  | —       | **Required.** Identifies the item. |
| `title`       | `string`  | —       | **Required.**                      |
| `description` | `string`  | —       | Secondary line under the title.    |
| `disabled`    | `boolean` | `false` |                                    |
| `class`       | `string`  | —       |                                    |

Snippets: `leading` (icon before the title), `children` (panel content).

## Keyboard

| Key             | Action                                         |
| --------------- | ---------------------------------------------- |
| `Tab`           | Into the triggers, then into an open panel.    |
| `Enter`/`Space` | Toggle the focused item.                       |
| `↑ ↓`           | Move between triggers (skips disabled, wraps). |
| `Home` / `End`  | First / last trigger.                          |

## Accessibility

- Each trigger is a `<button aria-expanded aria-controls>` inside an `<h3>`, so the sections appear in the document outline. Place the accordion under an `<h2>`.
- The panel is wired to its trigger with `aria-controls` and `aria-labelledby`.
- Height animates via `--bits-accordion-content-height`; reduced motion collapses instantly.

## Tokens used

`--color-bg-subtle`, `--color-border`, `--color-text*`, `--space-*`, `--text-*`, `--weight-*`, `--leading-*`, `--duration-*`, `--ease-*`, `--focus-ring-inset`, `--transition-colors`

## Anatomy

```
<div class="db-accordion" data-variant>
  <div class="db-accordion-item" data-state="open|closed" [data-disabled]>
    <h3 class="db-accordion-item__header">
      <button class="db-accordion-item__trigger">
        <span class="db-accordion-item__icon"> <span class="db-accordion-item__text">
          <span class="db-accordion-item__title"> <span class="db-accordion-item__description">
        <svg class="db-accordion-item__chevron">
    <div class="db-accordion-item__content" role="region"><div class="db-accordion-item__body">
```
