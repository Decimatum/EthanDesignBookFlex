<script lang="ts">
	import { Textarea, Field, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let notes = $state('');
</script>

<h1>Textarea</h1>
<p class="lead">Multi-line input, optionally growing with its content.</p>

<Demo
	title="Basic"
	stack
	code={`<Field label="Notes"><Textarea bind:value={notes} rows={4} /></Field>`}
>
	<Field label="Notes" hint="Markdown supported">
		<Textarea bind:value={notes} rows={4} placeholder="Type here" />
	</Field>
</Demo>

<Demo title="Auto-resize" stack code={`<Textarea autoResize placeholder="Write a comment…" />`}>
	<Textarea autoResize placeholder="Write a comment — it grows as you type" aria-label="Comment" />
</Demo>

<Demo title="States" stack code={`<Textarea invalid />\n<Textarea disabled />`}>
	<Stack gap="3">
		<Field label="Invalid" error="Too long">
			<Textarea value="A value that is too long" rows={2} />
		</Field>
		<Field label="Disabled" disabled>
			<Textarea value="Locked" rows={2} />
		</Field>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'string | null', default: "''", description: 'Bindable.' },
		{ name: 'rows', type: 'number', default: '3' },
		{ name: 'autoResize', type: 'boolean', default: 'false' },
		{ name: 'invalid', type: 'boolean', default: 'from Field' },
		{ name: 'disabled / required / id', type: 'native', default: 'from Field' }
	]}
/>
