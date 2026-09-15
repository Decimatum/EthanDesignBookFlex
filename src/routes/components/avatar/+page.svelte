<script lang="ts">
	import { Avatar, Inline } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const names = [
		'Ada Lovelace',
		'Grace Hopper',
		'Linus Torvalds',
		'Margaret Hamilton',
		'Ken Thompson'
	];
</script>

<h1>Avatar</h1>
<p class="lead">Image or initials with a stable per-name colour.</p>

<Demo title="Initials" code={`<Avatar name="Ada Lovelace" />`}>
	{#each names as name (name)}
		<Avatar {name} />
	{/each}
</Demo>

<Demo title="Sizes & shape" code={`<Avatar name="Ada Lovelace" size="xl" shape="square" />`}>
	<Inline gap="3" align="end">
		{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
			<Avatar name="Ada Lovelace" size={size as 'md'} />
		{/each}
		<Avatar name="Acme Corp" size="lg" shape="square" />
	</Inline>
</Demo>

<PropsTable
	rows={[
		{ name: 'src', type: 'string', description: 'Image URL; falls back to initials on error.' },
		{ name: 'name', type: 'string', description: 'Initials, hue and accessible label.' },
		{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
		{ name: 'shape', type: "'circle' | 'square'", default: "'circle'" }
	]}
/>
