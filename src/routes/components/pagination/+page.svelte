<script lang="ts">
	import { Pagination, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let page = $state(7);
	let small = $state(1);
</script>

<h1>Pagination</h1>
<p class="lead">Page controls that keep a constant width as the current page moves.</p>

<Demo title="Pages" stack code={`<Pagination bind:page pages={20} />`}>
	<Pagination bind:page pages={20} />
	<Text size="sm" tone="muted">Page {page} of 20.</Text>
</Demo>

<Demo
	title="From a count, small"
	stack
	code={`<Pagination bind:page count={132} perPage={25} size="sm" siblings={2} />`}
>
	<Pagination
		bind:page={small}
		count={132}
		perPage={25}
		size="sm"
		siblings={2}
		label="Results pages"
	/>
	<Text size="sm" tone="muted"
		>Showing {(small - 1) * 25 + 1}–{Math.min(small * 25, 132)} of 132.</Text
	>
</Demo>

<PropsTable
	rows={[
		{ name: 'page', type: 'number', default: '1', description: 'Bindable, 1-based.' },
		{ name: 'pages', type: 'number', description: 'Total pages, or use count + perPage.' },
		{ name: 'count', type: 'number' },
		{ name: 'perPage', type: 'number', default: '10' },
		{ name: 'siblings', type: 'number', default: '1' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'onPageChange', type: '(page: number) => void' },
		{ name: 'label', type: 'string', default: "'Pagination'" }
	]}
/>
