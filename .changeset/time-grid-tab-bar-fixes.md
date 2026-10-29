---
'@ethan/designbook': patch
---

TimeGrid: a caller's `style` (e.g. `height: 100%`) is merged with the grid's own CSS variables instead of being dropped, so a fixed-height container scrolls the grid rather than overflowing; event time text no longer uses reduced opacity (failed AA contrast on warning blocks). TabBar: badge count reaches the link's accessible name via `aria-label` ("Clients, 2"); items keyed by position so demos and hash routing may repeat an `href`. Both components now have unit, axe and visual baselines.
