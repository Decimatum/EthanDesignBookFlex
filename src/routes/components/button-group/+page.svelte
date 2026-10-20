<script lang="ts">
	import { ButtonGroup, Button, Text } from '$lib/index.js';
	import { Bold, Italic, Underline, ChevronDown } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let range = $state('1D');
</script>

<h1>Button group</h1>
<p class="lead">
	Related buttons laid out as one unit: segmented options, split actions, toolbars.
</p>

<Demo
	title="Segmented"
	stack
	code={`<ButtonGroup label="Chart range">
	{#each ranges as r (r)}
		<Button variant={range === r ? 'solid' : 'outline'} tone="neutral" size="sm" onclick={() => (range = r)}>{r}</Button>
	{/each}
</ButtonGroup>`}
>
	<ButtonGroup label="Chart range">
		{#each ['1D', '1W', '1M', '1Y', 'All'] as r (r)}
			<Button
				variant={range === r ? 'solid' : 'outline'}
				tone="neutral"
				size="sm"
				aria-pressed={range === r}
				onclick={() => (range = r)}>{r}</Button
			>
		{/each}
	</ButtonGroup>
	<Text size="sm" tone="muted">Showing the {range} range.</Text>
</Demo>

<Demo
	title="Toolbar and split button"
	code={`<ButtonGroup label="Formatting">
	<Button variant="outline" tone="neutral" iconOnly aria-label="Bold">{#snippet leading()}<Bold />{/snippet}</Button>
	…
</ButtonGroup>
<ButtonGroup label="Save">
	<Button>Save</Button>
	<Button iconOnly aria-label="More save options">{#snippet leading()}<ChevronDown />{/snippet}</Button>
</ButtonGroup>`}
>
	<ButtonGroup label="Formatting">
		<Button variant="outline" tone="neutral" iconOnly aria-label="Bold">
			{#snippet leading()}<Bold />{/snippet}
		</Button>
		<Button variant="outline" tone="neutral" iconOnly aria-label="Italic">
			{#snippet leading()}<Italic />{/snippet}
		</Button>
		<Button variant="outline" tone="neutral" iconOnly aria-label="Underline">
			{#snippet leading()}<Underline />{/snippet}
		</Button>
	</ButtonGroup>
	<ButtonGroup label="Save">
		<Button>Save order</Button>
		<Button iconOnly aria-label="More save options">
			{#snippet leading()}<ChevronDown />{/snippet}
		</Button>
	</ButtonGroup>
</Demo>

<Demo
	title="Detached and vertical"
	code={`<ButtonGroup attached={false}>…</ButtonGroup>
<ButtonGroup orientation="vertical">…</ButtonGroup>`}
>
	<ButtonGroup attached={false} label="Form actions">
		<Button variant="outline" tone="neutral">Cancel</Button>
		<Button>Save</Button>
	</ButtonGroup>
	<ButtonGroup orientation="vertical" label="Zoom">
		<Button variant="outline" tone="neutral" size="sm">Zoom in</Button>
		<Button variant="outline" tone="neutral" size="sm">Reset</Button>
		<Button variant="outline" tone="neutral" size="sm">Zoom out</Button>
	</ButtonGroup>
</Demo>

<PropsTable
	rows={[
		{ name: 'attached', type: 'boolean', default: 'true' },
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
		{ name: 'label', type: 'string', description: 'Accessible name of the group.' }
	]}
/>
