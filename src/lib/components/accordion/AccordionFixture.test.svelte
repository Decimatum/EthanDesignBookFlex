<script lang="ts">
	import { untrack } from 'svelte';
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	let {
		type = 'single',
		onValueChange
	}: { type?: 'single' | 'multiple'; onValueChange?: (v: string | string[]) => void } = $props();
	let value = $state<string | string[]>(untrack(() => (type === 'multiple' ? [] : '')));
</script>

<Accordion {type} bind:value {onValueChange}>
	<AccordionItem value="fees" title="Fees" description="What you pay"
		>Zero commission.</AccordionItem
	>
	<AccordionItem value="limits" title="Limits">Daily limit applies.</AccordionItem>
	<AccordionItem value="closed" title="Closed" disabled>Unavailable.</AccordionItem>
</Accordion>
<span data-testid="value">{Array.isArray(value) ? value.join(',') : value}</span>
