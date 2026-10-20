# TimeGrid

A week (or any run of days) as hours down the side and sessions as blocks — the view a coach plans a week in. Overlapping blocks share the column side by side, a red line marks now, and a tap on empty space says which day and time it landed on so the caller can add something there. Times are instants and are shown in the browser's zone; the caller decides how many days to show (seven on a desktop, three on a phone). Dependency-free.

```svelte
<script>
	import { TimeGrid } from '@ethan/designbook';
	const days = ['2026-10-19', '2026-10-20', '2026-10-21'];
	const events = [
		{
			id: '1',
			start: '2026-10-19T10:00:00+08:00',
			end: '2026-10-19T11:00:00+08:00',
			title: 'Ah Boy',
			meta: 'Swimming · Pool A',
			tone: 'info'
		},
		{
			id: '2',
			start: '2026-10-19T10:30:00+08:00',
			end: '2026-10-19T12:00:00+08:00',
			title: 'Mei Ling',
			meta: 'Programming',
			tone: 'success'
		},
		{
			id: '3',
			start: '2026-10-20T18:00:00+08:00',
			end: '2026-10-20T19:00:00+08:00',
			title: 'Raj',
			cancelled: true
		}
	];
</script>

<TimeGrid
	{days}
	{events}
	hourFrom={7}
	hourTo={22}
	now={new Date()}
	onSelect={(e) => open(e)}
	onCreate={(day, time) => add(day, time)}
/>
```

## Props

| Prop          | Type                                  | Default       | Description                                                      |
| ------------- | ------------------------------------- | ------------- | ---------------------------------------------------------------- |
| `days`        | `string[]`                            | —             | **Required.** ISO dates of the columns, in order (1–7).          |
| `events`      | `TimeGridEvent[]`                     | `[]`          | `{ id, start, end, title, meta?, tone?, cancelled?, data? }`.    |
| `hourFrom`    | `number`                              | `6`           | First hour shown (24 h).                                         |
| `hourTo`      | `number`                              | `23`          | Last hour shown.                                                 |
| `hourHeight`  | `string`                              | `'3.5rem'`    | Height of one hour.                                              |
| `now`         | `Date`                                | —             | Draws the now line in its day; omit to hide it.                  |
| `today`       | `string`                              | device's date | ISO date whose header is highlighted.                            |
| `slotMinutes` | `15 \| 30 \| 60`                      | `30`          | What a tap on empty space snaps to.                              |
| `locale`      | `string`                              | browser       | Day and hour names.                                              |
| `label`       | `string`                              | `'Schedule'`  | Accessible name of the grid.                                     |
| `onSelect`    | `(event: TimeGridEvent) => void`      | —             | A block was activated.                                           |
| `onCreate`    | `(day: string, time: string) => void` | —             | Empty space was activated: ISO day and `HH:MM`. Omit to disable. |
| `class`       | `string`                              | —             |                                                                  |

Event tones: `accent` (default), `neutral`, `success`, `warning`, `danger`, `info`. An event that starts before `hourFrom` or ends after `hourTo` is clipped to the visible range; one outside it entirely is not drawn.

## Snippets

| Snippet | Args                 | Purpose                                            |
| ------- | -------------------- | -------------------------------------------------- |
| `event` | `(e: TimeGridEvent)` | Replace the block's content (title and time line). |

## Keyboard

| Key               | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `Tab`             | Moves through the empty slots and blocks of each day in reading order. |
| `Enter` / `Space` | Activates a block (`onSelect`) or a slot (`onCreate`).                 |

## Accessibility

- The grid is `role="grid"` with column headers for the days; each day is one `gridcell` holding the slots and blocks.
- Every block is a `<button>` whose accessible name is its title, time span, meta and "cancelled" when it is; each empty slot is a `<button>` named "Add on Monday, 19 October at 9:00 am".
- The now line and the hour labels are decorative (`aria-hidden`); the times are in each block's name.
- Colour is never the only signal: a cancelled block is struck through and dashed.
- Scrolling happens inside the component (horizontal when the columns exceed the width), so the page keeps its own scroll.

## Tokens used

`--color-surface`, `--color-bg-subtle`, `--color-border`, `--color-border-strong`, `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-component`, `--color-component-hover`, `--color-focus`, `--color-<tone>`, `--color-<tone>-subtle`, `--color-<tone>-text`, `--color-accent-fg`, `--color-danger`, `--space-*`, `--text-xs`, `--text-sm`, `--radius-sm`, `--radius-md`, `--radius-full`, `--shadow-sm`, `--duration-fast`, `--ease-standard`.

## Anatomy

```
<div class="db-time-grid" role="grid" data-cols style="--_hour; --_cols; --_n-hours">
  <div class="db-time-grid__head" role="row">
    <div class="db-time-grid__corner">
    <div class="db-time-grid__day" [data-today]> weekday · date
  <div class="db-time-grid__body" role="row">
    <div class="db-time-grid__hours"> <span class="db-time-grid__hour">…
    <div class="db-time-grid__col" role="gridcell" [data-today]>
      <div class="db-time-grid__slots"> <button class="db-time-grid__slot">…
      <button class="db-time-grid__event" data-tone [data-cancelled] [data-short] style="--_top; --_len; --_lane; --_lanes">
        <span class="db-time-grid__event-title"> <span class="db-time-grid__event-time">
      <span class="db-time-grid__now" style="--_top">
```

## Performance

Blocks are absolutely positioned from CSS custom properties, so layout is one pass per render and nothing is measured. Lane assignment is a single sweep per day. A week of 7 × 34 half-hour slots is ~240 buttons; set `slotMinutes={60}` or omit `onCreate` for a read-only view with fewer nodes.
