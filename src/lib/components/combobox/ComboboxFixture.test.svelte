<script lang="ts">
	import { untrack } from 'svelte';
	import Combobox from './Combobox.svelte';
	import Field from '../field/Field.svelte';
	let {
		multiple = false,
		error,
		initial,
		onValueChange
	}: {
		multiple?: boolean;
		error?: string;
		initial?: string | string[];
		onValueChange?: (v: string | string[]) => void;
	} = $props();
	let value = $state<string | string[] | undefined>(untrack(() => initial));
	const items = [
		{ value: 'msft', label: 'Microsoft', group: 'Tech', keywords: 'MSFT' },
		{ value: 'aapl', label: 'Apple', group: 'Tech', keywords: 'AAPL' },
		{ value: 'nvda', label: 'NVIDIA', group: 'Tech', keywords: 'NVDA' },
		{ value: 'jpm', label: 'JPMorgan', group: 'Finance', keywords: 'JPM' },
		{ value: 'gone', label: 'Delisted', group: 'Finance', disabled: true }
	];
</script>

<Field label="Ticker" hint="Type to search" {error}>
	<Combobox
		{items}
		bind:value
		{multiple}
		{onValueChange}
		name="ticker"
		placeholder="Find a ticker"
	/>
</Field>
<span data-testid="value"
	>{value === undefined ? 'none' : Array.isArray(value) ? value.join(',') : value || 'none'}</span
>
