<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '../button/Button.svelte';
	let {
		attached = true,
		orientation = 'horizontal'
	}: { attached?: boolean; orientation?: 'horizontal' | 'vertical' } = $props();
</script>

<ButtonGroup label="Range" {attached} {orientation}>
	<Button variant="outline" tone="neutral">1D</Button>
	<Button variant="outline" tone="neutral">1W</Button>
	<Button variant="outline" tone="neutral">1M</Button>
</ButtonGroup>
