<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Where the navigation lives on wide viewports: a vertical sidebar column, or a horizontal
		 * bar in the header. Below 64rem both become the off-canvas drawer.
		 */
		navigation?: 'sidebar' | 'top';
		/** Sidebar width on wide viewports (CSS length). */
		sidebarWidth?: string;
		/** Width of the collapsed icon rail. */
		railWidth?: string;
		/** Right rail width, when `aside` is given. */
		asideWidth?: string;
		/** Bindable: the sidebar is collapsed to an icon rail on wide viewports. */
		collapsed?: boolean;
		/** Show the collapse toggle at the bottom of the sidebar. */
		collapsible?: boolean;
		/** Bindable: whether the off-canvas sidebar is open on narrow viewports. */
		sidebarOpen?: boolean;
		/** Accessible name of the sidebar landmark. */
		sidebarLabel?: string;
		/** id of the `<main>` element, the target of a skip link. */
		mainId?: string;
		/** Nested inside another page (a demo, a preview): renders a plain `<div>` instead of a second `<main>`, and watches its own scroll instead of the window's. */
		embedded?: boolean;
		/** Max width of the content inside the surface; `none` for full-bleed dashboards. */
		contentWidth?: string;
		/** Logo / product name; sits at the start of the header, above the sidebar column. */
		brand?: Snippet<[{ collapsed: boolean }]>;
		/** Rest of the top bar (search, actions, user). Receives `{ toggle, sidebarOpen }`. */
		header?: Snippet<[{ toggle: () => void; sidebarOpen: boolean }]>;
		/** Navigation column; becomes an off-canvas drawer below 64rem. */
		sidebar?: Snippet<[{ close: () => void; collapsed: boolean }]>;
		/** Pinned to the bottom of the sidebar (user menu, status, version). */
		sidebarFooter?: Snippet<[{ collapsed: boolean }]>;
		/** Optional right rail (filters, table of contents); hidden below 80rem. */
		aside?: Snippet;
		/** Bottom navigation on narrow viewports (a `TabBar`); the main area leaves room for it. */
		tabBar?: Snippet;
		footer?: Snippet;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Menu as MenuIcon, X, PanelLeftClose, PanelLeftOpen } from '@lucide/svelte';
	import NavHost from './NavHost.svelte';

	let {
		navigation = 'sidebar',
		sidebarWidth = '16rem',
		railWidth = '3.5rem',
		asideWidth = '18rem',
		collapsed = $bindable(false),
		collapsible = true,
		sidebarOpen = $bindable(false),
		sidebarLabel = 'Main navigation',
		mainId = 'main',
		embedded = false,
		contentWidth = 'none',
		brand,
		header,
		sidebar,
		sidebarFooter,
		aside,
		tabBar,
		footer,
		children,
		class: className,
		...rest
	}: AppShellProps = $props();

	const own = $props.id();
	const sidebarId = `db-app-shell-sidebar-${own}`;
	const toggle = () => (sidebarOpen = !sidebarOpen);
	const close = () => (sidebarOpen = false);
	const toggleCollapsed = () => (collapsed = !collapsed);

	const topNav = $derived(navigation === 'top');

	// The header turns frosted once content has scrolled beneath it.
	let scrolled = $state(false);
	function onWindowScroll() {
		if (!embedded) scrolled = window.scrollY > 4;
	}
	function onEmbeddedScroll(e: Event) {
		scrolled = (e.currentTarget as HTMLElement).scrollTop > 4;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && sidebarOpen) close();
	}
</script>

<svelte:window {onkeydown} onscroll={onWindowScroll} />

<div
	{...rest}
	class={['db-app-shell', className]}
	style:--_sidebar-w={sidebarWidth}
	style:--_rail-w={railWidth}
	style:--_aside-w={asideWidth}
	style:--_content-w={contentWidth}
	data-has-sidebar={sidebar && !topNav ? true : undefined}
	data-has-drawer={sidebar ? true : undefined}
	data-navigation={navigation}
	data-has-aside={aside ? true : undefined}
	data-has-tab-bar={tabBar ? true : undefined}
	data-sidebar-open={sidebarOpen || undefined}
	data-collapsed={collapsed || undefined}
	data-scrolled={scrolled || undefined}
	data-embedded={embedded || undefined}
>
	<header class="db-app-shell__header">
		<div class="db-app-shell__brand">
			{#if sidebar}
				<button
					type="button"
					class="db-app-shell__menu"
					aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
					aria-expanded={sidebarOpen}
					aria-controls={sidebarId}
					onclick={toggle}
				>
					{#if sidebarOpen}<X aria-hidden="true" />{:else}<MenuIcon aria-hidden="true" />{/if}
				</button>
			{/if}
			{#if brand}{@render brand({ collapsed })}{/if}
		</div>
		{#if sidebar && topNav}
			<nav class="db-app-shell__topnav" aria-label={sidebarLabel}>
				<NavHost placement="topbar">{@render sidebar({ close, collapsed: false })}</NavHost>
			</nav>
		{/if}
		{#if header}
			<div class="db-app-shell__bar">{@render header({ toggle, sidebarOpen })}</div>
		{/if}
	</header>

	{#if sidebar}
		<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
		<div class="db-app-shell__scrim" onclick={close}></div>
		<nav
			class="db-app-shell__sidebar"
			id={sidebarId}
			aria-label={topNav ? `${sidebarLabel} (menu)` : sidebarLabel}
		>
			<div class="db-app-shell__sidebar-body">
				<NavHost placement="sidebar" {collapsed}>{@render sidebar({ close, collapsed })}</NavHost>
			</div>
			{#if sidebarFooter || (collapsible && !topNav)}
				<div class="db-app-shell__sidebar-footer">
					{#if sidebarFooter}{@render sidebarFooter({ collapsed })}{/if}
					{#if collapsible && !topNav}
						<button
							type="button"
							class="db-app-shell__collapse"
							aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
							aria-pressed={collapsed}
							onclick={toggleCollapsed}
						>
							{#if collapsed}<PanelLeftOpen aria-hidden="true" />{:else}<PanelLeftClose
									aria-hidden="true"
								/>{/if}
						</button>
					{/if}
				</div>
			{/if}
		</nav>
	{/if}

	<svelte:element
		this={embedded ? 'div' : 'main'}
		class="db-app-shell__main"
		id={mainId}
		tabindex={embedded ? 0 : -1}
		role={embedded ? 'region' : undefined}
		aria-label={embedded ? `${sidebarLabel} content` : undefined}
		onscroll={embedded ? onEmbeddedScroll : undefined}
	>
		<div class="db-app-shell__surface">
			<div class="db-app-shell__content">{@render children()}</div>
		</div>
	</svelte:element>

	{#if aside}
		<aside class="db-app-shell__aside">{@render aside()}</aside>
	{/if}

	{#if footer}
		<footer class="db-app-shell__footer">{@render footer()}</footer>
	{/if}

	{#if tabBar}{@render tabBar()}{/if}
</div>

<style>
	/* ---------- canvas + grid ---------- */
	.db-app-shell {
		--_header-h: calc(var(--control-h-lg) + var(--space-4));
		--_col: var(--_sidebar-w);
		--_vh: var(--db-app-shell-min-height, 100dvh); /* public hook for embedding */
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'header'
			'main'
			'footer';
		min-height: var(--_vh);
		background: var(--shell-canvas);
		color: var(--color-text);
		font-family: var(--font-body);
	}
	/* Embedded: the shell is a fixed-height box and only its main area scrolls, so the header and
	   sidebar need no sticky positioning (which nested scrollers render unreliably). */
	.db-app-shell[data-embedded] {
		height: var(--_vh);
		grid-template-rows: auto minmax(0, 1fr) auto;
		overflow: hidden;
		position: relative;
	}
	.db-app-shell[data-embedded] .db-app-shell__main {
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.db-app-shell[data-embedded] .db-app-shell__header {
		position: relative;
	}
	.db-app-shell[data-collapsed] {
		--_col: var(--_rail-w);
	}

	/* ---------- header: transparent on the canvas, frosted once scrolled ---------- */
	.db-app-shell__header {
		grid-area: header;
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		display: flex;
		align-items: center;
		min-height: var(--_header-h);
		padding-inline: var(--shell-gap);
		border-bottom: 1px solid transparent;
		transition:
			background-color var(--duration-base) var(--ease-standard),
			border-color var(--duration-base) var(--ease-standard),
			box-shadow var(--duration-base) var(--ease-standard);
	}
	.db-app-shell[data-scrolled] .db-app-shell__header {
		background: var(--shell-header-bg);
		-webkit-backdrop-filter: blur(var(--shell-header-blur));
		backdrop-filter: blur(var(--shell-header-blur));
		border-bottom-color: var(--color-border);
	}
	.db-app-shell__brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: none;
		min-width: 0;
		padding-inline-start: var(--space-2);
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		font-size: var(--text-lg);
		transition: width var(--duration-slow) var(--ease-standard);
	}
	.db-app-shell__brand :global(a) {
		color: inherit;
		text-decoration: none;
	}
	.db-app-shell__topnav {
		display: none; /* shown at ≥ 64rem */
	}
	.db-app-shell__bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex: 1;
		min-width: 0;
		justify-content: flex-end;
	}
	.db-app-shell__menu,
	.db-app-shell__collapse {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--control-h-md);
		height: var(--control-h-md);
		border-radius: var(--control-radius);
		color: var(--color-text-muted);
		transition: var(--transition-colors);
	}
	.db-app-shell__menu:hover,
	.db-app-shell__collapse:hover {
		background: var(--shell-nav-hover-bg);
		color: var(--color-text);
	}
	.db-app-shell__menu:focus-visible,
	.db-app-shell__collapse:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-app-shell__menu :global(svg),
	.db-app-shell__collapse :global(svg) {
		width: 1.2rem;
		height: 1.2rem;
	}
	.db-app-shell__collapse {
		display: none;
	}

	/* ---------- sidebar: off-canvas drawer below 64rem ---------- */
	.db-app-shell__sidebar {
		grid-area: main;
		position: fixed;
		inset-block: 0;
		inset-inline-start: 0;
		z-index: var(--z-overlay);
		display: flex;
		flex-direction: column;
		width: min(var(--_sidebar-w), calc(100vw - var(--space-12)));
		background: var(--color-surface);
		border-inline-end: 1px solid var(--color-border);
		box-shadow: var(--shadow-overlay);
		transform: translateX(-100%);
		visibility: hidden;
		transition:
			transform var(--duration-slow) var(--ease-decelerate),
			visibility 0s var(--duration-slow);
	}
	.db-app-shell[data-embedded] .db-app-shell__sidebar {
		position: absolute;
	}
	.db-app-shell[data-sidebar-open] .db-app-shell__sidebar {
		transform: none;
		visibility: visible;
		transition:
			transform var(--duration-slow) var(--ease-decelerate),
			visibility 0s;
	}
	.db-app-shell__sidebar-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: var(--space-3) var(--space-2);
		scrollbar-width: thin;
	}
	.db-app-shell__sidebar-footer {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border-top: 1px solid var(--color-border);
	}
	.db-app-shell__scrim {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-overlay) - 1);
		background: color-mix(in srgb, var(--color-text) 40%, transparent);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity var(--duration-base) var(--ease-standard),
			visibility 0s var(--duration-base);
	}
	.db-app-shell[data-embedded] .db-app-shell__scrim {
		position: absolute;
	}
	.db-app-shell[data-sidebar-open] .db-app-shell__scrim {
		opacity: 1;
		visibility: visible;
		transition: opacity var(--duration-base) var(--ease-standard);
	}

	/* ---------- main: a surface floating on the canvas ---------- */
	.db-app-shell__main {
		grid-area: main;
		min-width: 0;
		display: flex;
		flex-direction: column;
		padding: 0 var(--shell-gap) var(--shell-gap);
	}
	.db-app-shell__main:focus {
		outline: none;
	}
	.db-app-shell__surface {
		flex: 1;
		min-width: 0;
		background: var(--shell-surface);
		border: 1px solid var(--shell-surface-border);
		border-radius: var(--shell-radius);
		box-shadow: var(--shell-surface-shadow);
	}
	.db-app-shell__content {
		max-width: var(--_content-w);
		margin-inline: auto;
		padding: var(--space-6) var(--space-5);
	}

	/* ---------- aside + footer ---------- */
	.db-app-shell__aside {
		display: none;
		grid-area: aside;
		padding: var(--space-5) var(--space-4) var(--shell-gap) 0;
	}
	.db-app-shell__footer {
		grid-area: footer;
		padding: var(--space-3) calc(var(--shell-gap) + var(--space-3));
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* Below the sidebar breakpoint a TabBar sits over the bottom edge; keep the page clear of it. */
	@media (max-width: 63.999rem) {
		.db-app-shell[data-has-tab-bar] .db-app-shell__main {
			padding-bottom: calc(
				var(--shell-gap) + var(--control-h-lg) + var(--space-3) + env(safe-area-inset-bottom, 0px)
			);
		}
	}

	/* ---------- wide: sidebar is a column on the canvas; collapses to a rail ---------- */
	@media (min-width: 64rem) {
		.db-app-shell[data-has-sidebar] {
			grid-template-columns: var(--_col) minmax(0, 1fr);
			grid-template-areas:
				'header header'
				'sidebar main'
				'footer footer';
			transition: grid-template-columns var(--duration-slow) var(--ease-standard);
		}
		.db-app-shell[data-has-sidebar] .db-app-shell__brand {
			/* the brand block lines up with the sidebar column below it */
			width: calc(var(--_col) - var(--shell-gap));
		}
		/* Top navigation: the drawer disappears on wide viewports; the header carries the nav. */
		.db-app-shell[data-navigation='top'] .db-app-shell__sidebar {
			display: none;
		}
		.db-app-shell__topnav {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
			margin-inline: var(--space-4);
		}
		.db-app-shell[data-navigation='top'] .db-app-shell__bar {
			flex: none; /* the nav gets the slack, the actions keep their natural width */
		}
		.db-app-shell__menu,
		.db-app-shell__scrim {
			display: none;
		}
		.db-app-shell__collapse {
			display: inline-flex;
			margin-inline-start: auto;
		}
		.db-app-shell[data-collapsed] .db-app-shell__collapse {
			margin-inline: auto;
		}
		.db-app-shell__sidebar {
			grid-area: sidebar;
			position: sticky;
			inset: auto; /* clear the drawer's inset before setting top */
			top: var(--_header-h);
			z-index: auto;
			width: auto;
			height: calc(var(--_vh) - var(--_header-h));
			background: var(--shell-sidebar-bg);
			border-inline-end: 1px solid var(--shell-sidebar-border);
			box-shadow: none;
			transform: none;
			visibility: visible;
			transition: none;
		}
		.db-app-shell[data-embedded] .db-app-shell__sidebar {
			position: relative; /* beats the drawer's absolute positioning; the box itself doesn't scroll */
			top: 0;
			height: auto;
		}
		.db-app-shell[data-embedded] .db-app-shell__aside {
			position: relative;
			top: 0;
			height: auto;
		}
		.db-app-shell__sidebar-footer {
			border-top-color: transparent;
		}
		.db-app-shell__content {
			padding: var(--space-8) var(--space-8);
		}
	}
	@media (min-width: 80rem) {
		.db-app-shell[data-has-sidebar][data-has-aside] {
			grid-template-columns: var(--_col) minmax(0, 1fr) var(--_aside-w);
			grid-template-areas:
				'header header header'
				'sidebar main aside'
				'footer footer footer';
		}
		.db-app-shell[data-has-aside]:not([data-has-sidebar]) {
			grid-template-columns: minmax(0, 1fr) var(--_aside-w);
			grid-template-areas:
				'header header'
				'main aside'
				'footer footer';
		}
		.db-app-shell__aside {
			display: block;
			position: sticky;
			top: var(--_header-h);
			height: calc(var(--_vh) - var(--_header-h));
			overflow-y: auto;
		}
	}
</style>
