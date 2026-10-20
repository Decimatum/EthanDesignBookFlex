<script lang="ts">
	import { Delta, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Delta</h1>
<p class="lead">A signed change, coloured by whether it is good or bad — not merely by its sign.</p>

<Demo
	title="Formats"
	code={`<Delta value={3.456} format="percent" />
<Delta value={-1250} format="currency" currency="USD" />
<Delta value={0} digits={0} />`}
>
	<Delta value={3.456} format="percent" />
	<Delta value={-1250} format="currency" currency="USD" />
	<Delta value={0} digits={0} />
	<Delta value={420} digits={0} />
</Demo>

<Demo
	title="Pills and inversion"
	code={`<Delta value={12} format="percent" variant="pill" />
<Delta value={12} format="percent" variant="pill" invert />`}
>
	<Delta value={12} format="percent" variant="pill" />
	<Delta value={-4.2} format="percent" variant="pill" />
	<Text size="sm" tone="muted">Latency (up is bad):</Text>
	<Delta value={12} format="percent" variant="pill" invert />
	<Delta value={-8} format="percent" variant="pill" invert size="sm" />
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'number', description: 'Required; sign → direction + tone.' },
		{ name: 'format', type: "'number' | 'percent' | 'currency'", default: "'number'" },
		{ name: 'currency', type: 'string', default: "'USD'" },
		{ name: 'digits', type: 'number', default: '2' },
		{ name: 'invert', type: 'boolean', default: 'false', description: 'Positive is bad.' },
		{ name: 'arrow', type: 'boolean', default: 'true' },
		{ name: 'variant', type: "'text' | 'pill'", default: "'text'" },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" }
	]}
/>
