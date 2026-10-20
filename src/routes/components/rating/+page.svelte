<script lang="ts">
	import { Field, Rating } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let energy = $state(3);
	let value = $state(0);
	let confidence = $state(4);
	let effort = $state(2);
</script>

<h1>Rating</h1>
<p class="lead">
	A 1-to-<em>n</em> rating as numbered segments — value, confidence, effort, energy. Tap to set, tap the
	current step to clear; arrows and digits work from the keyboard.
</p>

<Demo
	title="In a field"
	code={`<Field label="Energy" hint="How you felt on waking">
	<Rating bind:value={energy} labels={['Drained', 'Low', 'Okay', 'Good', 'Full']} />
</Field>`}
>
	<Field label="Energy" hint="How you felt on waking">
		<Rating bind:value={energy} labels={['Drained', 'Low', 'Okay', 'Good', 'Full']} />
	</Field>
	<p>Value: <code>{energy}</code></p>
</Demo>

<Demo
	title="Three scales side by side"
	stack
	code={`<Rating bind:value={value} aria-label="Value" />`}
>
	<div class="row">
		<Field label="Value"><Rating bind:value /></Field>
		<Field label="Confidence"><Rating bind:value={confidence} /></Field>
		<Field label="Effort"><Rating bind:value={effort} /></Field>
	</div>
	<p>
		Score = value × confidence ÷ effort = <code
			>{value && confidence && effort ? (value * confidence) / effort : '—'}</code
		>
	</p>
</Demo>

<Demo
	title="Sizes, read-only, disabled"
	code={`<Rating value={4} size="sm" readonly aria-label="Day" />`}
>
	<Rating value={4} size="sm" readonly aria-label="Day rating" />
	<Rating value={2} disabled aria-label="Disabled" />
	<Rating value={7} max={10} aria-label="Out of ten" />
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'number', default: '0', description: 'Bindable; 0 = not rated.' },
		{ name: 'max', type: 'number', default: '5' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{
			name: 'labels',
			type: 'string[]',
			description: 'Per step from 1; tooltip and accessible name.'
		},
		{ name: 'readonly', type: 'boolean', default: 'false' },
		{ name: 'disabled', type: 'boolean', default: 'from Field' },
		{ name: 'name', type: 'string', description: 'Hidden input for form submission.' },
		{ name: 'onchange', type: '(value: number) => void' }
	]}
/>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
	}
</style>
