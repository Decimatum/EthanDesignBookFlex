# Menu

A dropdown menu of actions, built on Bits UI's DropdownMenu: arrow-key navigation, typeahead, focus return and dismissal are handled for you. Compose it from `Menu`, `MenuItem`, `MenuCheckboxItem`, `MenuGroup` and `MenuSeparator`.

```svelte
<script>
	import {
		Menu,
		MenuItem,
		MenuGroup,
		MenuSeparator,
		MenuCheckboxItem,
		Button
	} from '@ethan/designbook';
	import { Pencil, Trash2, Download, MoreHorizontal } from '@lucide/svelte';
	let showHidden = $state(false);
</script>

<Menu>
	{#snippet trigger(props)}
		<Button {...props} iconOnly aria-label="More actions" variant="ghost" tone="neutral">
			{#snippet leading()}<MoreHorizontal />{/snippet}
		</Button>
	{/snippet}

	<MenuGroup label="File">
		<MenuItem onSelect={rename} shortcut="⌘R"
			>{#snippet leading()}<Pencil />{/snippet}Rename</MenuItem
		>
		<MenuItem href="/export">{#snippet leading()}<Download />{/snippet}Download</MenuItem>
	</MenuGroup>
	<MenuSeparator />
	<MenuCheckboxItem bind:checked={showHidden}>Show hidden files</MenuCheckboxItem>
	<MenuSeparator />
	<MenuItem tone="danger" onSelect={remove}>{#snippet leading()}<Trash2 />{/snippet}Delete</MenuItem
	>
</Menu>
```

## Menu props

| Prop           | Type                                     | Default    | Description |
| -------------- | ---------------------------------------- | ---------- | ----------- |
| `open`         | `boolean`                                | `false`    | Bindable.   |
| `side`         | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |             |
| `align`        | `'start' \| 'center' \| 'end'`           | `'start'`  |             |
| `minWidth`     | `string`                                 | `'12rem'`  |             |
| `onOpenChange` | `(open: boolean) => void`                | —          |             |

Snippets: `trigger(props)` (required, spread onto the button) and `children` (the items).

## MenuItem props

| Prop       | Type                    | Default     | Description                           |
| ---------- | ----------------------- | ----------- | ------------------------------------- |
| `onSelect` | `() => void`            | —           | Chosen via click, Enter or Space.     |
| `href`     | `string`                | —           | Render as a link.                     |
| `disabled` | `boolean`               | `false`     |                                       |
| `tone`     | `'default' \| 'danger'` | `'default'` |                                       |
| `shortcut` | `string`                | —           | Display-only hint, e.g. `"⌘S"`.       |
| `keepOpen` | `boolean`               | `false`     | Don't close the menu after selecting. |

Snippets: `leading` (icon), `children` (label).

## MenuCheckboxItem props

`checked` (bindable), `onCheckedChange`, `disabled`, `keepOpen` (default `true`). Snippet: `children`.

## MenuGroup / MenuSeparator

`MenuGroup` takes an optional `label`. `MenuSeparator` has no props.

## Keyboard

| Key                                | Action                                 |
| ---------------------------------- | -------------------------------------- |
| `↓` / `Enter` / `Space` on trigger | Open and focus the first item.         |
| `↑ ↓`                              | Move between items (wraps).            |
| `Home` / `End`                     | First / last item.                     |
| Letters                            | Typeahead to a matching item.          |
| `Enter` / `Space`                  | Select.                                |
| `Escape`                           | Close and return focus to the trigger. |

## Accessibility

- `role="menu"` / `menuitem` / `menuitemcheckbox` with `aria-checked`, `aria-disabled` and group headings, all from Bits UI.
- Shortcut hints are `aria-hidden` (they are hints, not bindings — wire the real shortcut yourself).
- Link items render a real `<a>` so middle-click and copy-link work.

## Tokens used

`--z-popover`, `--color-surface-overlay`, `--color-border`, `--color-component`, `--color-danger-*`, `--color-text*`, `--shadow-lg`, `--radius-*`, `--control-h-sm`, `--space-*`, `--text-*`, `--font-mono`

## Anatomy

```
<div class="db-menu" role="menu" data-state data-side>
  <div class="db-menu-group"> <div class="db-menu-group__label">
  <div class="db-menu-item" role="menuitem" data-tone [data-highlighted] [data-disabled]>
    <span class="db-menu-item__icon"> <span class="db-menu-item__label"> <kbd class="db-menu-item__shortcut">
  <div class="db-menu-item db-menu-item--checkbox" role="menuitemcheckbox"> <span class="db-menu-item__check">
  <div class="db-menu-separator">
```
