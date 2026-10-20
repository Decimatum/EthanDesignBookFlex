<script lang="ts">
	import '$lib/styles/fonts.css';
	import '$lib/styles/index.css';
	import { page, navigating } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { nav } from '$docs/nav.js';
	import ThemeSwitcher from '$docs/ThemeSwitcher.svelte';
	import {
		AppShell,
		Nav,
		NavSection,
		NavItem,
		Kbd,
		Button,
		CommandPalette,
		Toaster,
		RouteProgress,
		viewTransition,
		slideByDepth
	} from '$lib/index.js';
	import {
		Palette,
		Type,
		Ruler,
		Sparkles,
		Layers,
		PanelsTopLeft,
		Command,
		ArrowRightLeft,
		Loader,
		ListChecks,
		LayoutDashboard,
		Route,
		Search,
		LockKeyhole,
		ShoppingCart,
		SlidersHorizontal
	} from '@lucide/svelte';
	import { theme } from '$lib/theme/theme.svelte.js';

	let { children } = $props();

	// The docs site is the biggest demo: real route progress and view transitions.
	onNavigate(viewTransition({ pick: slideByDepth }));

	// Icons for the foundations and flow pages; components fall back to a monogram in the rail.
	const icons: Record<string, typeof Palette> = {
		'/foundations/colors/': Palette,
		'/foundations/typography/': Type,
		'/foundations/spacing/': Ruler,
		'/foundations/motion/': Sparkles,
		'/flow/app-shell/': PanelsTopLeft,
		'/flow/command-palette/': Command,
		'/flow/page-transition/': ArrowRightLeft,
		'/flow/route-progress/': Loader,
		'/flow/stepper/': ListChecks,
		'/patterns/auth/': LockKeyhole,
		'/patterns/checkout/': ShoppingCart,
		'/patterns/dashboard/': LayoutDashboard,
		'/patterns/onboarding/': Route,
		'/patterns/settings/': SlidersHorizontal
	};
	let collapsed = $state(false);
	let paletteOpen = $state(false);

	// Every docs page plus the theme axes, reachable from ⌘K.
	const commands = [
		...nav.map((section) => ({
			heading: section.title,
			commands: section.items.map((item) => ({ id: item.href, label: item.title, href: item.href }))
		})),
		{
			heading: 'Theme',
			commands: [
				{
					id: 'scheme',
					label: 'Toggle light / dark',
					shortcut: 'mod+shift+l',
					onSelect: () => theme.toggleScheme()
				},
				...(['slate', 'folio', 'terminal'] as const).map((t) => ({
					id: `theme-${t}`,
					label: `Use ${t} theme`,
					onSelect: () => theme.set({ theme: t })
				})),
				{
					id: 'density',
					label: 'Toggle density',
					onSelect: () =>
						theme.set({ density: theme.current.density === 'compact' ? 'comfortable' : 'compact' })
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Design Book</title>
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>
<RouteProgress active={navigating.to !== null} />

<AppShell
	bind:collapsed
	sidebarLabel="Docs"
	sidebarWidth="15.5rem"
	contentWidth="var(--container-lg)"
>
	{#snippet brand({ collapsed })}
		<a href="/" class="brand" aria-label="Design Book home">
			<span class="brand__mark" aria-hidden="true"><Layers /></span>
			{#if !collapsed}<span class="brand__name">Design Book</span>{/if}
		</a>
	{/snippet}
	{#snippet header()}
		<Button variant="outline" tone="neutral" size="sm" onclick={() => (paletteOpen = true)}>
			{#snippet leading()}<Search />{/snippet}
			Search
		</Button>
		<ThemeSwitcher />
	{/snippet}
	{#snippet sidebar({ close })}
		<Nav current={page.url.pathname}>
			{#each nav as section (section.title)}
				<NavSection title={section.title}>
					{#each section.items as item (item.href)}
						{@const Icon = icons[item.href]}
						{#if Icon}
							<NavItem href={item.href} exact onclick={close}>
								{#snippet icon()}<Icon />{/snippet}
								{item.title}
							</NavItem>
						{:else}
							<NavItem href={item.href} exact onclick={close}>{item.title}</NavItem>
						{/if}
					{/each}
				</NavSection>
			{/each}
		</Nav>
	{/snippet}
	{#snippet sidebarFooter({ collapsed })}
		{#if !collapsed}
			<button type="button" class="sidebar-hint" onclick={() => (paletteOpen = true)}>
				<Kbd keys="mod+k" size="sm" /> Jump to…
			</button>
		{/if}
	{/snippet}
	<div class="page">
		{@render children()}
	</div>
</AppShell>

<CommandPalette
	bind:open={paletteOpen}
	groups={commands}
	placeholder="Jump to a page or change the theme…"
/>
<Toaster />

<style>
	.skip-link {
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		z-index: var(--z-toast);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		text-decoration: none;
		transform: translateY(-200%);
	}
	.skip-link:focus-visible {
		transform: none;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2-5);
		min-width: 0;
		border-radius: var(--radius-md);
	}
	.brand:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.brand__mark {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		box-shadow: var(--shadow-xs);
	}
	.brand__mark :global(svg) {
		width: 1rem;
		height: 1rem;
	}
	.brand__name {
		white-space: nowrap;
	}
	.sidebar-hint {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1-5);
		height: var(--control-h-sm);
		padding-inline: var(--space-1-5);
		border-radius: var(--shell-nav-radius);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		white-space: nowrap;
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.sidebar-hint:hover {
		color: var(--color-text);
		background: var(--shell-nav-hover-bg);
	}
	.sidebar-hint:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	/* ---- page prose (the docs pages themselves). Scoped to direct children so components inside
	   demos (Heading, Text, Table) are never restyled by the docs. ---- */
	.page > :global(h1) {
		margin-block-end: var(--space-2);
	}
	.page > :global(h2) {
		margin-block: var(--space-10) var(--space-3);
		padding-block-end: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}
	.page > :global(p) {
		max-width: 65ch;
		color: var(--color-text-muted);
	}
	.page > :global(p + p) {
		margin-block-start: var(--space-3);
	}
	.page > :global(.lead) {
		font-size: var(--text-lg);
	}
	.page > :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
		margin-block: var(--space-4);
	}
	.page > :global(table th),
	.page > :global(table td) {
		text-align: left;
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		vertical-align: top;
	}
	.page > :global(table th) {
		color: var(--color-text-muted);
		font-weight: var(--weight-medium);
	}
	.page :global(code) {
		padding: 0.1em 0.35em;
		border-radius: var(--radius-xs);
		background: var(--color-component);
	}
</style>
