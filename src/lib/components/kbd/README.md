# Kbd

Keyboard keys and shortcuts, rendered as keycaps. Pass a shortcut string and it is split into keys with platform-aware glyphs (`mod` becomes ⌘ on Apple devices and Ctrl elsewhere).

```svelte
<script>
	import { Kbd } from '@ethan/designbook';
</script>

<Kbd keys="mod+k" />
<!-- ⌘ K  /  Ctrl K -->
<Kbd keys="shift+enter" />
<Kbd>Esc</Kbd>
```

## Props

| Prop    | Type           | Default | Description                                             |
| ------- | -------------- | ------- | ------------------------------------------------------- |
| `keys`  | `string`       | —       | `+`-separated shortcut. Single letters are upper-cased. |
| `size`  | `'sm' \| 'md'` | `'md'`  |                                                         |
| `class` | `string`       | —       |                                                         |

Snippet: `children` — a single key, used when `keys` is not given. Other props are forwarded to the root element.

Recognised names: `mod`, `cmd`, `meta`, `ctrl`, `alt`, `option`, `shift`, `enter`, `return`, `backspace`, `delete`, `tab`, `esc`, `space`, `up`, `down`, `left`, `right`. Anything else is rendered as written.

## Accessibility

- Real `<kbd>` elements, so screen readers announce them as keyboard input.
- Glyphs like ⌘ are read by their Unicode names; when the shortcut is essential, mention it in text too ("Press ⌘K to search").

## Tokens used

`--color-bg-subtle`, `--color-border-strong`, `--color-text-muted`, `--font-mono`, `--text-xs`, `--weight-medium`, `--radius-sm`

## Anatomy

```
<span class="db-kbd-group" data-size><kbd class="db-kbd">…</kbd> …</span>
<kbd class="db-kbd" data-size>
```
