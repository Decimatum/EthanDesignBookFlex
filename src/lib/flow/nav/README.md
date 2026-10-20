# Nav

Navigation for the AppShell, vertical (sidebar) or horizontal (top bar): sections with headings, items with icons, badges and active state derived from the current URL, and one accent indicator that slides between active items. Inside a collapsed shell the items become icons (or letter monograms) with tooltips and section headings turn into hairlines.

```svelte
<script>
	import { Nav, NavSection, NavItem } from '@ethan/designbook';
	import { page } from '$app/state';
	import { Home, ListOrdered, Settings } from '@lucide/svelte';
</script>

<Nav current={page.url.pathname}>
	<NavSection title="Trading">
		<NavItem href="/" exact>{#snippet icon()}<Home />{/snippet}Dashboard</NavItem>
		<NavItem href="/orders" badge={3} badgeTone="accent"
			>{#snippet icon()}<ListOrdered />{/snippet}Orders</NavItem
		>
	</NavSection>
	<NavSection title="Account" collapsible>
		<NavItem href="/settings">{#snippet icon()}<Settings />{/snippet}Settings</NavItem>
		<NavItem onclick={signOut}>Sign out</NavItem>
	</NavSection>
</Nav>
```

## Nav props

| Prop          | Type                         | Default       | Description                                                                                                                     |
| ------------- | ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `current`     | `string`                     | —             | Current pathname; items derive `active` from it.                                                                                |
| `orientation` | `'vertical' \| 'horizontal'` | from AppShell | Vertical list or horizontal bar. Inside an AppShell it follows the placement (sidebar/drawer → vertical, top bar → horizontal). |
| `indicator`   | `boolean`                    | `true`        | Render the sliding accent indicator (width from the theme).                                                                     |
| `class`       | `string`                     | —             |                                                                                                                                 |

## NavSection props

| Prop          | Type      | Default | Description                                   |
| ------------- | --------- | ------- | --------------------------------------------- |
| `title`       | `string`  | —       | Uppercase heading; a hairline when collapsed. |
| `collapsible` | `boolean` | `false` | Heading becomes a fold toggle.                |
| `open`        | `boolean` | `true`  | Bindable, with `collapsible`.                 |

## NavItem props

| Prop        | Type                                | Default     | Description                                                       |
| ----------- | ----------------------------------- | ----------- | ----------------------------------------------------------------- |
| `href`      | `string`                            | —           | Renders an `<a>`; omit for a `<button>` with `onclick`.           |
| `active`    | `boolean`                           | derived     | Force the state.                                                  |
| `exact`     | `boolean`                           | `false`     | Match `current` exactly; otherwise `/orders` matches `/orders/…`. |
| `badge`     | `string \| number`                  | —           | Count after the label; a dot in the rail.                         |
| `badgeTone` | `'neutral' \| 'accent' \| 'danger'` | `'neutral'` |                                                                   |
| `disabled`  | `boolean`                           | `false`     |                                                                   |
| `icon`      | `Snippet`                           | —           | Without one, the rail shows the label's first letter.             |

Other anchor attributes (`onclick`, `target`, …) are forwarded.

## Horizontal bars

`<Nav orientation="horizontal">` lays items in a row with a sliding underline (`--shell-nav-underline-h`; folio uses a pill instead). Sections lose their headings and become inline `role="group"`s separated by a hairline, with the title as the group's `aria-label`. The bar scrolls horizontally when it overflows and centres the active item on first render.

## Keyboard

Plain links and buttons: `Tab` through them, `Enter` to follow. Section fold toggles are buttons with `aria-expanded`.

## Accessibility

- The active item carries `aria-current="page"`; the indicator is decorative (`aria-hidden`).
- Collapsed items keep their label in the DOM (visually hidden) and add a `title` tooltip.
- Disabled items are real disabled buttons, never dead links.
- The active item is centred in the sidebar's scroll container on first render, without moving the page.

## Tokens used

`--shell-nav-*`, `--color-component`, `--color-accent*`, `--color-danger*`, `--color-text*`, `--control-h-*`, `--space-*`, `--text-*`, `--weight-*`, `--tracking-wide`, `--radius-*`, `--focus-ring`, `--duration-*`, `--ease-spring`

## Anatomy

```
<div class="db-nav" [data-indicator]>
  <span class="db-nav__indicator">
  <div class="db-nav-section" [data-collapsed]>
    <div|button class="db-nav-section__title"><span class="db-nav-section__text"> <svg class="db-nav-section__chevron">
    <div class="db-nav-section__body">
      <a|button class="db-nav-item" [data-active] [data-collapsed] [aria-current="page"]>
        <span class="db-nav-item__icon [db-nav-item__monogram]"> <span class="db-nav-item__label"> <span class="db-nav-item__badge">
```
