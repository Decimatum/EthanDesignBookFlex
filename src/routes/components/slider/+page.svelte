<script lang="ts">
	import { Slider, Field, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let volume = $state(40);
	let range = $state([20, 60]);
	let risk = $state(1.5);
</script>

<h1>Slider</h1>
<p class="lead">Pick a number or a range by dragging along a track.</p>

<Demo
	title="Single value"
	stack
	code={`<Slider bind:value={volume} label="Volume" showValue format={(v) => \`\${v}%\`} />`}
>
	<Slider bind:value={volume} label="Volume" showValue format={(v) => `${v}%`} />
</Demo>

<Demo
	title="Range with ticks"
	stack
	code={`<Slider bind:value={range} step={5} ticks={5} label="Price" showValue />`}
>
	<Slider bind:value={range} step={5} ticks={5} label="Price" showValue format={(v) => `$${v}`} />
</Demo>

<Demo
	title="Inside a Field, small"
	stack
	code={`<Field label="Risk per trade" hint="Percent of equity">
	<Slider bind:value={risk} max={5} step={0.25} size="sm" showValue />
</Field>`}
>
	<Stack gap="4">
		<Field label="Risk per trade" hint="Percent of equity">
			<Slider bind:value={risk} max={5} step={0.25} size="sm" showValue format={(v) => `${v}%`} />
		</Field>
		<Field label="Leverage" hint="Locked for cash accounts" disabled>
			<Slider value={1} max={4} size="sm" showValue format={(v) => `${v}×`} />
		</Field>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{
			name: 'value',
			type: 'number | number[]',
			default: '0',
			description: 'Bindable; array = range.'
		},
		{ name: 'min / max', type: 'number', default: '0 / 100' },
		{ name: 'step', type: 'number', default: '1' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'label', type: 'string', description: 'Visible label; names the thumbs.' },
		{ name: 'showValue', type: 'boolean', default: 'false' },
		{ name: 'format', type: '(value: number) => string' },
		{ name: 'ticks', type: 'number', default: '0' },
		{ name: 'name', type: 'string', description: 'Hidden inputs for forms.' },
		{ name: 'onValueChange / onValueCommit', type: '(value) => void' }
	]}
/>
