<script lang="ts">
	import { Select, Field, Grid, Text } from '$lib/index.js';
	import { Globe } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let ticker = $state<string | undefined>();
	let region = $state<string | undefined>('sg');
	const tickers = [
		{ value: 'aapl', label: 'Apple', group: 'Tech' },
		{ value: 'msft', label: 'Microsoft', group: 'Tech' },
		{ value: 'nvda', label: 'NVIDIA', group: 'Tech' },
		{ value: 'jpm', label: 'JPMorgan', group: 'Finance' },
		{ value: 'gs', label: 'Goldman Sachs', group: 'Finance' },
		{ value: 'old', label: 'Delisted Co', disabled: true }
	];
	const regions = [
		{ value: 'sg', label: 'Singapore' },
		{ value: 'hk', label: 'Hong Kong' },
		{ value: 'lon', label: 'London' },
		{ value: 'nyc', label: 'New York' }
	];
</script>

<h1>Select</h1>
<p class="lead">A single-choice dropdown styled to match Input.</p>

<Demo
	title="With Field and groups"
	stack
	code={`<Field label="Ticker">
	<Select items={tickers} bind:value={ticker} placeholder="Choose…" name="ticker" />
</Field>`}
>
	<div style="max-width: 20rem">
		<Field label="Ticker" hint="Type to jump to an option">
			<Select items={tickers} bind:value={ticker} placeholder="Choose a ticker" name="ticker" />
		</Field>
	</div>
	<Text size="sm" tone="muted">Selected: {ticker ?? 'none'}</Text>
</Demo>

<Demo title="Sizes, icon, states" stack code={`<Select items={regions} size="sm" />`}>
	<Grid min="14rem" gap="3">
		<Select items={regions} bind:value={region} size="sm" aria-label="Region small" />
		<Select items={regions} bind:value={region} aria-label="Region">
			{#snippet leading()}<Globe />{/snippet}
		</Select>
		<Select items={regions} bind:value={region} size="lg" aria-label="Region large" />
		<Field label="Invalid" error="Choose a region">
			<Select items={regions} placeholder="Region" />
		</Field>
		<Field label="Disabled" disabled>
			<Select items={regions} value="sg" />
		</Field>
	</Grid>
</Demo>

<PropsTable
	rows={[
		{ name: 'items', type: 'SelectItem[]', description: '{ value, label, disabled?, group? }' },
		{ name: 'value', type: 'string', description: 'Bindable.' },
		{ name: 'placeholder', type: 'string', default: "'Select…'" },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'invalid', type: 'boolean', default: 'from Field' },
		{ name: 'disabled / required / id', type: 'native', default: 'from Field' },
		{ name: 'name', type: 'string', description: 'Hidden input for forms.' },
		{ name: 'allowDeselect', type: 'boolean', default: 'false' },
		{ name: 'onValueChange', type: '(value: string) => void' }
	]}
/>
