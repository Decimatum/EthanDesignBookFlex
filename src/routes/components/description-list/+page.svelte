<script lang="ts">
	import { DescriptionList, Badge } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	const facts = [
		{ term: 'Venue', description: 'Pickle & Padel, Kallang' },
		{ term: 'Duration', description: '90 min' },
		{ term: 'Partner', description: 'Wei Jie' },
		{ term: 'Opponents', description: 'Marcus & Dan', note: 'level 3.5' },
		{ term: 'Energy', description: '3 / 5', note: 'left knee tight' }
	];
</script>

<h1>DescriptionList</h1>
<p class="lead">
	Term–description pairs for the facts about one thing. Three layouts from one array; descriptions
	take a string or a snippet.
</p>

{#snippet won()}<Badge tone="success">Won</Badge>{/snippet}

<Demo
	title="Columns — a facts panel"
	stack
	code={`<DescriptionList layout="columns" columns={3} items={[
	{ term: 'Venue', description: 'Pickle & Padel, Kallang' },
	{ term: 'Result', description: won, note: '4–6 6–3 3–6' }
]} />`}
>
	<DescriptionList
		layout="columns"
		columns={3}
		items={[...facts, { term: 'Result', description: won, note: '4–6 6–3 3–6' }]}
	/>
</Demo>

<Demo
	title="Inline rows"
	stack
	code={`<DescriptionList layout="inline" termWidth="8rem" items={facts} />`}
>
	<DescriptionList layout="inline" termWidth="8rem" items={facts} />
</Demo>

<Demo title="Stacked, small" code={`<DescriptionList size="sm" items={facts.slice(0, 3)} />`}>
	<DescriptionList size="sm" items={facts.slice(0, 3)} />
</Demo>

<PropsTable
	rows={[
		{
			name: 'items',
			type: 'DescriptionItem[]',
			description: '{ term, description: string | Snippet, note? }'
		},
		{ name: 'layout', type: "'stacked' | 'inline' | 'columns'", default: "'stacked'" },
		{ name: 'columns', type: '2 | 3 | 4', default: '2', description: 'For layout="columns".' },
		{ name: 'termWidth', type: 'string', default: "'10rem'", description: 'For layout="inline".' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" }
	]}
/>
