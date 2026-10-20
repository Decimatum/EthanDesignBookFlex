<script lang="ts">
	import {
		AppShell,
		Nav,
		NavSection,
		NavItem,
		Button,
		Text,
		Heading,
		Stack,
		Card,
		Kbd
	} from '$lib/index.js';
	import { LayoutDashboard, ListOrdered, History, Settings, BookOpen, Users } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let open = $state(false);
	let collapsed = $state(false);
	let current = $state('#dashboard');
	let topCurrent = $state('dashboard');
</script>

<h1>App shell</h1>
<p class="lead">
	Layered surfaces: a canvas, the navigation on it, and the page floating above. The frame every app
	starts from — this site is built on it.
</p>

<Demo
	title="Embedded shell — collapse the sidebar, scroll the content, try the themes"
	stack
	code={`<AppShell bind:collapsed>
	{#snippet brand({ collapsed })}<a href="/">{collapsed ? 'A' : 'Acme'}</a>{/snippet}
	{#snippet header()}<SearchButton /> <UserMenu />{/snippet}
	{#snippet sidebar({ close })}
		<Nav current={page.url.pathname}>
			<NavSection title="Trading">
				<NavItem href="/" exact onclick={close}>{#snippet icon()}<Home />{/snippet}Dashboard</NavItem>
				…
			</NavSection>
		</Nav>
	{/snippet}
	{#snippet sidebarFooter({ collapsed })}<UserChip compact={collapsed} />{/snippet}
	{@render children()}
</AppShell>`}
>
	<div class="frame">
		<AppShell
			bind:sidebarOpen={open}
			bind:collapsed
			embedded
			mainId="demo-main"
			sidebarLabel="Acme navigation"
			sidebarWidth="13rem"
		>
			{#snippet brand({ collapsed })}
				<span class="mark" aria-hidden="true">A</span>
				{#if !collapsed}<span>Acme Trading</span>{/if}
			{/snippet}
			{#snippet header()}
				<Button size="sm" variant="outline" tone="neutral"
					>Search <Kbd keys="mod+k" size="sm" /></Button
				>
				<Button size="sm">New order</Button>
			{/snippet}
			{#snippet sidebar({ close })}
				<Nav {current}>
					<NavSection title="Trading">
						<NavItem
							href="/flow/app-shell/"
							active={current === '#dashboard'}
							onclick={(e) => {
								e.preventDefault();
								current = '#dashboard';
								close();
							}}
						>
							{#snippet icon()}<LayoutDashboard />{/snippet}Dashboard
						</NavItem>
						<NavItem
							href="/flow/app-shell/"
							badge={3}
							badgeTone="accent"
							active={current === '#orders'}
							onclick={(e) => {
								e.preventDefault();
								current = '#orders';
								close();
							}}
						>
							{#snippet icon()}<ListOrdered />{/snippet}Orders
						</NavItem>
						<NavItem
							href="/flow/app-shell/"
							active={current === '#history'}
							onclick={(e) => {
								e.preventDefault();
								current = '#history';
								close();
							}}
						>
							{#snippet icon()}<History />{/snippet}History
						</NavItem>
					</NavSection>
					<NavSection title="Workspace" collapsible>
						<NavItem
							href="/flow/app-shell/"
							active={current === '#team'}
							onclick={(e) => {
								e.preventDefault();
								current = '#team';
								close();
							}}
						>
							{#snippet icon()}<Users />{/snippet}Team
						</NavItem>
						<NavItem
							href="/flow/app-shell/"
							active={current === '#docs'}
							onclick={(e) => {
								e.preventDefault();
								current = '#docs';
								close();
							}}
						>
							{#snippet icon()}<BookOpen />{/snippet}Docs
						</NavItem>
						<NavItem
							href="/flow/app-shell/"
							active={current === '#settings'}
							onclick={(e) => {
								e.preventDefault();
								current = '#settings';
								close();
							}}
						>
							{#snippet icon()}<Settings />{/snippet}Settings
						</NavItem>
					</NavSection>
				</Nav>
			{/snippet}
			{#snippet sidebarFooter({ collapsed })}
				<span class="user" title="Ada Lovelace">
					<span class="user__avatar" aria-hidden="true">AL</span>
					{#if !collapsed}<span class="user__name">Ada Lovelace</span>{/if}
				</span>
			{/snippet}
			<Stack gap="4">
				<Heading level={2} size="lg"
					>{current.slice(1).replace(/^./, (c) => c.toUpperCase())}</Heading
				>
				{#each [1, 2, 3, 4] as i (i)}
					<Card>
						<Text tone="muted">
							Panel {i}. Scroll this area: the header frosts and the sidebar stays put. The sidebar {collapsed
								? 'is a rail — hover an icon for its label.'
								: 'can collapse to a rail from the toggle below the nav.'}
						</Text>
					</Card>
				{/each}
			</Stack>
		</AppShell>
	</div>
</Demo>

<Demo
	title="Top navigation — the same nav snippet, rendered as a horizontal bar"
	stack
	code={`<AppShell navigation="top">
	{#snippet brand()}<a href="/">Acme</a>{/snippet}
	{#snippet sidebar({ close })}
		<Nav current={page.url.pathname}>
			<NavItem href="/" exact onclick={close}>Dashboard</NavItem>
			<NavItem href="/orders" badge={3} onclick={close}>Orders</NavItem>
		</Nav>
	{/snippet}
	{#snippet header()}<UserMenu />{/snippet}
	{@render children()}
</AppShell>`}
>
	<div class="frame frame--short">
		<AppShell
			navigation="top"
			embedded
			mainId="demo-main-top"
			sidebarLabel="Acme top navigation"
			contentWidth="52rem"
		>
			{#snippet brand()}
				<span class="mark" aria-hidden="true">A</span>
				<span>Acme</span>
			{/snippet}
			{#snippet sidebar({ close })}
				<Nav>
					<NavItem
						href="/flow/app-shell/"
						active={topCurrent === 'dashboard'}
						onclick={(e) => {
							e.preventDefault();
							topCurrent = 'dashboard';
							close();
						}}
					>
						{#snippet icon()}<LayoutDashboard />{/snippet}Dashboard
					</NavItem>
					<NavItem
						href="/flow/app-shell/"
						badge={3}
						badgeTone="accent"
						active={topCurrent === 'orders'}
						onclick={(e) => {
							e.preventDefault();
							topCurrent = 'orders';
							close();
						}}
					>
						{#snippet icon()}<ListOrdered />{/snippet}Orders
					</NavItem>
					<NavItem
						href="/flow/app-shell/"
						active={topCurrent === 'history'}
						onclick={(e) => {
							e.preventDefault();
							topCurrent = 'history';
							close();
						}}
					>
						{#snippet icon()}<History />{/snippet}History
					</NavItem>
					<NavItem
						href="/flow/app-shell/"
						active={topCurrent === 'settings'}
						onclick={(e) => {
							e.preventDefault();
							topCurrent = 'settings';
							close();
						}}
					>
						{#snippet icon()}<Settings />{/snippet}Settings
					</NavItem>
				</Nav>
			{/snippet}
			{#snippet header()}
				<span class="user__avatar" aria-label="Ada Lovelace" role="img">AL</span>
			{/snippet}
			<Stack gap="4">
				<Heading level={2} size="lg">{topCurrent.replace(/^./, (c) => c.toUpperCase())}</Heading>
				<Card>
					<Text tone="muted">
						With <code>navigation="top"</code> the nav sits in the header as a horizontal bar with a sliding
						underline; below 64rem it folds into the same off-canvas drawer, vertical again.
					</Text>
				</Card>
			</Stack>
		</AppShell>
	</div>
</Demo>

<PropsTable
	rows={[
		{
			name: 'navigation',
			type: "'sidebar' | 'top'",
			default: "'sidebar'",
			description: 'Vertical column or horizontal bar.'
		},
		{ name: 'sidebarWidth / railWidth', type: 'string', default: "'16rem' / '3.5rem'" },
		{ name: 'asideWidth', type: 'string', default: "'18rem'" },
		{ name: 'collapsed', type: 'boolean', default: 'false', description: 'Bindable; icon rail.' },
		{ name: 'collapsible', type: 'boolean', default: 'true' },
		{
			name: 'sidebarOpen',
			type: 'boolean',
			default: 'false',
			description: 'Bindable; narrow viewports.'
		},
		{ name: 'sidebarLabel', type: 'string', default: "'Main navigation'" },
		{ name: 'mainId', type: 'string', default: "'main'", description: 'Skip-link target.' },
		{
			name: 'embedded',
			type: 'boolean',
			default: 'false',
			description: 'div instead of <main>; own scroll.'
		},
		{ name: 'contentWidth', type: 'string', default: "'none'" },
		{ name: 'brand / sidebarFooter', type: 'Snippet<[{ collapsed }]>' },
		{ name: 'header', type: 'Snippet<[{ toggle, sidebarOpen }]>' },
		{ name: 'sidebar', type: 'Snippet<[{ close, collapsed }]>' },
		{ name: 'aside / footer', type: 'Snippet' }
	]}
/>

<style>
	.frame--short {
		--db-app-shell-min-height: 18rem;
	}
	.frame {
		--db-app-shell-min-height: 30rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	.mark {
		display: inline-grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-size: var(--text-sm);
	}
	.user {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
		font-size: var(--text-sm);
	}
	.user__avatar {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-full);
		background: var(--color-component);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		color: var(--color-text-muted);
	}
	.user__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-text-muted);
	}
</style>
