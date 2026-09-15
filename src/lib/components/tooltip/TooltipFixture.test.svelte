<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import Button from '../button/Button.svelte';
</script>

<Tooltip text="Delete item" delay={0}>
	{#snippet children(props)}<Button {...props} iconOnly aria-label="Delete">×</Button>{/snippet}
</Tooltip>
