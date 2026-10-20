# DatePicker

A date field you can type into segment by segment (day, month, year, each its own focus stop) with a calendar pop-up for when you would rather look. Values are ISO strings (`YYYY-MM-DD`). The pop-up is the same grid as Calendar, marks and all. Built on Bits UI's DatePicker.

```svelte
<script>
	import { Field, DatePicker } from '@ethan/designbook';
	let on = $state('2026-10-13');
</script>

<Field label="Due on" hint="Leave empty for someday">
	<DatePicker bind:value={on} weekStartsOn={1} />
</Field>
```

## Props

| Prop                   | Type                      | Default       | Description                                |
| ---------------------- | ------------------------- | ------------- | ------------------------------------------ |
| `value`                | `string`                  | `''`          | Bindable ISO date; `''` for none.          |
| `size`                 | `'sm' \| 'md' \| 'lg'`    | `'md'`        | Follows the density axis.                  |
| `invalid`              | `boolean`                 | from Field    |                                            |
| `disabled`, `required` | `boolean`                 | from Field    |                                            |
| `readonly`             | `boolean`                 | `false`       |                                            |
| `name`                 | `string`                  | —             | Hidden input with the ISO value for forms. |
| `id`                   | `string`                  | from Field    |                                            |
| `weekStartsOn`         | `0–6`                     | `1` (Monday)  |                                            |
| `minValue`, `maxValue` | `string`                  | —             | ISO bounds.                                |
| `marks`                | `CalendarMarks`           | `{}`          | Dots in the pop-up, as in Calendar.        |
| `today`                | `string`                  | device's date | ISO date to ring.                          |
| `locale`               | `string`                  | browser       | Segment order and names.                   |
| `aria-label`           | `string`                  | —             | Accessible name when not inside a Field.   |
| `onValueChange`        | `(value: string) => void` | —             |                                            |
| `class`                | `string`                  | —             |                                            |

## Keyboard

| Where    | Key                            | Does                                    |
| -------- | ------------------------------ | --------------------------------------- |
| Segment  | digits                         | Type the part; focus moves on when full |
| Segment  | `↑` `↓`                        | Step the part                           |
| Segment  | `←` `→`                        | Previous / next segment                 |
| Segment  | `Backspace`                    | Clear the part                          |
| Trigger  | `Enter` `Space`                | Open the calendar                       |
| Calendar | arrows, `PageUp/Down`, `Enter` | As in Calendar; picking closes          |
| Anywhere | `Esc`                          | Close the calendar                      |

## Accessibility

- Each segment is a spinbutton with its own name and value range; the field as a whole takes the Field's label.
- The trigger is a real button labelled "Open calendar"; the pop-up is a dialog that returns focus on close.
- Invalid state is both a danger border and `aria-invalid`; Field's error text is linked by `aria-describedby`.

## Tokens used

`--control-h-*`, `--control-px-*`, `--control-text-*`, `--control-border-width`, `--control-radius`, `--space-1`, `--space-2`, `--space-3`, `--font-body`, `--color-surface`, `--color-surface-overlay`, `--color-border*`, `--color-text*`, `--color-accent*`, `--color-danger`, `--color-bg-subtle`, `--color-component-hover`, `--shadow-overlay`, `--focus-ring`, `--duration-*`, `--ease-*`, `--transition-colors`, plus Calendar's.

## Anatomy

```
.db-date-picker                     Bits DatePicker.Input
  .db-date-picker__segments
    .db-date-picker__segment × 3    [data-placeholder]
    .db-date-picker__literal × 2
  .db-date-picker__trigger
.db-date-picker__content            portalled
  .db-calendar.db-date-picker__calendar   (Calendar's anatomy)
```
