# Component requests

The queue that grows the Book from real projects. A consuming project's Claude Code session
appends here when it meets a gap (see `USING.md` §4); a Book session builds from here. Newest at
the bottom of its section. Keep entries short — the API is designed in the Book, not in the app.

Entry format:

```
### <Name>                                  ← PascalCase component name
- Requested: <date> · <project> · profile <public|app>
- Doing: <what the user is doing when they meet the gap>
- Tried: <existing components composed first, and why they fell short>
- Shape: <one-line proposed API — props, snippets, what it wraps (Bits? dependency-free?)>
- Status: open | building | shipped <version>
```

## Open

### MarketingShell

- Requested: 2026-10-19 · Design Book planning · profile public
- Doing: building any client-facing site — needs a header (brand, horizontal Nav, CTA), a
  content area with generous widths, and a footer with link columns; transparent-then-frosted
  header like AppShell; mobile drawer.
- Tried: `AppShell navigation="top"` — app chrome (canvas/surface layering, rail) reads as a tool,
  not a site; `Container` + `Nav orientation="horizontal"` works as an interim.
- Shape: `<MarketingShell brand header nav actions footer>` snippets; `sticky` header prop;
  dependency-free; flow module next to AppShell.
- Status: open

### Section / Hero

- Requested: 2026-10-19 · Design Book planning · profile public
- Doing: composing a landing page — full-bleed sections with a contained inner column, optional
  eyebrow/title/lede, background tone; a Hero variant with media/CTA slots.
- Tried: `Container` + `Stack` + `Heading` — works but every project re-derives the same spacing
  and tone rules.
- Shape: `<Section tone="default|muted|accent" size="sm|md|lg">` + `<Hero>` with `media`,
  `actions` snippets; dependency-free.
- Status: open

### Footer

- Requested: 2026-10-19 · Design Book planning · profile public
- Doing: the site footer — link columns, legal line, social icons, optional newsletter field.
- Tried: `Grid` + `Link` — fine, but no consistent anatomy or tokens.
- Shape: `<Footer columns={[{title, links}]} legal>` with `aside` snippet; dependency-free.
- Status: open

### ContextMenu

- Requested: 2026-10-13 · Daybook · profile app
- Doing: right-click on a table row / calendar day for quick actions.
- Tried: `Menu` — trigger-anchored only.
- Shape: `Menu` variant on Bits `ContextMenu`; same item components.
- Status: open

### Timeline

- Requested: 2026-10-13 · Daybook · profile app
- Doing: a vertical history of events (sessions, entries, changes) with dates and markers.
- Tried: `Stack` + `Divider` — no connector line or marker anatomy.
- Shape: `<Timeline items>` with `marker`, `content` snippets; dependency-free.
- Status: open

### Board

- Requested: 2026-10-13 · Daybook · profile app
- Doing: kanban-style drag between columns.
- Tried: nothing in the Book covers drag and drop.
- Shape: `<Board columns items onMove>`; keyboard move via menu; dependency-free (pointer events).
- Status: open

### Chart (small SVG set)

- Requested: 2026-10-13 · Daybook · profile app
- Doing: sparkline in `Stat`, small bar/line charts on dashboard tiles.
- Tried: `Stat` has room for a sparkline but no renderer.
- Shape: `Sparkline`, `Bars`, `Line` on token colours; post-1.0 chart wrapper stays deferred.
- Status: open

### MoneyInput

- Requested: 2026-10-13 · Daybook · profile app
- Doing: entering amounts with a currency.
- Tried: `NumberInput` with currency formatting — close; needs currency selection and minor-unit rules.
- Shape: thin layer on `NumberInput`.
- Status: open

### MarkdownText

- Requested: 2026-10-13 · Daybook · profile app
- Doing: rendering journal entries written in Markdown with the Book's typography.
- Tried: `Text` — plain strings only.
- Shape: `<MarkdownText source>` with a typography stylesheet (`.db-prose`); parser is a dependency decision.
- Status: open

### Design Book packaging

- Requested: 2026-10-19 · Legwork · profile app
- Doing: `import '@ethan/designbook/styles'` in a TS project fails `svelte-check` ("no type
  declarations"); the app carries an ambient `declare module` as a stub.
- Shape: add `"types"` (or a `.d.ts`) for the CSS subpath exports in `package.json`; also
  `Stack gap` is a string union — document `gap="4"` in USING.md.
- Status: open

## Shipped

### TabBar (phone bottom navigation)

- Requested: 2026-10-20 · Legwork · profile app
- Doing: switching between Today, Calendar and Clients on a phone with one thumb; the
  AppShell's hamburger drawer costs two taps and hides the current section.
- Tried: `AppShell navigation="top"` — folds into the same drawer below 64rem.
- Shape: `<TabBar items={[{ href, label, icon, badge? }]} current>` fixed to the bottom on
  narrow viewports (safe-area aware), hidden at ≥ 64rem where the sidebar takes over; an
  AppShell snippet `tabBar` would place it. Dependency-free.
- Status: shipped 0.3.0 (2026-10-20)

### TimeGrid

- Requested: 2026-10-19 · Legwork · profile app
- Doing: reading a week (or one day) as hours down the side and sessions as blocks, with
  overlaps side by side and gaps visible — the view a coach plans a week in.
- Tried: `Calendar` (month grid with dots, no hours) and a hand-rolled day list
  (`DayTimeline` in Legwork: time rail + tone bar per row + dashed gaps) — fine for a day,
  no hour axis, no week.
- Shape: `<TimeGrid days={['2026-10-19', …]} events={[{ id, start, end, title, tone, meta }]}
hourFrom={6} hourTo={23} now onSelect onCreate(dayISO, clockHHMM)>` with `event(item)` snippet;
  dependency-free; virtualised columns are not needed (≤ 7 days).
- Status: shipped 0.2.0 (2026-10-19)

### Rating, Banner, DescriptionList, Calendar, DatePicker, CourtMap

- Requested: 2026-10 · Daybook
- Status: shipped 0.1.0 (2026-10-13)
