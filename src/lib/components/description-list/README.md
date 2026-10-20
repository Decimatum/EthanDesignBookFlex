# DescriptionList

Term–description pairs: the facts about one record (a session's venue, duration, partner, result), a settings summary, the "This Daybook" block on a system page. Three layouts from one `items` array: stacked for narrow places, inline rows for scanning, a columns grid for a facts panel. Descriptions take a string or a snippet.

```svelte
<script>
	import { DescriptionList, Badge } from '@ethan/designbook';
</script>

<DescriptionList
	layout="columns"
	columns={3}
	items={[
		{ term: 'Venue', description: 'Pickle & Padel, Kallang' },
		{ term: 'Duration', description: '90 min' },
		{ term: 'Result', description: won, note: '4–6 6–3 3–6' }
	]}
/>
{#snippet won()}<Badge tone="success">Won</Badge>{/snippet}
```

## Props

| Prop        | Type                                 | Default     | Description                                        |
| ----------- | ------------------------------------ | ----------- | -------------------------------------------------- |
| `items`     | `DescriptionItem[]`                  | —           | `{ term, description: string \| Snippet, note? }`. |
| `layout`    | `'stacked' \| 'inline' \| 'columns'` | `'stacked'` | See below.                                         |
| `columns`   | `2 \| 3 \| 4`                        | `2`         | For `columns`; falls back to 2 under 40rem.        |
| `termWidth` | `string`                             | `'10rem'`   | Term column width for `inline`.                    |
| `size`      | `'sm' \| 'md'`                       | `'md'`      |                                                    |
| `class`     | `string`                             | —           |                                                    |

All other props are forwarded to the `<dl>`.

Layouts: **stacked** puts each term above its description, one pair per row; **inline** puts term and description side by side with a hairline between rows (and stacks under 40rem); **columns** flows stacked pairs into a grid.

## Keyboard

Static content; nothing to operate. Interactive descriptions (links, buttons in a snippet) behave as themselves.

## Accessibility

- Semantic `<dl>` / `<dt>` / `<dd>`, each pair wrapped in a `<div>` (valid HTML, lets CSS lay pairs out).
- Terms are muted but stay ≥ 4.5:1 against the surface.
- No information is carried by layout alone; the reading order is term then description in every layout.

## Tokens used

`--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--text-sm`, `--text-md`, `--color-text`, `--color-text-muted`, `--color-border`.

## Anatomy

```
dl.db-description-list[data-layout][data-size]
  div.db-description-list__item × n
    dt.db-description-list__term
    dd.db-description-list__desc
      span.db-description-list__note
```
