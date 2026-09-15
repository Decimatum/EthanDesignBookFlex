<script lang="ts">
	import { Tooltip, Button, Inline, Text } from '$lib/index.js';
	import { Trash2, Pencil, Copy } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Tooltip</h1>
<p class="lead">A short label on hover or focus — for icon buttons and truncated text.</p>

<Demo
	title="Icon buttons"
	code={`<Tooltip text="Delete">
	{#snippet children(props)}
		<Button {...props} iconOnly aria-label="Delete" variant="ghost" tone="neutral">
			{#snippet leading()}<Trash2 />{/snippet}
		</Button>
	{/snippet}
</Tooltip>`}
>
	<Inline gap="1">
		<Tooltip text="Edit">
			{#snippet children(props)}
				<Button {...props} iconOnly aria-label="Edit" variant="ghost" tone="neutral">
					{#snippet leading()}<Pencil />{/snippet}
				</Button>
			{/snippet}
		</Tooltip>
		<Tooltip text="Copy link">
			{#snippet children(props)}
				<Button {...props} iconOnly aria-label="Copy link" variant="ghost" tone="neutral">
					{#snippet leading()}<Copy />{/snippet}
				</Button>
			{/snippet}
		</Tooltip>
		<Tooltip text="Delete">
			{#snippet children(props)}
				<Button {...props} iconOnly aria-label="Delete" variant="ghost" tone="danger">
					{#snippet leading()}<Trash2 />{/snippet}
				</Button>
			{/snippet}
		</Tooltip>
	</Inline>
</Demo>

<Demo title="Sides" code={`<Tooltip text="…" side="right">…</Tooltip>`}>
	{#each ['top', 'right', 'bottom', 'left'] as side (side)}
		<Tooltip text="Tooltip on the {side}" side={side as 'top'}>
			{#snippet children(props)}<Button {...props} variant="soft" tone="neutral">{side}</Button
				>{/snippet}
		</Tooltip>
	{/each}
</Demo>

<Demo
	title="Rich content"
	code={`<Tooltip>
	{#snippet content()}<strong>Sharpe 1.82</strong> · 12m rolling{/snippet}
	{#snippet children(props)}<Button {...props} variant="link">Sharpe</Button>{/snippet}
</Tooltip>`}
>
	<Text>
		Risk-adjusted return is measured by
		<Tooltip>
			{#snippet content()}<strong>Sharpe 1.82</strong> · 12-month rolling, risk-free 4.1%{/snippet}
			{#snippet children(props)}<Button {...props} variant="link">Sharpe ratio</Button>{/snippet}
		</Tooltip>
		over the trailing year.
	</Text>
</Demo>

<PropsTable
	rows={[
		{ name: 'text', type: 'string' },
		{ name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'" },
		{ name: 'align', type: "'start' | 'center' | 'end'", default: "'center'" },
		{ name: 'delay', type: 'number', default: '300', description: 'Hover delay in ms.' },
		{ name: 'disabled', type: 'boolean', default: 'false' }
	]}
/>
<p>Snippets: <code>children(props)</code> (required, must be focusable), <code>content</code>.</p>
