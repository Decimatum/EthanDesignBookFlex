<script lang="ts">
	import { Stack, Text, Card } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Stack</h1>
<p class="lead">Vertical flex layout with a token-driven gap.</p>

<Demo
	title="Gap scale"
	stack
	code={`<Stack gap="2">…</Stack>
<Stack gap="6">…</Stack>`}
>
	<div class="row">
		{#each ['1', '2', '4', '6', '8'] as gap (gap)}
			<Stack gap={gap as '1'} class="box">
				<Text size="xs" tone="muted">gap {gap}</Text>
				<div class="block"></div>
				<div class="block"></div>
				<div class="block"></div>
			</Stack>
		{/each}
	</div>
</Demo>

<Demo
	title="Composed"
	stack
	code={`<Card>
	<Stack gap="3">
		<Heading level={3} size="sm">Order #4821</Heading>
		<Text tone="muted">Shipped yesterday</Text>
	</Stack>
</Card>`}
>
	<Card>
		<Stack gap="3" align="start">
			<Text weight="semibold">Order #4821</Text>
			<Text tone="muted" size="sm">Shipped yesterday · arrives Thursday</Text>
			<Text size="sm">3 items · $124.00</Text>
		</Stack>
	</Card>
</Demo>

<PropsTable
	rows={[
		{
			name: 'as',
			type: "'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav' | 'form' | 'fieldset'",
			default: "'div'"
		},
		{ name: 'gap', type: 'Space', default: "'4'", description: 'Gap from the spacing scale.' },
		{ name: 'align', type: 'Align', description: 'Cross-axis alignment.' },
		{ name: 'justify', type: 'Justify', description: 'Main-axis distribution.' }
	]}
/>

<style>
	.row {
		display: flex;
		gap: var(--space-6);
		flex-wrap: wrap;
	}
	.block {
		width: 4rem;
		height: 1rem;
		border-radius: var(--radius-sm);
		background: var(--color-accent-subtle);
		border: 1px solid var(--color-accent-border);
	}
</style>
