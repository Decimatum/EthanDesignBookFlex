# CourtMap

A padel court drawn to scale — 10 m × 20 m, net across the middle, service lines 6.95 m from it, glass as a soft frame — that you tap to place a point and drag to move it. Coordinates are **court metres** (`x` 0–10 across, `y` 0–20 down, your side the bottom half), never pixels, so a season of moments reads as one heat map whatever screen logged them. One component serves the three padel views: logging a moment (edit), reading a session (view), and revising a month of mistakes (view + `heat`).

```svelte
<script>
	import { CourtMap } from '@ethan/designbook';
	let markers = $state([
		{ id: 'me', kind: 'me', x: 7.2, y: 15.4 },
		{ id: 'partner', kind: 'partner', x: 3.1, y: 11.8 },
		{ id: 'correct', kind: 'correct', x: 7.0, y: 11.4 }
	]);
</script>

<CourtMap
	mode="edit"
	placing="me"
	{markers}
	arrows={[{ from: 'me', to: 'correct' }]}
	onPlace={(x, y) => (markers[0] = { ...markers[0], x, y })}
	onMove={(id, x, y) => {
		const m = markers.find((k) => k.id === id);
		if (m) {
			m.x = x;
			m.y = y;
		}
	}}
/>
```

## Props

| Prop                      | Type                      | Default         | Description                                                                                  |
| ------------------------- | ------------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `markers`                 | `CourtMarker[]`           | `[]`            | `{ id, x, y, kind?, tone?, label?, title? }`; kinds `me` `partner` `correct` `ball` `point`. |
| `arrows`                  | `CourtArrow[]`            | `[]`            | `{ from, to, tone?, dashed? }`; ends are marker ids or `{x, y}`.                             |
| `mode`                    | `'edit' \| 'view'`        | `'view'`        | Edit: taps place, drags move, arrows nudge the focused marker.                               |
| `placing`                 | `CourtMarkerKind \| null` | `null`          | What a tap on empty court means; `null` = taps do nothing.                                   |
| `selected`                | `string \| null`          | `null`          | Marker drawn with a focus ring.                                                              |
| `heat`                    | `boolean`                 | `false`         | Small, translucent dots: many points read as density.                                        |
| `width`                   | `number \| string`        | `'100%'`        | Height follows (1:2).                                                                        |
| `topLabel`, `bottomLabel` | `string`                  | Opponents / You |                                                                                              |
| `onPlace`                 | `(x, y) => void`          | —               | Tap on empty court (edit).                                                                   |
| `onSelect`                | `(id) => void`            | —               | Marker tapped.                                                                               |
| `onMove`                  | `(id, x, y) => void`      | —               | Marker dragged or nudged (edit).                                                             |
| `label`                   | `string`                  | `'Padel court'` | Accessible name of the drawing.                                                              |
| `class`                   | `string`                  | —               |                                                                                              |

All other props are forwarded to the root element. Default tones: `me` warning, `partner` neutral (dashed outline), `correct` accent, `ball` info.

## Keyboard

In edit mode every marker is a focusable button: `← → ↑ ↓` nudge by 0.25 m (`Shift` for 1 m), `Enter` / `Space` select it. Placing a new point needs a pointer; views that log should also offer a "place at centre" button so keyboard users can then nudge.

## Accessibility

- The drawing is `role="img"` with a name; each marker has an accessible label built from its position ("me: your side, right, mid-court") unless `title` is given.
- Marker kinds differ in shape as well as colour: partner is a dashed outline, the correct position is smaller and carries the arrow, the heat view is uniform by design.
- Coordinates and the court's lines are metres, so the picture is the same on every device.

## Tokens used

`--color-success-subtle`, `--color-success-border`, `--color-success`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse`, `--color-surface`, `--color-accent`, `--color-warning`, `--color-danger`, `--color-info`, `--color-focus`, `--font-body`.

## Anatomy

```
.db-court-map[data-mode][data-heat]
  svg.db-court-map__svg[role=img]
    .db-court-map__glass  .db-court-map__turf  .db-court-map__line × 4  .db-court-map__net
    .db-court-map__label × 2
    .db-court-map__arrow × n [data-tone] [data-dashed]
    g.db-court-map__marker × n [data-kind] [data-tone] [data-selected]
      circle · text.db-court-map__dot-label
```
