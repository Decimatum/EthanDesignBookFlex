# Button

The primary action control. Renders a `<button>` by default, or an `<a>` when `href` is given, with identical styling in both cases. Five visual variants × three tones × three sizes cover every button in a typical app without custom CSS.

```svelte
<script>
	import { Button } from '@ethan/designbook';
	import { Plus } from '@lucide/svelte';
</script>

<Button>Save</Button>
<Button variant="soft" tone="neutral">Cancel</Button>
<Button variant="outline" tone="danger">Delete</Button>
<Button href="/docs" variant="link">Read the docs</Button>

<Button loading>Saving…</Button>

<Button>
	{#snippet leading()}<Plus />{/snippet}
	New item
</Button>

<Button iconOnly aria-label="Add" variant="ghost">
	{#snippet leading()}<Plus />{/snippet}
</Button>
```

## Props

| Prop       | Type                                                  | Default    | Description                                                                                                   |
| ---------- | ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'solid'`  | Visual weight. Use one `solid` per view; `soft`/`outline` for secondary; `ghost` for toolbars; `link` inline. |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'accent'` | Colour intent.                                                                                                |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | `'md'`     | Height follows `--control-h-*`, so it responds to the density axis.                                           |
| `type`     | `'button' \| 'submit' \| 'reset'`                     | `'button'` | Native type. Defaults to `button` so buttons inside forms don't submit by accident.                           |
| `href`     | `string`                                              | —          | Render as a link.                                                                                             |
| `disabled` | `boolean`                                             | `false`    | Disabled state. Links get `aria-disabled` and lose their `href`.                                              |
| `loading`  | `boolean`                                             | `false`    | Shows a spinner instead of the leading icon, sets `aria-busy`, and disables the button.                       |
| `block`    | `boolean`                                             | `false`    | Full width.                                                                                                   |
| `iconOnly` | `boolean`                                             | `false`    | Square button for a lone icon. **Requires `aria-label`.**                                                     |
| `class`    | `string`                                              | —          | Extra classes merged onto the root element.                                                                   |

All other props are forwarded to the root `<button>` or `<a>` (`onclick`, `aria-*`, `form`, `target`, …).

## Snippets

| Snippet    | Description                                     |
| ---------- | ----------------------------------------------- |
| `children` | The label.                                      |
| `leading`  | Icon before the label (hidden while `loading`). |
| `trailing` | Icon after the label.                           |

## Keyboard

| Key             | Action                                              |
| --------------- | --------------------------------------------------- |
| `Tab`           | Moves focus to the button (skipped when disabled).  |
| `Enter`/`Space` | Activates a `<button>`; `Enter` activates an `<a>`. |

## Accessibility

- Native elements are used, so focus, activation and semantics come for free.
- Focus is shown with the global `--focus-ring` (only on `:focus-visible`).
- Icons are wrapped in `aria-hidden` containers; the label is the accessible name. For `iconOnly`, pass `aria-label`.
- `loading` sets `aria-busy="true"` and hides the spinner from assistive tech to avoid double announcements.
- Disabled links render without `href`, with `role="link"`, `aria-disabled="true"` and `tabindex="-1"`.

## Tokens used

`--control-h-*`, `--control-px-*`, `--control-text-*`, `--control-gap`, `--control-radius`, `--control-border-width`, `--font-body`, `--weight-medium`, `--focus-ring`, `--transition-colors`, `--transition-transform`, `--radius-xs`, and the semantic colour tokens for accent / neutral / danger.

## Anatomy

```
<button class="db-button" data-variant data-tone data-size [data-block] [data-icon-only] [data-loading]>
  <span class="db-button__icon"> | <svg class="db-spinner">
  <span class="db-button__label">
  <span class="db-button__icon">
</button>
```

Styling hooks: target `[data-variant="…"]` etc. from a parent, or override the private custom properties `--_bg`, `--_fg`, `--_border` via `class`.
