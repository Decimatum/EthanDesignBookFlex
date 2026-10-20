<script lang="ts">
	import { VirtualList, Button, Inline, Input, Text, Badge, Delta } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	// Deterministic sample data so screenshots are stable.
	function rand(seed: number) {
		const x = Math.sin(seed * 9301 + 49297) * 233280;
		return x - Math.floor(x);
	}
	const symbols = ['NVDA', 'MSFT', 'AAPL', 'TSM', 'ASML', 'AMZN', 'META', 'GOOG', 'AMD', 'AVGO'];
	interface Fill {
		id: number;
		time: string;
		symbol: string;
		side: 'Buy' | 'Sell';
		qty: number;
		price: number;
		change: number;
	}
	const fills: Fill[] = Array.from({ length: 10_000 }, (_, i) => {
		const t = 9 * 3600 + 30 * 60 + i * 2;
		const h = Math.floor(t / 3600);
		const m = Math.floor((t % 3600) / 60);
		const s = t % 60;
		return {
			id: i,
			time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
			symbol: symbols[Math.floor(rand(i) * symbols.length)],
			side: rand(i + 1) > 0.5 ? 'Buy' : 'Sell',
			qty: Math.round(rand(i + 2) * 900 + 100),
			price: Math.round(rand(i + 3) * 90000 + 10000) / 100,
			change: Math.round((rand(i + 4) - 0.5) * 400) / 100
		};
	});

	let list: VirtualList<Fill> | undefined = $state();
	let target = $state('5000');

	// Variable heights: messages of different lengths.
	const messages = Array.from({ length: 2_000 }, (_, i) => {
		const n = 1 + Math.floor(rand(i * 7) * 4);
		return {
			id: i,
			author: ['Ops', 'Risk', 'Desk', 'Compliance'][i % 4],
			text: Array.from(
				{ length: n },
				(_, k) =>
					[
						'Position limits updated for the US session.',
						'Please acknowledge the revised margin schedule before the open.',
						'Fill reconciled.',
						'Reminder: settlement cut-off is 15:00 local for all EUR legs today.'
					][(i + k) % 4]
			).join(' ')
		};
	});

	// Infinite loading: start with a page and append on demand.
	let loaded = $state(fills.slice(0, 60));
	let loading = $state(false);
	function loadMore() {
		if (loading || loaded.length >= fills.length) return;
		loading = true;
		setTimeout(() => {
			loaded = fills.slice(0, loaded.length + 60);
			loading = false;
		}, 400);
	}
</script>

<h1>VirtualList</h1>
<p class="lead">
	A scrolling list that renders only the rows in view, so ten thousand items cost the same as
	twenty. Fixed row heights by default; set <code>measure</code> for rows of varying height. For
	columns, sorting and headers use <code>Table</code> (or the DataTable layer on top of it).
</p>

<Demo
	title="10,000 fills"
	stack
	code={`<VirtualList items={fills} itemHeight={36} height="18rem" divided label="Fills">
	{#snippet row(fill)}
		<div class="fill">
			<span class="mono">{fill.time}</span>
			<strong>{fill.symbol}</strong>
			<Badge tone={fill.side === 'Buy' ? 'success' : 'danger'}>{fill.side}</Badge>
			<span class="mono">{fill.qty} @ {fill.price.toFixed(2)}</span>
			<Delta value={fill.change} />
		</div>
	{/snippet}
</VirtualList>`}
>
	<VirtualList bind:this={list} items={fills} itemHeight={36} height="18rem" divided label="Fills">
		{#snippet row(fill)}
			<div class="fill">
				<span class="mono muted">{fill.time}</span>
				<strong>{fill.symbol}</strong>
				<Badge tone={fill.side === 'Buy' ? 'success' : 'danger'} size="sm">{fill.side}</Badge>
				<span class="mono">{fill.qty} @ {fill.price.toFixed(2)}</span>
				<Delta value={fill.change} />
			</div>
		{/snippet}
	</VirtualList>
	<Inline gap="2" align="center">
		<Input bind:value={target} inputmode="numeric" size="sm" aria-label="Row index" />
		<Button
			size="sm"
			variant="outline"
			tone="neutral"
			onclick={() => list?.scrollToIndex(Number(target), 'start')}
		>
			Scroll to row
		</Button>
		<Button size="sm" variant="ghost" tone="neutral" onclick={() => list?.scrollToIndex(0)}
			>Top</Button
		>
		<Button
			size="sm"
			variant="ghost"
			tone="neutral"
			onclick={() => list?.scrollToIndex(fills.length - 1)}
		>
			Bottom
		</Button>
	</Inline>
</Demo>

<Demo
	title="Variable row heights"
	stack
	code={`<VirtualList items={messages} measure itemHeight={56} height="20rem" divided>
	{#snippet row(m)}
		<div class="message">
			<Text size="sm" weight="semibold">{m.author}</Text>
			<Text size="sm" tone="muted">{m.text}</Text>
		</div>
	{/snippet}
</VirtualList>`}
>
	<VirtualList items={messages} measure itemHeight={56} height="20rem" divided label="Messages">
		{#snippet row(m)}
			<div class="message">
				<Text size="sm" weight="semibold">{m.author}</Text>
				<Text size="sm" tone="muted">{m.text}</Text>
			</div>
		{/snippet}
	</VirtualList>
	<Text size="sm" tone="muted">
		<code>itemHeight</code> is only the estimate for rows that have not been rendered yet; measured heights
		replace it as rows scroll into view.
	</Text>
</Demo>

<Demo
	title="Load more at the end"
	stack
	code={`<VirtualList items={loaded} itemHeight={36} height="14rem" onEndReached={loadMore} endThreshold={10}>
	{#snippet row(fill)}…{/snippet}
</VirtualList>`}
>
	<VirtualList
		items={loaded}
		itemHeight={36}
		height="14rem"
		divided
		label="Fills (paged)"
		onEndReached={loadMore}
		endThreshold={10}
	>
		{#snippet row(fill)}
			<div class="fill">
				<span class="mono muted">{fill.time}</span>
				<strong>{fill.symbol}</strong>
				<span class="mono">{fill.qty} @ {fill.price.toFixed(2)}</span>
			</div>
		{/snippet}
	</VirtualList>
	<Text size="sm" tone="muted">
		{loaded.length.toLocaleString()} of {fills.length.toLocaleString()} loaded{loading
			? ' — loading…'
			: ''}
	</Text>
</Demo>

<Demo
	title="Empty"
	code={`<VirtualList items={[]} emptyText="No fills yet" height="8rem">…</VirtualList>`}
>
	<VirtualList items={[] as Fill[]} emptyText="No fills yet" height="8rem" class="grow">
		{#snippet row(fill)}{fill.symbol}{/snippet}
	</VirtualList>
</Demo>

<PropsTable
	rows={[
		{ name: 'items', type: 'T[]', default: '—', description: 'Required.' },
		{
			name: 'row',
			type: 'Snippet<[T, number]>',
			default: '—',
			description: 'Required. Renders one row; the list positions it.'
		},
		{
			name: 'itemHeight',
			type: 'number',
			default: '40',
			description: 'Row height in px, or the estimate when `measure` is on.'
		},
		{
			name: 'measure',
			type: 'boolean',
			default: 'false',
			description: 'Measure rendered rows so heights may vary.'
		},
		{ name: 'height', type: 'string', default: "'20rem'", description: 'Viewport height.' },
		{ name: 'overscan', type: 'number', default: '4', description: 'Extra rows above and below.' },
		{
			name: 'itemKey',
			type: '(item, index) => string | number',
			default: 'index',
			description: 'Stable key; set it when items are inserted or removed.'
		},
		{ name: 'label', type: 'string', default: "'List'", description: 'Accessible name.' },
		{ name: 'divided', type: 'boolean', default: 'false' },
		{ name: 'emptyText', type: 'string', default: "'No items'" },
		{ name: 'empty', type: 'Snippet', default: '—', description: 'Replaces emptyText.' },
		{ name: 'onRangeChange', type: '(range) => void', default: '—' },
		{
			name: 'onEndReached',
			type: '() => void',
			default: '—',
			description: 'Fires once each time the last `endThreshold` rows come into view.'
		},
		{ name: 'endThreshold', type: 'number', default: '5' },
		{
			name: 'scrollToIndex()',
			type: "(index, align?: 'start' | 'center' | 'end' | 'nearest') => void",
			default: '—',
			description: 'Method on the instance (`bind:this`).'
		}
	]}
/>

<style>
	.fill,
	.message {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		height: 100%;
		padding-inline: var(--space-3);
		font-size: var(--text-sm);
	}
	.message {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
		padding-block: var(--space-2);
	}
	.mono {
		font-family: var(--font-mono);
		font-variant-numeric: var(--font-numeric);
	}
	.muted {
		color: var(--color-text-muted);
	}
	.fill strong {
		min-width: 4ch;
	}
	:global(.grow) {
		flex: 1;
	}
</style>
