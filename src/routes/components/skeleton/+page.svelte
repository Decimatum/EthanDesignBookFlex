<script lang="ts">
	import { Skeleton, Card, Inline, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Skeleton</h1>
<p class="lead">Loading placeholders shaped like the content they replace.</p>

<Demo title="Text lines" stack code={`<Skeleton lines={3} />`}>
	<Skeleton lines={3} />
</Demo>

<Demo
	title="Composed card"
	stack
	code={`<Card aria-busy="true">
	<Inline>
		<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
		<Skeleton lines={2} />
	</Inline>
	<Skeleton variant="rect" height="8rem" />
</Card>`}
>
	<Card aria-busy="true">
		<Stack gap="4">
			<Inline gap="3" wrap={false}>
				<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
				<div style="flex: 1"><Skeleton lines={2} /></div>
			</Inline>
			<Skeleton variant="rect" height="8rem" />
		</Stack>
	</Card>
</Demo>

<PropsTable
	rows={[
		{ name: 'variant', type: "'text' | 'rect' | 'circle'", default: "'text'" },
		{ name: 'lines', type: 'number', default: '1' },
		{ name: 'width', type: 'string' },
		{ name: 'height', type: 'string' }
	]}
/>
