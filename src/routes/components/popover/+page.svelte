<script lang="ts">
	import { Popover, Button, Stack, Checkbox, Text, Inline, Avatar } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Popover</h1>
<p class="lead">A floating panel anchored to its trigger.</p>

<Demo
	title="Filter panel"
	code={`<Popover>
	{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral">Filters</Button>{/snippet}
	{#snippet children({ close })}
		<Stack gap="2">
			<Checkbox>Open orders</Checkbox>
			<Button size="sm" onclick={close}>Apply</Button>
		</Stack>
	{/snippet}
</Popover>`}
>
	<Popover width="16rem">
		{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral">Filters</Button
			>{/snippet}
		{#snippet children({ close })}
			<Stack gap="3">
				<Text weight="semibold" size="sm">Show</Text>
				<Checkbox checked>Open orders</Checkbox>
				<Checkbox>Filled today</Checkbox>
				<Checkbox>Cancelled</Checkbox>
				<Button size="sm" onclick={close}>Apply</Button>
			</Stack>
		{/snippet}
	</Popover>
</Demo>

<Demo title="Sides" code={`<Popover side="right" align="start">…</Popover>`}>
	<Inline gap="2">
		{#each ['top', 'right', 'bottom', 'left'] as side (side)}
			<Popover side={side as 'top'}>
				{#snippet trigger(props)}<Button {...props} variant="soft" tone="neutral">{side}</Button
					>{/snippet}
				<Text size="sm">Opens on the <strong>{side}</strong>, flipping if there's no room.</Text>
			</Popover>
		{/each}
	</Inline>
</Demo>

<Demo title="Rich content, no arrow" code={`<Popover arrow={false} flush>…</Popover>`}>
	<Popover arrow={false} flush width="18rem">
		{#snippet trigger(props)}<Button {...props} variant="ghost" tone="neutral">@ada</Button
			>{/snippet}
		<div style="padding: var(--space-4)">
			<Inline gap="3" wrap={false}>
				<Avatar name="Ada Lovelace" />
				<Stack gap="0">
					<Text weight="semibold">Ada Lovelace</Text>
					<Text size="sm" tone="muted">Analytical engines · London</Text>
				</Stack>
			</Inline>
		</div>
	</Popover>
</Demo>

<PropsTable
	rows={[
		{ name: 'open', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'" },
		{ name: 'align', type: "'start' | 'center' | 'end'", default: "'center'" },
		{ name: 'sideOffset', type: 'number', default: '8' },
		{ name: 'arrow', type: 'boolean', default: 'true' },
		{ name: 'width', type: 'string', description: 'Any CSS length.' },
		{ name: 'flush', type: 'boolean', default: 'false', description: 'No padding.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void' }
	]}
/>
<p>Snippets: <code>trigger(props)</code> (required), <code>children({'{ close }'})</code>.</p>
