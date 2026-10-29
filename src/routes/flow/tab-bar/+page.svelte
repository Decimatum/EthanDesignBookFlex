<script lang="ts">
	import { TabBar, Text } from '$lib/index.js';
	import { Sun, CalendarDays, Users, Wallet, Settings } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let current = $state('#calendar');
	const go = (path: string) => (e: MouseEvent) => {
		e.preventDefault();
		current = path;
	};
</script>

{#snippet sun()}<Sun />{/snippet}
{#snippet cal()}<CalendarDays />{/snippet}
{#snippet users()}<Users />{/snippet}
{#snippet wallet()}<Wallet />{/snippet}
{#snippet gear()}<Settings />{/snippet}

<h1>Tab bar</h1>
<p class="lead">
	Bottom navigation for phones: icon over label, the active section highlighted, hidden where the
	sidebar takes over. Shown here with <code>always</code> and docked inside the demo instead of the viewport.
</p>

<Demo
	title="Three to five sections"
	code={`<TabBar current={page.url.pathname} items={[
  { href: '/', label: 'Today', icon: sun, exact: true },
  { href: '/calendar', label: 'Calendar', icon: cal },
  { href: '/clients', label: 'Clients', icon: users, badge: 2, badgeTone: 'accent' }
]} />`}
>
	<div class="dock">
		<TabBar
			always
			label="App sections"
			style="position: static"
			items={[
				{
					href: '/flow/tab-bar/',
					label: 'Today',
					icon: sun,
					active: current === '#today',
					onclick: go('#today')
				},
				{
					href: '/flow/tab-bar/',
					label: 'Calendar',
					icon: cal,
					active: current === '#calendar',
					onclick: go('#calendar')
				},
				{
					href: '/flow/tab-bar/',
					active: current === '#clients',
					label: 'Clients',
					icon: users,
					badge: 2,
					badgeTone: 'accent',
					onclick: go('#clients')
				},
				{
					href: '/flow/tab-bar/',
					label: 'Earnings',
					icon: wallet,
					active: current === '#earnings',
					onclick: go('#earnings')
				},
				{
					href: '/flow/tab-bar/',
					label: 'Settings',
					icon: gear,
					active: current === '#settings',
					onclick: go('#settings')
				}
			]}
		/>
	</div>
	<p class="demo-note">
		<Text as="span" size="sm" tone="muted">Current: <code>{current}</code></Text>
	</p>
</Demo>

<Demo
	title="Without icons"
	code={`<TabBar always items={[{ href: '/plan', label: 'Plan' }, { href: '/do', label: 'Do' }, { href: '/review', label: 'Review' }]} />`}
>
	<div class="dock">
		<TabBar
			always
			label="Steps"
			current="#b"
			style="position: static"
			items={[
				{ href: '/flow/tab-bar/', label: 'Plan', active: current === '#a', onclick: go('#a') },
				{ href: '/flow/tab-bar/', label: 'Do', active: current === '#b', onclick: go('#b') },
				{ href: '/flow/tab-bar/', label: 'Review', active: current === '#c', onclick: go('#c') }
			]}
		/>
	</div>
</Demo>

<PropsTable
	rows={[
		{
			name: 'items',
			type: 'TabBarItem[]',
			description:
				'{ href, label, icon?, badge?, badgeTone?, exact?, onclick? } — three to five. Required.'
		},
		{
			name: 'current',
			type: 'string',
			description: 'Current pathname; sets aria-current on the matching item.'
		},
		{ name: 'label', type: 'string', default: "'Sections'" },
		{
			name: 'always',
			type: 'boolean',
			default: 'false',
			description: 'Show at every width; by default hidden at ≥ 64rem.'
		}
	]}
/>

<style>
	.dock {
		max-width: 26rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.demo-note {
		margin-top: var(--space-3);
	}
</style>
