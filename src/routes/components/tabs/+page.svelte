<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel, Text, Stack } from '$lib/index.js';
	import { BarChart3, ListOrdered, History } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let section = $state('positions');
</script>

<h1>Tabs</h1>
<p class="lead">Switch between sections of related content, with full keyboard support.</p>

<Demo
	title="Underline (default)"
	stack
	code={`<Tabs bind:value={section}>
	<TabList label="Portfolio">
		<Tab value="positions" badge={12}>Positions</Tab>
		<Tab value="orders">Orders</Tab>
		<Tab value="history" disabled>History</Tab>
	</TabList>
	<TabPanel value="positions">…</TabPanel>
	…
</Tabs>`}
>
	<Tabs bind:value={section}>
		<TabList label="Portfolio">
			<Tab value="positions" badge={12}>{#snippet leading()}<BarChart3 />{/snippet}Positions</Tab>
			<Tab value="orders" badge={3}>{#snippet leading()}<ListOrdered />{/snippet}Orders</Tab>
			<Tab value="history" disabled>{#snippet leading()}<History />{/snippet}History</Tab>
		</TabList>
		<TabPanel value="positions"><Text>12 open positions across 4 accounts.</Text></TabPanel>
		<TabPanel value="orders"><Text>3 working orders, none partially filled.</Text></TabPanel>
		<TabPanel value="history"><Text>History is unavailable in this demo.</Text></TabPanel>
	</Tabs>
</Demo>

<Demo title="Pill" stack code={`<Tabs variant="pill" size="sm">…</Tabs>`}>
	<Tabs variant="pill" size="sm" value="1d">
		<TabList label="Range">
			{#each ['1d', '1w', '1m', '3m', '1y', 'all'] as r (r)}
				<Tab value={r}>{r.toUpperCase()}</Tab>
			{/each}
		</TabList>
		{#each ['1d', '1w', '1m', '3m', '1y', 'all'] as r (r)}
			<TabPanel value={r}><Text size="sm" tone="muted">Showing the {r} range.</Text></TabPanel>
		{/each}
	</Tabs>
</Demo>

<Demo title="Vertical" stack code={`<Tabs orientation="vertical">…</Tabs>`}>
	<Tabs orientation="vertical" value="general">
		<TabList label="Settings">
			<Tab value="general">General</Tab>
			<Tab value="security">Security</Tab>
			<Tab value="billing">Billing</Tab>
		</TabList>
		<TabPanel value="general"
			><Stack gap="1"
				><Text weight="semibold">General</Text><Text tone="muted">Name, language, time zone.</Text
				></Stack
			></TabPanel
		>
		<TabPanel value="security"
			><Stack gap="1"
				><Text weight="semibold">Security</Text><Text tone="muted"
					>Password, two-factor, sessions.</Text
				></Stack
			></TabPanel
		>
		<TabPanel value="billing"
			><Stack gap="1"
				><Text weight="semibold">Billing</Text><Text tone="muted"
					>Plan, invoices, payment method.</Text
				></Stack
			></TabPanel
		>
	</Tabs>
</Demo>

<PropsTable
	title="Tabs props"
	rows={[
		{ name: 'value', type: 'string', description: 'Bindable.' },
		{ name: 'variant', type: "'underline' | 'pill'", default: "'underline'" },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
		{ name: 'activation', type: "'automatic' | 'manual'", default: "'automatic'" },
		{ name: 'onValueChange', type: '(value: string) => void' }
	]}
/>
<PropsTable
	title="TabList / Tab / TabPanel props"
	rows={[
		{ name: 'TabList.label', type: 'string', description: 'Required accessible name.' },
		{ name: 'TabList.grow', type: 'boolean', default: 'false' },
		{ name: 'Tab.value', type: 'string', description: 'Required.' },
		{ name: 'Tab.disabled', type: 'boolean', default: 'false' },
		{ name: 'Tab.badge', type: 'string | number' },
		{ name: 'TabPanel.value', type: 'string', description: 'Required.' }
	]}
/>
