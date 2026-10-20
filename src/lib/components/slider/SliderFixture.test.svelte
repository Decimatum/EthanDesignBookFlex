<script lang="ts">
	import { untrack } from 'svelte';
	import Slider from './Slider.svelte';
	import Field from '../field/Field.svelte';
	let {
		initial = 40,
		inField = false,
		onValueChange,
		onValueCommit
	}: {
		initial?: number | number[];
		inField?: boolean;
		onValueChange?: (v: number | number[]) => void;
		onValueCommit?: (v: number | number[]) => void;
	} = $props();
	let value = $state<number | number[]>(untrack(() => initial));
</script>

{#if inField}
	<Field label="Risk" hint="Per trade" disabled>
		<Slider bind:value />
	</Field>
{:else}
	<Slider bind:value label="Volume" showValue step={5} ticks={5} {onValueChange} {onValueCommit} />
{/if}
<span data-testid="value">{Array.isArray(value) ? value.join(',') : value}</span>
