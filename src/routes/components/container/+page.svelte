<script lang="ts">
	import { Container, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Container</h1>
<p class="lead">Centres content with a max width and page padding.</p>

<Demo title="Sizes" stack code={`<Container size="sm">…</Container>`}>
	{#each ['sm', 'md', 'lg'] as size (size)}
		<Container size={size as 'sm'} class="demo-container">
			<Text size="sm" tone="muted" align="center">size="{size}"</Text>
		</Container>
	{/each}
</Demo>

<PropsTable
	rows={[
		{
			name: 'as',
			type: "'div' | 'section' | 'main' | 'article' | 'header' | 'footer'",
			default: "'div'"
		},
		{ name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'lg'" },
		{ name: 'padded', type: 'boolean', default: 'true', description: 'Apply --page-px.' }
	]}
/>

<style>
	:global(.demo-container) {
		padding-block: var(--space-2);
		border: 1px dashed var(--color-border-strong);
		border-radius: var(--radius-sm);
	}
</style>
