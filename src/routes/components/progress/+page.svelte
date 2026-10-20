<script lang="ts">
	import { Progress, Button, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let value = $state(35);
</script>

<h1>Progress</h1>
<p class="lead">
	A bar for determinate progress, or an indeterminate sweep while the length is unknown.
</p>

<Demo
	title="Determinate"
	stack
	code={`<Progress value={35} label="Uploading statement.pdf" showValue />`}
>
	<Progress {value} label="Uploading statement.pdf" showValue />
	<div>
		<Button size="sm" variant="outline" tone="neutral" onclick={() => (value = (value + 25) % 125)}>
			Advance
		</Button>
	</div>
</Demo>

<Demo title="Indeterminate" stack code={`<Progress label="Syncing positions" />`}>
	<Progress label="Syncing positions" />
</Demo>

<Demo
	title="Sizes and tones"
	stack
	code={`<Progress value={90} tone="warning" size="sm" aria-label="Margin used" />`}
>
	<Stack gap="4">
		<Progress value={20} size="sm" aria-label="Small accent" />
		<Progress value={60} tone="success" label="Order filled" showValue />
		<Progress value={90} tone="warning" size="lg" label="Margin used" showValue />
		<Progress value={100} tone="danger" label="Daily loss limit" showValue />
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'number', description: '0–100; omit for indeterminate.' },
		{ name: 'label', type: 'string', description: 'Visible label and accessible name.' },
		{ name: 'showValue', type: 'boolean', default: 'false' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger'", default: "'accent'" }
	]}
/>
