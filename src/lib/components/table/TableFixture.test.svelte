<script lang="ts">
	import Table, { type SortState, type TableColumn } from './Table.svelte';

	interface Row {
		id: number;
		symbol: string;
		qty: number;
		pnl: number | null;
	}

	let {
		rows = [
			{ id: 1, symbol: 'MSFT', qty: 10, pnl: 120.5 },
			{ id: 2, symbol: 'AAPL', qty: 25, pnl: -40 },
			{ id: 3, symbol: 'NVDA', qty: 5, pnl: null }
		],
		onSort,
		onRowClick,
		withButtons = false,
		sort = $bindable()
	}: {
		withButtons?: boolean;
		rows?: Row[];
		onSort?: (s: SortState) => void;
		onRowClick?: (row: Row) => void;
		sort?: SortState;
	} = $props();

	const columns: TableColumn<Row>[] = $derived([
		{ key: 'symbol', header: 'Symbol', sortable: true, cell: withButtons ? symbolCell : undefined },
		{ key: 'qty', header: 'Qty', numeric: true, sortable: true },
		{ key: 'pnl', header: 'P&L', numeric: true, sortable: true, cell: pnlCell }
	]);
</script>

{#snippet symbolCell(row: Row)}
	{row.symbol}
	<button type="button" aria-label="Close {row.symbol}">×</button>
{/snippet}
{#snippet pnlCell(row: Row)}
	<span data-testid="pnl">{row.pnl === null ? '—' : row.pnl.toFixed(2)}</span>
{/snippet}

<Table
	{columns}
	{rows}
	rowKey={(r) => r.id}
	bind:sort
	{onSort}
	{onRowClick}
	caption="Open positions"
	emptyText="Nothing here"
/>
<span data-testid="sort">{sort ? `${sort.key}:${sort.direction}` : 'none'}</span>
