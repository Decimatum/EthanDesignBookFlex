<script lang="ts">
	import { Drawer, Button, Field, Input, Select, Stack, Text, Inline } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let side = $state<'right' | 'left' | 'bottom'>('right');
</script>

<h1>Drawer</h1>
<p class="lead">
	A modal panel that slides in from an edge — filters, details, settings, mobile nav.
</p>

<Demo
	title="Filters"
	code={`<Drawer title="Filters" description="Narrow the order list.">
	{#snippet trigger(props)}<Button {...props} variant="outline">Filters</Button>{/snippet}
	<Field label="Symbol"><Input placeholder="MSFT" /></Field>
	{#snippet footer({ close })}
		<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
		<Button onclick={close}>Apply</Button>
	{/snippet}
</Drawer>`}
>
	<Drawer title="Filters" description="Narrow the order list.">
		{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral">Filters</Button
			>{/snippet}
		<Stack gap="4">
			<Field label="Symbol"><Input placeholder="MSFT" /></Field>
			<Field label="Side">
				<Select
					placeholder="Any"
					items={[
						{ value: 'buy', label: 'Buy' },
						{ value: 'sell', label: 'Sell' }
					]}
				/>
			</Field>
			<Field label="Status">
				<Select
					placeholder="Any"
					items={[
						{ value: 'working', label: 'Working' },
						{ value: 'filled', label: 'Filled' },
						{ value: 'cancelled', label: 'Cancelled' }
					]}
				/>
			</Field>
		</Stack>
		{#snippet footer({ close })}
			<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
			<Button onclick={close}>Apply</Button>
		{/snippet}
	</Drawer>
</Demo>

<Demo
	title="Sides"
	code={`<Drawer side="left" title="Navigation">…</Drawer>
<Drawer side="bottom" size="50vh" title="Order ticket">…</Drawer>`}
>
	<Inline gap="2">
		{#each ['left', 'right', 'bottom'] as s (s)}
			<Button
				variant={side === s ? 'solid' : 'outline'}
				tone="neutral"
				size="sm"
				onclick={() => (side = s as typeof side)}>{s}</Button
			>
		{/each}
	</Inline>
	<Drawer {side} size={side === 'bottom' ? '40vh' : '20rem'} title="Order ticket">
		{#snippet trigger(props)}<Button {...props}>Open from {side}</Button>{/snippet}
		<Text>Panels slide in from the {side}; width or height comes from <code>size</code>.</Text>
	</Drawer>
</Demo>

<Demo title="Not dismissible" code={`<Drawer title="Confirm wire" dismissible={false}>…</Drawer>`}>
	<Drawer
		title="Confirm wire"
		description="Escape and overlay clicks are ignored."
		dismissible={false}
	>
		{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral"
				>Confirm wire</Button
			>{/snippet}
		<Text>You must choose an action below.</Text>
		{#snippet footer({ close })}
			<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
			<Button onclick={close}>Send $12,000</Button>
		{/snippet}
	</Drawer>
</Demo>

<PropsTable
	rows={[
		{ name: 'open', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'title', type: 'string', description: 'Required accessible name.' },
		{ name: 'description', type: 'string' },
		{ name: 'side', type: "'right' | 'left' | 'bottom'", default: "'right'" },
		{ name: 'size', type: 'string', default: "'24rem'", description: 'Width or height.' },
		{ name: 'dismissible', type: 'boolean', default: 'true' },
		{ name: 'onOpenChange', type: '(open: boolean) => void' },
		{ name: 'trigger', type: 'Snippet<[props]>', description: 'Spread props onto your button.' },
		{ name: 'children / footer', type: 'Snippet<[{ close }]>' }
	]}
/>
