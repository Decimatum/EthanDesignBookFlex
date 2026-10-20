<script lang="ts">
	import Stepper from './Stepper.svelte';
	let {
		linear = true,
		onStepClick,
		error = false
	}: { linear?: boolean; onStepClick?: (id: string) => void; error?: boolean } = $props();
	let current = $state('review');
	const steps = $derived([
		{ id: 'details', label: 'Details', description: 'Name and email' },
		{ id: 'funding', label: 'Funding', error },
		{ id: 'review', label: 'Review' },
		{ id: 'done', label: 'Done' }
	]);
</script>

<Stepper {steps} bind:current {linear} {onStepClick} />
<span data-testid="current">{current}</span>
