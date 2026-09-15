<script lang="ts">
	import { RadioGroup, Radio, Stack, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let plan = $state('pro');
	let layout = $state('grid');
</script>

<h1>Radio</h1>
<p class="lead">Single choice from a small set, grouped by <code>RadioGroup</code>.</p>

<Demo
	title="Vertical group"
	stack
	code={`<RadioGroup label="Plan" bind:value={plan} hint="You can change this later.">
	<Radio value="basic">Basic</Radio>
	<Radio value="pro" description="Most popular">Pro</Radio>
	<Radio value="team">Team</Radio>
</RadioGroup>`}
>
	<Stack gap="3" align="start">
		<RadioGroup label="Plan" bind:value={plan} hint="You can change this later.">
			<Radio value="basic">Basic</Radio>
			<Radio value="pro" description="Most popular">Pro</Radio>
			<Radio value="team">Team</Radio>
		</RadioGroup>
		<Text size="sm" tone="muted">Selected: {plan}</Text>
	</Stack>
</Demo>

<Demo
	title="Horizontal"
	stack
	code={`<RadioGroup label="Layout" orientation="horizontal" bind:value={layout}>…</RadioGroup>`}
>
	<RadioGroup label="Layout" orientation="horizontal" bind:value={layout}>
		<Radio value="grid">Grid</Radio>
		<Radio value="list">List</Radio>
		<Radio value="table">Table</Radio>
	</RadioGroup>
</Demo>

<Demo title="States" stack code={`<RadioGroup disabled …>\n<RadioGroup error="Choose a plan" …>`}>
	<Stack gap="4">
		<RadioGroup label="Disabled" disabled value="a">
			<Radio value="a">Option A</Radio>
			<Radio value="b">Option B</Radio>
		</RadioGroup>
		<RadioGroup label="With error" error="Choose a plan" required>
			<Radio value="a">Option A</Radio>
			<Radio value="b">Option B</Radio>
		</RadioGroup>
	</Stack>
</Demo>

<PropsTable
	title="RadioGroup props"
	rows={[
		{ name: 'value', type: 'string', description: 'Bindable.' },
		{ name: 'name', type: 'string', default: 'generated' },
		{ name: 'label', type: 'string' },
		{ name: 'hint', type: 'string' },
		{ name: 'error', type: 'string' },
		{ name: 'required', type: 'boolean', default: 'false' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'" },
		{ name: 'onValueChange', type: '(value: string) => void' }
	]}
/>
<PropsTable
	title="Radio props"
	rows={[
		{ name: 'value', type: 'string', description: 'Required.' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'description', type: 'string' },
		{ name: 'disabled', type: 'boolean', default: 'from group' }
	]}
/>
