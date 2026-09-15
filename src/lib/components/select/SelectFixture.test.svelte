<script lang="ts">
	import Select from './Select.svelte';
	import Field from '../field/Field.svelte';
	let { error, onValueChange }: { error?: string; onValueChange?: (v: string) => void } = $props();
	let value = $state<string | undefined>();
	const items = [
		{ value: 'aapl', label: 'Apple', group: 'Tech' },
		{ value: 'msft', label: 'Microsoft', group: 'Tech' },
		{ value: 'jpm', label: 'JPMorgan', group: 'Finance' },
		{ value: 'x', label: 'Delisted', disabled: true }
	];
</script>

<Field label="Ticker" {error} hint="Pick one">
	<Select {items} bind:value placeholder="Choose a ticker" name="ticker" {onValueChange} />
</Field>
<span data-testid="value">{value ?? 'none'}</span>
