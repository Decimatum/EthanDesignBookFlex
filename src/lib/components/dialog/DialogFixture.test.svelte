<script lang="ts">
	import Dialog from './Dialog.svelte';
	import Button from '../button/Button.svelte';
	let {
		dismissible = true,
		onOpenChange
	}: { dismissible?: boolean; onOpenChange?: (o: boolean) => void } = $props();
	let open = $state(false);
</script>

<Dialog
	bind:open
	title="Delete file"
	description="This cannot be undone."
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
		<Button tone="danger">Delete</Button>
	{/snippet}
</Dialog>
<span data-testid="state">{open ? 'open' : 'closed'}</span>
