<script lang="ts">
	import { Breadcrumb } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const trail = [
		{ label: 'Home', href: '/' },
		{ label: 'Accounts', href: '/components/breadcrumb/' },
		{ label: 'Brokerage', href: '/components/breadcrumb/' },
		{ label: 'Positions', href: '/components/breadcrumb/' },
		{ label: 'History', href: '/components/breadcrumb/' },
		{ label: 'MSFT' }
	];
</script>

<h1>Breadcrumb</h1>
<p class="lead">Where the page sits in the hierarchy, and a way back up.</p>

<Demo
	title="Basic"
	code={`<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Accounts', href: '/accounts' }, { label: 'MSFT' }]} />`}
>
	<Breadcrumb items={trail.slice(0, 2).concat(trail.at(-1)!)} />
</Demo>

<Demo title="Collapsed" code={`<Breadcrumb items={sixItems} maxItems={4} />`}>
	<Breadcrumb items={trail} label="Breadcrumb (collapsed)" />
</Demo>

<PropsTable
	rows={[
		{
			name: 'items',
			type: '{ label: string; href?: string }[]',
			description: 'Required. Last item is the current page.'
		},
		{
			name: 'maxItems',
			type: 'number',
			default: '4',
			description: 'Collapse the middle beyond this.'
		},
		{ name: 'label', type: 'string', default: "'Breadcrumb'", description: 'Landmark name.' }
	]}
/>
