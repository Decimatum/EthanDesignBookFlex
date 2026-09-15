<script lang="ts">
	import { Divider, Inline, Text, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Divider</h1>
<p class="lead">A hairline separator with an optional label.</p>

<Demo title="Horizontal" stack code={`<Divider />\n<Divider>or</Divider>`}>
	<Stack gap="4">
		<Text>Above</Text>
		<Divider />
		<Text>Between</Text>
		<Divider>or</Divider>
		<Text>Below</Text>
	</Stack>
</Demo>

<Demo
	title="Vertical"
	code={`<Inline>
	<Text>Left</Text>
	<Divider orientation="vertical" />
	<Text>Right</Text>
</Inline>`}
>
	<Inline gap="4">
		<Text>Docs</Text>
		<Divider orientation="vertical" />
		<Text>Components</Text>
		<Divider orientation="vertical" />
		<Text>Patterns</Text>
	</Inline>
</Demo>

<PropsTable
	rows={[
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
		{
			name: 'spacing',
			type: 'Space',
			default: "'0'",
			description: 'Margin on the perpendicular axis.'
		}
	]}
/>
