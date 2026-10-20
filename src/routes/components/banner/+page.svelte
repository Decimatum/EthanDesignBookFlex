<script lang="ts">
	import { Banner, Button, type BannerTone } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	const tones: BannerTone[] = ['info', 'success', 'warning', 'danger', 'neutral', 'accent'];
	let open = $state(true);
</script>

<h1>Banner</h1>
<p class="lead">
	A full-width, single-line notice for a page or a section: one message, optional actions, optional
	dismiss. Boxed messages inside a form are an <a href="/components/alert/">Alert</a>; transient
	ones are a <a href="/components/toast/">Toast</a>.
</p>

<Demo
	title="With an action"
	stack
	code={`<Banner tone="warning" title="September is still open" dismissible>
	Budgeted 4,800 · spent 4,615 · 185 under.
	{#snippet actions()}<Button size="sm" variant="outline" tone="neutral">Close the month</Button>{/snippet}
</Banner>`}
>
	<Banner tone="warning" title="September is still open" dismissible bind:open>
		Budgeted 4,800 · spent 4,615 · 185 under.
		{#snippet actions()}<Button size="sm" variant="outline" tone="neutral">Close the month</Button
			>{/snippet}
	</Banner>
	{#if !open}<Button size="sm" variant="ghost" onclick={() => (open = true)}>Show it again</Button
		>{/if}
</Demo>

<Demo title="Tones" stack code={`<Banner tone="success">Backup written at 03:00.</Banner>`}>
	{#each tones as tone (tone)}
		<Banner {tone} title={tone}>The message runs on one line and wraps when it must.</Banner>
	{/each}
</Demo>

<Demo
	title="Without an icon"
	stack
	code={`<Banner tone="neutral" icon={null}>3 of 3 ideas in progress — the limit.</Banner>`}
>
	<Banner tone="neutral" icon={null}
		>3 of 3 ideas in progress — the limit. Finish or park one to start another.</Banner
	>
</Demo>

<PropsTable
	rows={[
		{
			name: 'tone',
			type: "'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent'",
			default: "'info'"
		},
		{ name: 'title', type: 'string', description: 'Bold lead-in.' },
		{ name: 'dismissible', type: 'boolean', default: 'false' },
		{ name: 'open', type: 'boolean', default: 'true', description: 'Bindable.' },
		{ name: 'onDismiss', type: '() => void' },
		{ name: 'icon', type: 'Snippet | null', default: 'by tone' },
		{ name: 'actions', type: 'Snippet', description: 'Buttons or links at the end of the line.' }
	]}
/>
