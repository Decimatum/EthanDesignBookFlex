# TabBar

Bottom navigation for phones: three to five sections, each an icon over a short label, one thumb-tap away. It sits fixed to the bottom edge (respecting the home-indicator safe area), is hidden at the sidebar breakpoint (≥ 64rem) where `AppShell`'s sidebar takes over, and derives the active item from the current path the same way `Nav` does. Give `AppShell` the `tabBar` snippet and it keeps the main area clear of it. Dependency-free.

```svelte
<script>
	import { AppShell, TabBar } from '@ethan/designbook';
	import { page } from '$app/state';
	import { Sun, CalendarDays, Users } from '@lucide/svelte';
</script>

<AppShell>
	{#snippet tabBar()}
		<TabBar
			current={page.url.pathname}
			items={[
				{ href: '/', label: 'Today', icon: sun, exact: true },
				{ href: '/calendar', label: 'Calendar', icon: cal },
				{ href: '/clients', label: 'Clients', icon: users, badge: 2, badgeTone: 'accent' }
			]}
		/>
	{/snippet}
	…
</AppShell>
{#snippet sun()}<Sun />{/snippet}
{#snippet cal()}<CalendarDays />{/snippet}
{#snippet users()}<Users />{/snippet}
```

## Props

| Prop      | Type           | Default      | Description                                                                                                                  |
| --------- | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `items`   | `TabBarItem[]` | —            | **Required.** `{ href, label, icon?, badge?, badgeTone?, exact?, active?, onclick? }`; 3–5 items. `active` forces the state. |
| `current` | `string`       | —            | Current pathname; items derive `aria-current` from it (prefix match, `exact` for `/`).                                       |
| `label`   | `string`       | `'Sections'` | `aria-label` of the `<nav>` landmark.                                                                                        |
| `always`  | `boolean`      | `false`      | Show at every width (by default hidden at ≥ 64rem).                                                                          |
| `class`   | `string`       | —            |                                                                                                                              |

Item `icon` is a snippet rendering an SVG (Lucide); without one the label's first letter stands in.

## Keyboard

| Key     | Action                  |
| ------- | ----------------------- |
| `Tab`   | Moves across the items. |
| `Enter` | Follows the link.       |

## Accessibility

- A `<nav aria-label>` landmark holding a list of links; the active one carries `aria-current="page"`.
- Badges are read as part of the link name (", 2"); the icon is decorative.
- Labels are always visible — no icon-only tabs — and the touch target is at least the large control height.
- `backdrop-filter` keeps the bar legible over scrolling content; the text sits on `--shell-header-bg`.

## Tokens used

`--shell-header-bg`, `--shell-header-blur`, `--shell-nav-fg`, `--shell-nav-active-fg`, `--shell-nav-active-bg`, `--color-border`, `--color-focus`, `--color-neutral`, `--color-neutral-fg`, `--color-accent`, `--color-accent-fg`, `--color-danger`, `--color-danger-fg`, `--control-h-lg`, `--space-*`, `--text-xs`, `--radius-sm`, `--radius-full`, `--duration-fast`, `--ease-standard`, `--font-body`.

## Anatomy

```
<nav class="db-tab-bar" [data-always]>
  <ul class="db-tab-bar__list">
    <li class="db-tab-bar__item">
      <a class="db-tab-bar__link" [data-active] [aria-current=page]>
        <span class="db-tab-bar__icon"> …icon… <span class="db-tab-bar__badge" data-tone>
        <span class="db-tab-bar__label">
```
