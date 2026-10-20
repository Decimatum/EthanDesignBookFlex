# Calendar

A month grid you can read as well as pick from: each day carries up to three coloured dots — journal entries, sessions, spending — so the month tells its story before anything is clicked. Values are ISO date strings (`YYYY-MM-DD`), never `Date` objects, so the app's dates pass straight through. Built on Bits UI's Calendar; DatePicker shares the same grid.

```svelte
<script>
	import { Calendar } from '@ethan/designbook';
	let day = $state('2026-10-13');
	const marks = {
		'2026-10-13': [
			{ tone: 'accent', label: 'night entry' },
			{ tone: 'success', label: 'padel' }
		],
		'2026-10-12': [{ tone: 'neutral', label: 'morning entry' }]
	};
</script>

<Calendar bind:value={day} {marks} weekStartsOn={1} />
```

## Props

| Prop                   | Type                      | Default       | Description                                                     |
| ---------------------- | ------------------------- | ------------- | --------------------------------------------------------------- |
| `value`                | `string`                  | `''`          | Bindable ISO date; `''` for none.                               |
| `month`                | `string`                  | —             | Bindable ISO date of the month shown (any day in it).           |
| `marks`                | `CalendarMarks`           | `{}`          | `{ 'YYYY-MM-DD': [{ tone?, label }] }`; up to three dots drawn. |
| `today`                | `string`                  | device's date | ISO date to ring.                                               |
| `weekStartsOn`         | `0–6`                     | `1` (Monday)  |                                                                 |
| `minValue`, `maxValue` | `string`                  | —             | ISO bounds; days outside are disabled.                          |
| `fixedWeeks`           | `boolean`                 | `true`        | Always six rows.                                                |
| `readonly`             | `boolean`                 | `false`       | Shows without taking a selection.                               |
| `disabled`             | `boolean`                 | `false`       |                                                                 |
| `locale`               | `string`                  | browser       | Month and weekday names.                                        |
| `label`                | `string`                  | `'Calendar'`  | Accessible name of the grid.                                    |
| `onValueChange`        | `(value: string) => void` | —             |                                                                 |
| `onMonthChange`        | `(month: string) => void` | —             | When the user pages to another month.                           |
| `class`                | `string`                  | —             |                                                                 |

Mark tones: `accent` (default), `neutral`, `success`, `warning`, `danger`, `info`.

## Keyboard

| Key                   | Does                         |
| --------------------- | ---------------------------- |
| `← → ↑ ↓`             | Move a day / a week          |
| `Home` / `End`        | First / last day of the week |
| `PageUp` / `PageDown` | Previous / next month        |
| `Enter` / `Space`     | Select the focused day       |

## Accessibility

- Bits UI's grid semantics: `role="grid"`, one tab stop, roving focus, `aria-selected` on the chosen day.
- Each marked day gets an `aria-description` listing its marks ("night entry, padel"), so the dots are not colour-only.
- Today is ringed, the selection is filled; both differ from plain days in shape, not just colour.
- Days outside the month are muted; disabled days are announced as such.

## Tokens used

`--control-h-sm`, `--control-h-md`, `--control-radius`, `--space-1`, `--space-2`, `--space-6`, `--text-xs`, `--text-sm`, `--text-md`, `--font-body`, `--color-text*`, `--color-component-hover`, `--color-accent*`, `--color-{success,warning,danger,info}`, `--focus-ring`, `--transition-colors`.

## Anatomy

```
.db-calendar                      Bits Calendar.Root
  .db-calendar__header            prev · heading · next
  .db-calendar__months
    table.db-calendar__grid
      th.db-calendar__weekday × 7
      td.db-calendar__cell
        .db-calendar__day         [data-selected] [data-today] [data-outside-month] [data-disabled]
          .db-calendar__number
          .db-calendar__marks > .db-calendar__mark[data-tone] × ≤3
```
