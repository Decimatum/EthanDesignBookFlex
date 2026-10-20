<script lang="ts">
	import CommandPalette, { type Command } from './CommandPalette.svelte';
	let {
		onSelect,
		shortcut = 'mod+k'
	}: { onSelect?: (c: Command) => void; shortcut?: string | null } = $props();
	let open = $state(false);
	let ran = $state('');
	const groups = [
		{
			heading: 'Navigate',
			commands: [
				{ id: 'dash', label: 'Dashboard', href: '/dash', shortcut: 'g+d' },
				{ id: 'orders', label: 'Orders', href: '/orders', keywords: ['trades', 'fills'] }
			]
		},
		{
			heading: 'Actions',
			commands: [
				{
					id: 'new',
					label: 'New order',
					hint: 'Open the ticket',
					shortcut: 'n',
					onSelect: () => (ran = 'new')
				},
				{ id: 'theme', label: 'Toggle theme', onSelect: () => (ran = 'theme') },
				{ id: 'nope', label: 'Disabled thing', disabled: true }
			]
		}
	];
</script>

<button type="button" onclick={() => (open = true)}>Open palette</button>
<CommandPalette bind:open {groups} {onSelect} {shortcut} />
<span data-testid="state">{open ? 'open' : 'closed'}</span>
<span data-testid="ran">{ran || 'none'}</span>
