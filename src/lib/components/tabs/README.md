# Tabs

Switch between sections of related content. Built on Bits UI's Tabs for roving focus and ARIA wiring; compose it from `Tabs`, `TabList`, `Tab` and `TabPanel`.

```svelte
<script>
	import { Tabs, TabList, Tab, TabPanel } from '@ethan/designbook';
	let section = $state('positions');
</script>

<Tabs bind:value={section}>
	<TabList label="Portfolio">
		<Tab value="positions" badge={12}>Positions</Tab>
		<Tab value="orders">Orders</Tab>
		<Tab value="history" disabled>History</Tab>
	</TabList>
	<TabPanel value="positions">…</TabPanel>
	<TabPanel value="orders">…</TabPanel>
	<TabPanel value="history">…</TabPanel>
</Tabs>

<Tabs variant="pill" size="sm">…</Tabs>
```

## Tabs props

| Prop            | Type                         | Default        | Description                                      |
| --------------- | ---------------------------- | -------------- | ------------------------------------------------ |
| `value`         | `string`                     | —              | Bindable active tab.                             |
| `variant`       | `'underline' \| 'pill'`      | `'underline'`  |                                                  |
| `size`          | `'sm' \| 'md'`               | `'md'`         |                                                  |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` |                                                  |
| `activation`    | `'automatic' \| 'manual'`    | `'automatic'`  | Activate on arrow focus, or only on Enter/Space. |
| `onValueChange` | `(value: string) => void`    | —              |                                                  |

## TabList props

`label` (**required**, the accessible name), `grow` (stretch tabs to fill).

## Tab props

`value` (**required**), `disabled`, `badge` (count/status after the label). Snippets: `leading` (icon), `children` (label).

## TabPanel props

`value` (**required**). Snippet: `children`.

## Keyboard

| Key             | Action                                     |
| --------------- | ------------------------------------------ |
| `Tab`           | Into the active tab, then into its panel.  |
| `← →` / `↑ ↓`   | Move between tabs (skips disabled, wraps). |
| `Home` / `End`  | First / last tab.                          |
| `Enter`/`Space` | Activate (manual mode).                    |

## Accessibility

- `role="tablist"` / `tab` / `tabpanel` with `aria-selected`, `aria-controls` and `aria-labelledby` from Bits UI.
- `TabList.label` is required so screen readers can name the set.
- Use `activation="manual"` when switching tabs is expensive (network) so arrowing through doesn't fire loads.

## Tokens used

`--color-border`, `--color-bg-subtle`, `--color-surface`, `--color-accent*`, `--color-component`, `--color-text*`, `--control-h-*`, `--radius-*`, `--shadow-sm`, `--space-*`, `--text-*`, `--focus-ring`

## Anatomy

```
<div class="db-tabs" data-variant data-orientation>
  <div class="db-tab-list" role="tablist" data-variant data-size [data-grow]>
    <button class="db-tab" role="tab" data-state="active|inactive" [data-disabled]>
      <span class="db-tab__icon"> <span class="db-tab__label"> <span class="db-tab__badge">
  <div class="db-tab-panel" role="tabpanel">
```
