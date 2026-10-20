<script lang="ts">
	import { Tag, Inline, Text } from '$lib/index.js';
	import { Cpu, Zap, Landmark } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let filters = $state(['Tech', 'Energy', 'Financials']);
	let selected = $state<Record<string, boolean>>({ open: true, filled: false, cancelled: false });
</script>

<h1>Tag</h1>
<p class="lead">Pills for user-controlled labels: filter chips, selections, categories.</p>

<Demo
	title="Tones"
	code={`<Tag>Neutral</Tag>
<Tag tone="accent">Accent</Tag>
<Tag tone="success" size="sm">Small</Tag>`}
>
	<Tag>Neutral</Tag>
	<Tag tone="accent">Accent</Tag>
	<Tag tone="success">Success</Tag>
	<Tag tone="warning">Warning</Tag>
	<Tag tone="danger">Danger</Tag>
	<Tag tone="info" size="sm">Small info</Tag>
	<Tag tone="accent" size="sm">{#snippet leading()}<Zap />{/snippet}With icon</Tag>
</Demo>

<Demo
	title="Removable"
	stack
	code={`{#each filters as f (f)}
	<Tag onRemove={() => (filters = filters.filter((x) => x !== f))}>{f}</Tag>
{/each}`}
>
	<Inline gap="2">
		{#each filters as f (f)}
			<Tag onRemove={() => (filters = filters.filter((x) => x !== f))}>
				{#snippet leading()}{#if f === 'Tech'}<Cpu />{:else if f === 'Energy'}<Zap
						/>{:else}<Landmark />{/if}{/snippet}
				{f}
			</Tag>
		{/each}
		{#if filters.length === 0}
			<Text size="sm" tone="muted">All filters cleared.</Text>
		{/if}
	</Inline>
</Demo>

<Demo
	title="Selectable"
	stack
	code={`<Tag bind:selected={onlyOpen} onSelect={(s) => refetch(s)}>Open</Tag>`}
>
	<Inline gap="2">
		{#each Object.keys(selected) as key (key)}
			<Tag bind:selected={selected[key]} onSelect={() => {}}>{key}</Tag>
		{/each}
		<Tag onSelect={() => {}} disabled>Disabled</Tag>
	</Inline>
	<Text size="sm" tone="muted">
		Showing: {Object.entries(selected)
			.filter(([, v]) => v)
			.map(([k]) => k)
			.join(', ') || 'nothing'}
	</Text>
</Demo>

<PropsTable
	rows={[
		{ name: 'tone', type: 'Tone', default: "'neutral'" },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'onRemove', type: '() => void', description: 'Adds a remove button.' },
		{ name: 'selected', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'onSelect', type: '(selected: boolean) => void', description: 'Makes it a toggle.' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'leading', type: 'Snippet', description: 'Icon.' }
	]}
/>
