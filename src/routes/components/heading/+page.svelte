<script lang="ts">
	import { Heading, Stack } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Heading</h1>
<p class="lead">Semantic headings in the display face, with visual size decoupled from level.</p>

<Demo title="Levels" stack code={`<Heading level={1}>…</Heading>`}>
	<Stack gap="2">
		{#each [1, 2, 3, 4, 5, 6] as level (level)}
			<Heading level={level as 1}>Heading level {level}</Heading>
		{/each}
	</Stack>
</Demo>

<Demo title="Sizes" stack code={`<Heading level={2} size="display">…</Heading>`}>
	<Stack gap="2">
		{#each ['display', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as size (size)}
			<Heading level={3} size={size as 'md'}>Size {size}</Heading>
		{/each}
	</Stack>
</Demo>

<Demo
	title="Plain & tones"
	stack
	code={`<Heading level={2} size="xs" plain tone="muted">SECTION</Heading>`}
>
	<Stack gap="2">
		<Heading level={3} size="xs" plain tone="muted">Overview</Heading>
		<Heading level={3} tone="accent">Accent heading</Heading>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2' },
		{
			name: 'size',
			type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'display'",
			description: 'Defaults from level.'
		},
		{ name: 'tone', type: "'default' | 'muted' | 'accent'", default: "'default'" },
		{ name: 'align', type: "'start' | 'center' | 'end'" },
		{
			name: 'plain',
			type: 'boolean',
			default: 'false',
			description: 'Body font instead of display font.'
		},
		{ name: 'truncate', type: 'boolean', default: 'false' }
	]}
/>
