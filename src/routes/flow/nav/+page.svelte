<script lang="ts">
	import { Nav, NavSection, NavItem, Text } from '$lib/index.js';
	import { LayoutDashboard, ListOrdered, History, Settings, Users } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let current = $state('#orders');
	let hcurrent = $state('orders');
	const hgo = (id: string) => (e: Event) => {
		e.preventDefault();
		hcurrent = id;
	};
	const go = (path: string) => (e: Event) => {
		e.preventDefault();
		current = path;
	};
</script>

<h1>Nav</h1>
<p class="lead">
	Sidebar navigation with sections, icons, badges, URL-derived active state and a sliding indicator.
</p>

<Demo
	title="Sections, badges, a collapsible group"
	stack
	code={`<Nav current={page.url.pathname}>
	<NavSection title="Trading">
		<NavItem href="/" exact>{#snippet icon()}<Home />{/snippet}Dashboard</NavItem>
		<NavItem href="/flow/nav/" active={current === '#orders'} badge={3} badgeTone="accent">{#snippet icon()}<ListOrdered />{/snippet}Orders</NavItem>
	</NavSection>
	<NavSection title="Account" collapsible>…</NavSection>
</Nav>`}
>
	<div class="panel">
		<Nav>
			<NavSection title="Trading">
				<NavItem href="/flow/nav/" active={current === '#dashboard'} onclick={go('#dashboard')}
					>{#snippet icon()}<LayoutDashboard />{/snippet}Dashboard</NavItem
				>
				<NavItem
					href="/flow/nav/"
					active={current === '#orders'}
					badge={3}
					badgeTone="accent"
					onclick={go('#orders')}>{#snippet icon()}<ListOrdered />{/snippet}Orders</NavItem
				>
				<NavItem href="/flow/nav/" active={current === '#history'} onclick={go('#history')}
					>{#snippet icon()}<History />{/snippet}History</NavItem
				>
			</NavSection>
			<NavSection title="Account" collapsible>
				<NavItem href="/flow/nav/" active={current === '#team'} badge="new" onclick={go('#team')}
					>{#snippet icon()}<Users />{/snippet}Team</NavItem
				>
				<NavItem href="/flow/nav/" active={current === '#settings'} onclick={go('#settings')}
					>{#snippet icon()}<Settings />{/snippet}Settings</NavItem
				>
				<NavItem disabled>Billing (locked)</NavItem>
			</NavSection>
		</Nav>
	</div>
	<Text size="sm" tone="muted"
		>Current: <code>{current}</code> — click items to move the indicator.</Text
	>
</Demo>

<Demo
	title="Horizontal"
	stack
	code={`<Nav orientation="horizontal" current={page.url.pathname}>
	<NavItem href="/" exact>Overview</NavItem>
	<NavItem href="/orders" badge={3}>Orders</NavItem>
	<NavSection title="Account">
		<NavItem href="/settings">Settings</NavItem>
	</NavSection>
</Nav>`}
>
	<div class="bar">
		<Nav orientation="horizontal">
			<NavItem href="/flow/nav/" active={hcurrent === 'overview'} onclick={hgo('overview')}
				>{#snippet icon()}<LayoutDashboard />{/snippet}Overview</NavItem
			>
			<NavItem
				href="/flow/nav/"
				badge={3}
				badgeTone="accent"
				active={hcurrent === 'orders'}
				onclick={hgo('orders')}>{#snippet icon()}<ListOrdered />{/snippet}Orders</NavItem
			>
			<NavItem href="/flow/nav/" active={hcurrent === 'history'} onclick={hgo('history')}
				>{#snippet icon()}<History />{/snippet}History</NavItem
			>
			<NavSection title="Account">
				<NavItem href="/flow/nav/" active={hcurrent === 'team'} onclick={hgo('team')}
					>{#snippet icon()}<Users />{/snippet}Team</NavItem
				>
				<NavItem href="/flow/nav/" active={hcurrent === 'settings'} onclick={hgo('settings')}
					>{#snippet icon()}<Settings />{/snippet}Settings</NavItem
				>
			</NavSection>
		</Nav>
	</div>
	<Text size="sm" tone="muted"
		>Sections become inline groups split by a hairline; the indicator is an underline.</Text
	>
</Demo>

<PropsTable
	title="Nav / NavSection props"
	rows={[
		{ name: 'Nav.current', type: 'string', description: 'Pathname; drives active state.' },
		{
			name: 'Nav.orientation',
			type: "'vertical' | 'horizontal'",
			default: 'from AppShell placement'
		},
		{ name: 'Nav.indicator', type: 'boolean', default: 'true' },
		{ name: 'NavSection.title', type: 'string' },
		{ name: 'NavSection.collapsible', type: 'boolean', default: 'false' },
		{ name: 'NavSection.open', type: 'boolean', default: 'true', description: 'Bindable.' }
	]}
/>
<PropsTable
	title="NavItem props"
	rows={[
		{ name: 'href', type: 'string', description: 'Link; omit for a button.' },
		{ name: 'active', type: 'boolean', description: 'Force; otherwise derived.' },
		{ name: 'exact', type: 'boolean', default: 'false' },
		{ name: 'badge', type: 'string | number' },
		{ name: 'badgeTone', type: "'neutral' | 'accent' | 'danger'", default: "'neutral'" },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'icon', type: 'Snippet', description: 'Monogram fallback in the rail.' }
	]}
/>

<style>
	.bar {
		display: flex;
		align-items: center;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--shell-radius);
		background: var(--shell-canvas);
		border: 1px solid var(--color-border);
	}
	.panel {
		width: min(100%, 16rem);
		padding: var(--space-3) var(--space-2);
		border-radius: var(--shell-radius);
		background: var(--shell-canvas);
		border: 1px solid var(--color-border);
	}
</style>
