<script lang="ts">
	import Menu from './Menu.svelte';
	import MenuItem from './MenuItem.svelte';
	import MenuGroup from './MenuGroup.svelte';
	import MenuSeparator from './MenuSeparator.svelte';
	import MenuCheckboxItem from './MenuCheckboxItem.svelte';
	import Button from '../button/Button.svelte';
	let { onRename, onDelete }: { onRename?: () => void; onDelete?: () => void } = $props();
	let showHidden = $state(false);
</script>

<Menu>
	{#snippet trigger(props)}<Button {...props}>Actions</Button>{/snippet}
	<MenuGroup label="File">
		<MenuItem onSelect={onRename} shortcut="⌘R">Rename</MenuItem>
		<MenuItem href="/download">Download</MenuItem>
		<MenuItem disabled>Move</MenuItem>
	</MenuGroup>
	<MenuSeparator />
	<MenuCheckboxItem bind:checked={showHidden}>Show hidden</MenuCheckboxItem>
	<MenuSeparator />
	<MenuItem tone="danger" onSelect={onDelete}>Delete</MenuItem>
</Menu>
<span data-testid="hidden">{showHidden ? 'yes' : 'no'}</span>
