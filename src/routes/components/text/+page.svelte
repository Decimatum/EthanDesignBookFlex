<script lang="ts">
	import { Text, Stack, type TextTone } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const tones: TextTone[] = [
		'default',
		'muted',
		'subtle',
		'accent',
		'success',
		'warning',
		'danger',
		'info',
		'positive',
		'negative'
	];
</script>

<h1>Text</h1>
<p class="lead">Body text with size, weight and tone from tokens.</p>

<Demo title="Sizes" stack code={`<Text size="sm">…</Text>`}>
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
		<Text size={size as 'md'}>The quick brown fox — size {size}</Text>
	{/each}
</Demo>

<Demo title="Weights" stack code={`<Text weight="semibold">…</Text>`}>
	{#each ['regular', 'medium', 'semibold', 'bold'] as weight (weight)}
		<Text weight={weight as 'regular'}>Weight {weight}</Text>
	{/each}
</Demo>

<Demo title="Tones" stack code={`<Text tone="muted">…</Text>`}>
	<Stack gap="1">
		{#each tones as tone (tone)}
			<Text {tone}>tone="{tone}"</Text>
		{/each}
	</Stack>
</Demo>

<Demo
	title="Numerals"
	code={`<Text numeric>1,234.56</Text>
<Text numeric tone="positive">+3.21%</Text>
<Text numeric mono>0.00042</Text>`}
>
	<Stack gap="0" align="end">
		<Text numeric>1,234.56</Text>
		<Text numeric>98,765.43</Text>
		<Text numeric tone="positive">+3.21%</Text>
		<Text numeric tone="negative">−0.87%</Text>
		<Text numeric mono>0.00042</Text>
	</Stack>
</Demo>

<Demo
	title="Truncate & clamp"
	stack
	code={`<Text truncate>…</Text>
<Text lines={2}>…</Text>`}
>
	<div style="max-width: 20rem">
		<Text truncate
			>This sentence is far too long to fit on one line and will be cut off with an ellipsis.</Text
		>
	</div>
	<div style="max-width: 24rem">
		<Text lines={2} tone="muted">
			Line clamping keeps a preview to a fixed number of lines. This paragraph keeps going and going
			so that the clamp has something to cut, and then it stops being shown.
		</Text>
	</div>
</Demo>

<PropsTable
	rows={[
		{
			name: 'as',
			type: "'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'dt' | 'dd' | 'li' | 'figcaption'",
			default: "'p'"
		},
		{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
		{ name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold'", default: "'regular'" },
		{ name: 'tone', type: 'TextTone', default: "'default'" },
		{ name: 'align', type: "'start' | 'center' | 'end'" },
		{ name: 'mono', type: 'boolean', default: 'false' },
		{ name: 'numeric', type: 'boolean', default: 'false', description: 'Tabular numerals.' },
		{ name: 'truncate', type: 'boolean', default: 'false' },
		{ name: 'lines', type: 'number', description: 'Clamp to N lines.' }
	]}
/>
