# CommandPalette

A ⌘K launcher: one shortcut opens a searchable list of everything the user can do — navigate, create, toggle settings — grouped and filtered as they type. Built on Bits UI's Command inside a Dialog. Give it the app's actions once, in the root layout, and every screen gets keyboard-first navigation.

```svelte
<script>
	import { CommandPalette, theme } from '@ethan/designbook';
	import { goto } from '$app/navigation';
	let open = $state(false);
	const groups = [
		{
			heading: 'Navigate',
			commands: [
				{ id: 'dash', label: 'Dashboard', href: '/', shortcut: 'g+d' },
				{ id: 'orders', label: 'Orders', href: '/orders', keywords: ['trades', 'fills'] }
			]
		},
		{
			heading: 'Actions',
			commands: [
				{
					id: 'new',
					label: 'New order',
					hint: 'Open the ticket',
					shortcut: 'n',
					onSelect: () => goto('/orders/new')
				},
				{ id: 'theme', label: 'Toggle dark mode', onSelect: () => theme.toggleScheme() }
			]
		}
	];
</script>

<CommandPalette bind:open {groups} />
<Button variant="outline" tone="neutral" onclick={() => (open = true)}
	>Search <Kbd keys="mod+k" /></Button
>
```

## Props

| Prop           | Type                         | Default                       | Description                                        |
| -------------- | ---------------------------- | ----------------------------- | -------------------------------------------------- |
| `open`         | `boolean`                    | `false`                       | Bindable.                                          |
| `groups`       | `CommandGroup[]`             | —                             | **Required.** `{ heading, commands }`.             |
| `placeholder`  | `string`                     | `'Type a command or search…'` |                                                    |
| `emptyText`    | `string`                     | `'No results'`                |                                                    |
| `shortcut`     | `string \| null`             | `'mod+k'`                     | Global toggle shortcut; `null` disables it.        |
| `onSelect`     | `(command: Command) => void` | —                             | After any command runs (the palette closes first). |
| `onOpenChange` | `(open: boolean) => void`    | —                             |                                                    |
| `label`        | `string`                     | `'Command palette'`           | Dialog's accessible name.                          |
| `class`        | `string`                     | —                             |                                                    |

### `Command`

| Field      | Type         | Description                                                         |
| ---------- | ------------ | ------------------------------------------------------------------- |
| `id`       | `string`     | Unique; also the value the search matches against.                  |
| `label`    | `string`     |                                                                     |
| `hint`     | `string`     | Muted text after the label.                                         |
| `shortcut` | `string`     | Kbd syntax (`"mod+shift+p"`); display only — bind your own handler. |
| `keywords` | `string[]`   | Extra search terms.                                                 |
| `href`     | `string`     | Renders an `<a>`; navigation happens natively (or via SvelteKit).   |
| `onSelect` | `() => void` | Runs when chosen.                                                   |
| `disabled` | `boolean`    |                                                                     |
| `icon`     | `Snippet`    |                                                                     |

## Keyboard

| Key             | Action                    |
| --------------- | ------------------------- |
| `⌘K` / `Ctrl+K` | Toggle (configurable).    |
| Type            | Filter.                   |
| `↑ ↓`           | Move selection (wraps).   |
| `Enter`         | Run the selected command. |
| `Escape`        | Close.                    |

## Accessibility

- A modal dialog (`role="dialog"`, focus trapped, scroll locked) containing a `combobox` input and a `listbox` of `option`s, wired by Bits UI.
- Group headings label their groups; disabled commands stay visible but unselectable.
- The overlay click and Escape both close it; focus returns to where it was.

## Tokens used

`--color-surface-overlay`, `--color-border`, `--color-component`, `--color-text*`, `--control-h-md`, `--space-*`, `--text-*`, `--weight-semibold`, `--tracking-wide`, `--radius-*`, `--shadow-overlay`, `--z-overlay`, `--z-modal`, `--duration-*`, `--ease-*`

## Anatomy

```
<div class="db-command-palette__overlay">
<div class="db-command-palette" role="dialog">
  <div class="db-command-palette__root">
    <div class="db-command-palette__search"><svg class="db-command-palette__icon"> <input class="db-command-palette__input"> <kbd>
    <div class="db-command-palette__list" role="listbox">
      <div class="db-command-palette__empty">
      <div class="db-command-palette__group"><div class="db-command-palette__heading">
        <div|a class="db-command-palette__item" role="option" [data-selected] [data-disabled]>
          <span class="db-command-palette__item-icon"> <span class="db-command-palette__item-label"> <span class="db-command-palette__item-hint"> <kbd>
```
