<script lang="ts">
	import Popover from './Popover.svelte';
	import Button from '../button/Button.svelte';
	let open = $state(false);
</script>

<Popover bind:open side="bottom">
	{#snippet trigger(props)}<Button {...props}>Filters</Button>{/snippet}
	{#snippet children({ close })}
		<p>Panel content</p>
		<button type="button" onclick={close}>Done</button>
	{/snippet}
</Popover>
<span data-testid="state">{open ? 'open' : 'closed'}</span>
