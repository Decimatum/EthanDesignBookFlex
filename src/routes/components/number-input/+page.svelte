<script lang="ts">
	import { NumberInput, Field, Grid, Stack, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let qty = $state<number | null>(1);
	let price = $state<number | null>(1234.5);
	let pct = $state<number | null>(12.5);
	let shares = $state<number | null>(250);
	let leverage = $state<number | null>(3);
	let eur = $state<number | null>(99999.99);
</script>

<h1>Number input</h1>
<p class="lead">
	A numeric field with step buttons, keyboard stepping and locale-aware formatting. Plain digits
	while editing; grouping, currency or percent once committed.
</p>

<Demo
	title="Basic"
	stack
	code={`<Field label="Quantity">
	<NumberInput bind:value={qty} min={1} max={99} />
</Field>`}
>
	<Grid min="14rem" gap="3" align="end">
		<Field label="Quantity" hint="1–99">
			<NumberInput bind:value={qty} min={1} max={99} />
		</Field>
		<Text size="sm" tone="muted" numeric>value = {JSON.stringify(qty)}</Text>
	</Grid>
</Demo>

<Demo
	title="Formats"
	stack
	code={`<NumberInput bind:value={price} step={0.01} format="currency" currency="USD" />
<NumberInput bind:value={pct} step={0.5} format="percent" max={100} />
<NumberInput bind:value={shares} step={10} format="decimal" />
<NumberInput bind:value={eur} step={0.01} format="currency" currency="EUR" locale="de-DE" />`}
>
	<Grid min="14rem" gap="3">
		<Field label="Limit price" hint="Two decimals, from step">
			<NumberInput bind:value={price} step={0.01} format="currency" currency="USD" min={0} />
		</Field>
		<Field label="Allocation" hint="Stored as 12.5, shown as 12.5%">
			<NumberInput bind:value={pct} step={0.5} format="percent" min={0} max={100} />
		</Field>
		<Field label="Shares" hint="Grouped thousands">
			<NumberInput bind:value={shares} step={10} format="decimal" min={0} />
		</Field>
		<Field label="Amount (de-DE)" hint="Parses 1.234,56 and formats back">
			<NumberInput bind:value={eur} step={0.01} format="currency" currency="EUR" locale="de-DE" />
		</Field>
	</Grid>
</Demo>

<Demo
	title="Controls"
	stack
	code={`<NumberInput controls="split" min={1} max={9} />
<NumberInput controls="none" />
<NumberInput controls="stacked" size="sm" />`}
>
	<Grid min="12rem" gap="3" align="end">
		<Field label="Split" hint="Centred value, − and + either side">
			<NumberInput bind:value={qty} controls="split" min={1} max={99} />
		</Field>
		<Field label="None" hint="Arrow keys still step">
			<NumberInput value={42} controls="none" />
		</Field>
		<Field label="Stacked, small">
			<NumberInput value={7} size="sm" />
		</Field>
		<Field label="Stacked, large">
			<NumberInput value={7} size="lg" />
		</Field>
	</Grid>
</Demo>

<Demo
	title="Adornments and states"
	stack
	code={`<NumberInput bind:value={leverage} min={1} max={10}>
	{#snippet trailing()}×{/snippet}
</NumberInput>
<Field label="Invalid" error="Exceeds buying power"><NumberInput value={50000} /></Field>
<Field label="Disabled" disabled><NumberInput value={0} /></Field>`}
>
	<Grid min="12rem" gap="3">
		<Field label="Leverage">
			<NumberInput bind:value={leverage} min={1} max={10}>
				{#snippet trailing()}×{/snippet}
			</NumberInput>
		</Field>
		<Field label="Notional">
			<NumberInput value={25000} step={100} format="decimal" controls="none">
				{#snippet leading()}${/snippet}
				{#snippet trailing()}USD{/snippet}
			</NumberInput>
		</Field>
		<Field label="Invalid" error="Exceeds buying power">
			<NumberInput value={50000} format="currency" />
		</Field>
		<Field label="Disabled" disabled>
			<NumberInput value={0} />
		</Field>
		<Field label="Read only">
			<NumberInput value={1.5} readonly step={0.5} />
		</Field>
		<Field label="Empty" hint="Stepping up lands on min">
			<NumberInput min={1} placeholder="Qty" />
		</Field>
	</Grid>
</Demo>

<Demo
	title="Keyboard"
	stack
	code={`↑ / ↓ step · Shift+↑/↓ and PageUp/PageDown step ×10 · Home/End jump to min/max · Enter commits`}
>
	<Stack gap="2">
		<Field label="Try it" hint="Focus and use the arrow keys. Hold a step button to repeat.">
			<NumberInput value={100} min={0} max={1000} step={5} format="decimal" />
		</Field>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'number | null', default: 'null', description: 'Bindable.' },
		{ name: 'min / max', type: 'number', description: 'Clamped on commit.' },
		{ name: 'step', type: 'number', default: '1', description: 'Also sets default precision.' },
		{ name: 'precision', type: 'number', default: 'from step', description: 'Decimal places.' },
		{
			name: 'format',
			type: "'plain' | 'decimal' | 'currency' | 'percent'",
			default: "'plain'",
			description: 'Display when not editing.'
		},
		{ name: 'currency', type: 'string', default: "'USD'" },
		{ name: 'locale', type: 'string', default: 'browser', description: 'Formatting and parsing.' },
		{ name: 'controls', type: "'stacked' | 'split' | 'none'", default: "'stacked'" },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'invalid', type: 'boolean', default: 'from Field' },
		{ name: 'name', type: 'string', description: 'Hidden input for forms.' },
		{ name: 'onValueChange', type: '(value: number | null) => void' },
		{ name: 'leading / trailing', type: 'Snippet', description: 'Decorative adornments.' },
		{ name: 'disabled / required / readonly / id', type: 'native', default: 'from Field' }
	]}
/>
