<script lang="ts">
	import { Stat, Grid, Progress, Button } from '$lib/index.js';
	import { Wallet, TrendingUp, Gauge, ListOrdered } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let loading = $state(false);
</script>

<h1>Stat</h1>
<p class="lead">KPI tiles: label, big number, delta, hint, and room for a sparkline or bar.</p>

<Demo
	title="A row of tiles"
	stack
	code={`<Grid min="14rem" gap="4">
	<Stat label="Net liquidation" value="$1.24M" delta={1.8} hint="vs. yesterday" />
	<Stat label="Day P&L" value="+$4,210" delta={2.4} />
	<Stat label="Margin used" value="42%" delta={3} deltaInvert>
		<Progress value={42} aria-label="Margin used" size="sm" />
	</Stat>
	<Stat label="Open orders" value="7" loading />
</Grid>`}
>
	<Grid min="13rem" gap="4">
		<Stat label="Net liquidation" value="$1.24M" delta={1.8} hint="vs. yesterday close" {loading}>
			{#snippet icon()}<Wallet />{/snippet}
		</Stat>
		<Stat label="Day P&L" value="+$4,210" delta={2.4} hint="realised + unrealised" {loading}>
			{#snippet icon()}<TrendingUp />{/snippet}
		</Stat>
		<Stat label="Margin used" value="42%" delta={3} deltaInvert hint="of $80k available" {loading}>
			{#snippet icon()}<Gauge />{/snippet}
			<Progress value={42} aria-label="Margin used" size="sm" tone="warning" />
		</Stat>
		<Stat
			label="Open orders"
			value="7"
			delta={0}
			deltaFormat="number"
			hint="2 partially filled"
			{loading}
		>
			{#snippet icon()}<ListOrdered />{/snippet}
		</Stat>
	</Grid>
	<div>
		<Button size="sm" variant="outline" tone="neutral" onclick={() => (loading = !loading)}>
			Toggle loading
		</Button>
	</div>
</Demo>

<Demo title="Sizes and flush variant" code={`<Stat size="lg" … />  <Stat variant="flush" … />`}>
	<Stat label="AUM" value="$48.2B" delta={0.6} size="lg" />
	<Stat label="Clients" value="12,480" size="sm" hint="active this month" />
	<Stat label="Uptime" value="99.98%" variant="flush" delta={0.01} />
</Demo>

<PropsTable
	rows={[
		{ name: 'label / value', type: 'string', description: 'Required.' },
		{ name: 'hint', type: 'string' },
		{ name: 'delta', type: 'number', description: 'Rendered as a Delta pill.' },
		{ name: 'deltaFormat', type: "'number' | 'percent' | 'currency'", default: "'percent'" },
		{ name: 'deltaInvert', type: 'boolean', default: 'false' },
		{ name: 'loading', type: 'boolean', default: 'false' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'variant', type: "'card' | 'flush'", default: "'card'" },
		{ name: 'icon / children', type: 'Snippet' }
	]}
/>
