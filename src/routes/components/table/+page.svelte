<script lang="ts">
	import {
		Table,
		Badge,
		EmptyState,
		Button,
		type TableColumn,
		type SortState
	} from '$lib/index.js';
	import { Inbox } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	interface Position {
		id: number;
		symbol: string;
		name: string;
		qty: number;
		price: number;
		pnl: number;
		status: 'open' | 'closing';
	}

	const rows: Position[] = [
		{
			id: 1,
			symbol: 'MSFT',
			name: 'Microsoft',
			qty: 40,
			price: 412.3,
			pnl: 1184.0,
			status: 'open'
		},
		{ id: 2, symbol: 'AAPL', name: 'Apple', qty: 120, price: 189.9, pnl: -342.6, status: 'open' },
		{
			id: 3,
			symbol: 'NVDA',
			name: 'NVIDIA',
			qty: 15,
			price: 902.5,
			pnl: 2610.75,
			status: 'closing'
		},
		{
			id: 4,
			symbol: 'TSM',
			name: 'Taiwan Semiconductor',
			qty: 60,
			price: 145.2,
			pnl: 96.0,
			status: 'open'
		},
		{
			id: 5,
			symbol: 'ASML',
			name: 'ASML Holding',
			qty: 8,
			price: 880.0,
			pnl: -410.4,
			status: 'open'
		}
	];

	const money = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', header: 'Symbol', sortable: true, width: '6rem' },
		{ key: 'name', header: 'Name', sortable: true },
		{ key: 'qty', header: 'Qty', numeric: true, sortable: true },
		{ key: 'price', header: 'Price', numeric: true, sortable: true, cell: price },
		{ key: 'pnl', header: 'P&L', numeric: true, sortable: true, cell: pnl },
		{ key: 'status', header: 'Status', cell: status }
	];

	let sort = $state<SortState>({ key: 'pnl', direction: 'desc' });
	let clicked = $state<string>();
</script>

{#snippet price(row: Position)}{money.format(row.price)}{/snippet}
{#snippet pnl(row: Position)}
	<span style:color={row.pnl < 0 ? 'var(--color-negative-text)' : 'var(--color-positive-text)'}>
		{row.pnl < 0 ? '−' : '+'}{money.format(Math.abs(row.pnl))}
	</span>
{/snippet}
{#snippet status(row: Position)}
	<Badge tone={row.status === 'open' ? 'success' : 'warning'} variant="soft">{row.status}</Badge>
{/snippet}

<h1>Table</h1>
<p class="lead">
	Column-driven data tables with sorting, numeric columns, custom cells and an empty state.
</p>

<Demo
	title="Sortable"
	stack
	code={`<Table {columns} {rows} rowKey={(r) => r.id} bind:sort caption="Open positions" />`}
>
	<Table {columns} {rows} rowKey={(r) => r.id} bind:sort caption="Open positions" />
	<p class="note">
		Sorted by <code>{sort.key}</code>
		{sort.direction}. Sorting is client-side; pass
		<code>onSort</code> to do it on the server.
	</p>
</Demo>

<Demo
	title="Clickable rows, striped, sticky header"
	stack
	code={`<Table {columns} {rows} striped stickyHeader onRowClick={(row) => open(row)} />`}
>
	<div style="max-height: 14rem; display: grid;">
		<Table
			columns={columns.slice(0, 4)}
			rows={[...rows, ...rows.map((r) => ({ ...r, id: r.id + 10 }))]}
			rowKey={(r) => r.id}
			striped
			stickyHeader
			caption="Watchlist"
			onRowClick={(row) => (clicked = row.symbol)}
		/>
	</div>
	<p class="note">{clicked ? `Opened ${clicked}.` : 'Click or press Enter on a row.'}</p>
</Demo>

<Demo
	title="Empty"
	stack
	code={`<Table {columns} rows={[]} caption="Orders">
	{#snippet empty()}
		<EmptyState title="No orders yet" size="sm">…</EmptyState>
	{/snippet}
</Table>`}
>
	<Table columns={columns.slice(0, 4)} rows={[]} caption="Orders">
		{#snippet empty()}
			<EmptyState title="No orders yet" description="Orders you place will show up here." size="sm">
				{#snippet icon()}<Inbox />{/snippet}
				{#snippet actions()}<Button size="sm">New order</Button>{/snippet}
			</EmptyState>
		{/snippet}
	</Table>
</Demo>

<PropsTable
	rows={[
		{
			name: 'columns',
			type: 'TableColumn<T>[]',
			description: 'Required. key, header, align, numeric, sortable, width, cell, sortValue.'
		},
		{ name: 'rows', type: 'T[]', description: 'Required.' },
		{ name: 'rowKey', type: '(row, index) => string | number', default: 'index' },
		{ name: 'sort', type: 'SortState', description: 'Bindable { key, direction }.' },
		{ name: 'onSort', type: '(sort: SortState) => void', description: 'Take over sorting.' },
		{ name: 'onRowClick', type: '(row: T) => void' },
		{ name: 'caption', type: 'string', description: 'Accessible name.' },
		{ name: 'stickyHeader', type: 'boolean', default: 'false' },
		{ name: 'striped', type: 'boolean', default: 'false' },
		{ name: 'emptyText', type: 'string', default: "'No data'" },
		{ name: 'empty', type: 'Snippet' }
	]}
/>

<style>
	.note {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
