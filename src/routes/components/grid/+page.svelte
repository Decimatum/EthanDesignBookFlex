<script lang="ts">
	import { Grid, Card, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const items = Array.from({ length: 6 }, (_, i) => i + 1);
</script>

<h1>Grid</h1>
<p class="lead">Fixed column counts or responsive auto-fit columns, with token gaps.</p>

<Demo title="Fixed columns" stack code={`<Grid columns={3} gap="3">…</Grid>`}>
	<Grid columns={3} gap="3">
		{#each items as i (i)}
			<Card padding="sm"><Text align="center">{i}</Text></Card>
		{/each}
	</Grid>
</Demo>

<Demo
	title="Responsive (min width)"
	stack
	code={`<Grid min="10rem" gap="3">…</Grid>  <!-- resize the window -->`}
>
	<Grid min="10rem" gap="3">
		{#each items as i (i)}
			<Card padding="sm" variant="filled"><Text align="center">{i}</Text></Card>
		{/each}
	</Grid>
</Demo>

<Demo title="Raw template" stack code={`<Grid columns="2fr 1fr">…</Grid>`}>
	<Grid columns="2fr 1fr" gap="3">
		<Card padding="sm"><Text>Main</Text></Card>
		<Card padding="sm"><Text>Aside</Text></Card>
	</Grid>
</Demo>

<PropsTable
	rows={[
		{ name: 'as', type: "'div' | 'section' | 'ul' | 'ol'", default: "'div'" },
		{
			name: 'columns',
			type: 'number | string',
			default: '2',
			description: 'Count, or raw grid-template-columns.'
		},
		{ name: 'min', type: 'string', description: 'Auto-fit with this minimum column width.' },
		{ name: 'gap', type: 'Space', default: "'4'" },
		{ name: 'rowGap', type: 'Space', description: 'Defaults to gap.' },
		{ name: 'align', type: 'Align' }
	]}
/>
