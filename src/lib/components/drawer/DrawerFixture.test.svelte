<script lang="ts">
	import Drawer from './Drawer.svelte';
	import Button from '../button/Button.svelte';
	let {
		dismissible = true,
		side = 'right',
		onOpenChange
	}: {
		dismissible?: boolean;
		side?: 'right' | 'left' | 'bottom';
		onOpenChange?: (o: boolean) => void;
	} = $props();
	let open = $state(false);
</script>

<Drawer
	bind:open
	title="Filters"
	description="Narrow the list."
	{side}
	{dismissible}
	{onOpenChange}
>
	{#snippet trigger(props)}<Button {...props}>Open</Button>{/snippet}
	{#snippet children({ close })}
		<p>Body text</p>
		<button type="button" onclick={close}>Close from body</button>
	{/snippet}
	{#snippet footer({ close })}
		<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
		<Button>Apply</Button>
	{/snippet}
</Drawer>
<span data-testid="state">{open ? 'open' : 'closed'}</span>
