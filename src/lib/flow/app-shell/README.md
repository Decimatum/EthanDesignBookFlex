# AppShell

The frame of an application, built as layered surfaces: a canvas behind everything, the navigation sidebar living directly on it, and the page as a rounded surface floating above. The header is transparent until content scrolls beneath it, then turns frosted. On wide screens the sidebar collapses to an icon rail; on narrow ones it becomes an off-canvas drawer. Each theme expresses the layering its own way — slate with hairlines and a soft tint, folio with paper-on-linen shadows and pill navigation, terminal with bordered panels and a rail indicator — through the `--shell-*` tokens.

Pair it with the `Nav` components for the sidebar, `RouteProgress` and `CommandPalette` in the root layout.

```svelte
<script>
	import { AppShell, Nav, NavSection, NavItem, RouteProgress } from '@ethan/designbook';
	import { page, navigating } from '$app/state';
	let { children } = $props();
</script>

<a class="skip-link" href="#main">Skip to content</a>
<RouteProgress active={navigating.to !== null} />

<AppShell>
	{#snippet brand({ collapsed })}<a href="/">{collapsed ? 'A' : 'Acme'}</a>{/snippet}
	{#snippet header()}<SearchButton /> <UserMenu />{/snippet}
	{#snippet sidebar({ close })}
		<Nav current={page.url.pathname}>
			<NavSection title="Trading">
				<NavItem href="/" exact onclick={close}
					>{#snippet icon()}<Home />{/snippet}Dashboard</NavItem
				>
				<NavItem href="/orders" badge={3} onclick={close}
					>{#snippet icon()}<List />{/snippet}Orders</NavItem
				>
			</NavSection>
		</Nav>
	{/snippet}
	{#snippet sidebarFooter({ collapsed })}<UserChip compact={collapsed} />{/snippet}
	{@render children()}
</AppShell>
```

## Props

| Prop           | Type                 | Default             | Description                                                                                        |
| -------------- | -------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| `navigation`   | `'sidebar' \| 'top'` | `'sidebar'`         | Vertical sidebar column, or a horizontal bar in the header. Both fold into the drawer below 64rem. |
| `sidebarWidth` | `string`             | `'16rem'`           | Sidebar column width at ≥ 64rem.                                                                   |
| `railWidth`    | `string`             | `'3.5rem'`          | Width when collapsed.                                                                              |
| `asideWidth`   | `string`             | `'18rem'`           | Right rail width at ≥ 80rem.                                                                       |
| `collapsed`    | `boolean`            | `false`             | Bindable: icon rail on wide viewports. Nav items read this via context.                            |
| `collapsible`  | `boolean`            | `true`              | Show the collapse toggle at the bottom of the sidebar.                                             |
| `sidebarOpen`  | `boolean`            | `false`             | Bindable: off-canvas drawer on narrow viewports.                                                   |
| `sidebarLabel` | `string`             | `'Main navigation'` | `aria-label` of the `<nav>` landmark.                                                              |
| `mainId`       | `string`             | `'main'`            | id of `<main>`, for a skip link.                                                                   |
| `embedded`     | `boolean`            | `false`             | Nested in another page: a `<div>` instead of `<main>`, own scroll container.                       |
| `contentWidth` | `string`             | `'none'`            | Max width of content inside the surface (`var(--container-lg)` for docs).                          |
| `class`        | `string`             | —                   |                                                                                                    |

Snippets: `brand({ collapsed })`, `header({ toggle, sidebarOpen })`, `sidebar({ close, collapsed })`, `sidebarFooter({ collapsed })`, `aside`, `footer`, `tabBar` (a `TabBar` for narrow viewports; the main area leaves room for it below 64rem), `children`. Other props go to the root element.

The shell fills the viewport; set `--db-app-shell-min-height` on it to embed one in a page.

## Theme tokens

`semantic.css` defines the defaults; each theme overrides them:

| Token                                          | Meaning                                              |
| ---------------------------------------------- | ---------------------------------------------------- |
| `--shell-canvas`                               | Background behind everything.                        |
| `--shell-sidebar-bg`, `--shell-sidebar-border` | Sidebar panel (transparent on slate/folio).          |
| `--shell-surface`, `-border`, `-shadow`        | The floating page surface.                           |
| `--shell-radius`, `--shell-gap`                | Surface corner radius and the gutter around it.      |
| `--shell-header-bg`, `--shell-header-blur`     | Frosted header once scrolled.                        |
| `--shell-nav-*`                                | Nav item colours, active pill, indicator rail width. |

## Top navigation

`navigation="top"` renders the `sidebar` snippet inside the header as a horizontal `Nav` (it orients itself from the placement, so the same snippet serves both layouts) and hides the sidebar column; `collapsed`/`collapsible` don't apply. Below 64rem the menu button opens the same content as a vertical drawer. Keep top bars to a handful of items — long lists belong in a sidebar.

## Breakpoints

| Width   | Layout                                                                   |
| ------- | ------------------------------------------------------------------------ |
| < 64rem | Menu button in the header; sidebar slides in over a scrim; no aside.     |
| ≥ 64rem | Sidebar is a sticky column that can collapse to a rail (width animates). |
| ≥ 80rem | Aside appears as a third column.                                         |

## Keyboard

`Escape` closes the open drawer; the scrim closes it too. The collapse toggle is a pressed-state button. Sidebar links should call `close()` so choosing a page dismisses the drawer.

## Accessibility

- Landmarks: `<header>` (banner), `<nav aria-label>`, `<main id tabindex="-1">`, `<aside>`, `<footer>`.
- Menu button: `aria-expanded` + `aria-controls`; collapse button: `aria-pressed` with a label that flips.
- The closed drawer is `visibility: hidden`, so its links leave the tab order. Collapsed nav items keep their labels visually hidden and expose them as tooltips.
- The frosted header uses `backdrop-filter`; text stays on a solid-enough tint for contrast.

## Anatomy

```
<div class="db-app-shell" [data-has-sidebar] [data-has-aside] [data-collapsed] [data-sidebar-open] [data-scrolled] [data-embedded]>
  <header class="db-app-shell__header">
    <div class="db-app-shell__brand"><button class="db-app-shell__menu"> …brand…
    <div class="db-app-shell__bar"> …header…
  <div class="db-app-shell__scrim">
  <nav class="db-app-shell__sidebar">
    <div class="db-app-shell__sidebar-body">
    <div class="db-app-shell__sidebar-footer"> …sidebarFooter… <button class="db-app-shell__collapse">
  <main class="db-app-shell__main"><div class="db-app-shell__surface"><div class="db-app-shell__content">
  <aside class="db-app-shell__aside">
  <footer class="db-app-shell__footer">
```
