<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type SortDirection = 'asc' | 'desc';
	export interface SortState {
		key: string;
		direction: SortDirection;
	}

	export interface TableColumn<T> {
		/** Property of the row, or a unique id when using `cell`. */
		key: string;
		header: string;
		align?: 'start' | 'center' | 'end';
		/** Tabular numerals, right-aligned by default. */
		numeric?: boolean;
		sortable?: boolean;
		/** CSS width, e.g. `'8rem'` or `'20%'`. */
		width?: string;
		/** Custom cell renderer. Defaults to `String(row[key])`. */
		cell?: Snippet<[T]>;
		/** Custom sort accessor; defaults to `row[key]`. */
		sortValue?: (row: T) => string | number | null | undefined;
	}
</script>

<script lang="ts" generics="T">
	import { ArrowUp, ArrowDown, ArrowUpDown } from '@lucide/svelte';

	interface Props {
		columns: TableColumn<T>[];
		rows: T[];
		/** Stable key per row; defaults to the row index. */
		rowKey?: (row: T, index: number) => string | number;
		/** Bindable sort state. Sorting is applied client-side unless `onSort` is provided. */
		sort?: SortState;
		/** Take over sorting (server-side); the table then renders `rows` as given. */
		onSort?: (sort: SortState) => void;
		onRowClick?: (row: T) => void;
		/** Screen-reader summary of the table. */
		caption?: string;
		stickyHeader?: boolean;
		striped?: boolean;
		/** Shown when `rows` is empty. */
		emptyText?: string;
		/** Rendered instead of `emptyText`, e.g. an EmptyState. */
		empty?: Snippet;
		class?: string;
	}

	let {
		columns,
		rows,
		rowKey = (_row, i) => i,
		sort = $bindable(),
		onSort,
		onRowClick,
		caption,
		stickyHeader = false,
		striped = false,
		emptyText = 'No data',
		empty,
		class: className
	}: Props = $props();

	function valueOf(row: T, col: TableColumn<T>) {
		if (col.sortValue) return col.sortValue(row);
		return (row as Record<string, unknown>)[col.key] as string | number | null | undefined;
	}

	const sorted = $derived.by(() => {
		if (!sort || onSort) return rows;
		const col = columns.find((c) => c.key === sort!.key);
		if (!col) return rows;
		const dir = sort.direction === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => {
			const va = valueOf(a, col);
			const vb = valueOf(b, col);
			if (va == null && vb == null) return 0;
			if (va == null) return 1;
			if (vb == null) return -1;
			if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
			return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
		});
	});

	function toggleSort(col: TableColumn<T>) {
		if (!col.sortable) return;
		const next: SortState =
			sort?.key === col.key
				? { key: col.key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
				: { key: col.key, direction: 'asc' };
		sort = next;
		onSort?.(next);
	}

	function ariaSort(col: TableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
		if (!col.sortable) return undefined;
		if (sort?.key !== col.key) return 'none';
		return sort.direction === 'asc' ? 'ascending' : 'descending';
	}

	/** Row activation ignores clicks/keys on interactive content inside a cell. */
	function fromControl(e: Event) {
		const t = e.target as HTMLElement | null;
		return t !== e.currentTarget && !!t?.closest('a,button,input,select,textarea,[role="button"]');
	}

	function display(row: T, col: TableColumn<T>): string {
		const v = (row as Record<string, unknown>)[col.key];
		return v == null ? '' : String(v);
	}
</script>

<div class={['db-table-wrap', className]} data-sticky={stickyHeader || undefined}>
	<table
		class="db-table"
		data-striped={striped || undefined}
		data-clickable={onRowClick ? true : undefined}
	>
		{#if caption}<caption class="sr-only">{caption}</caption>{/if}
		<thead class="db-table__head">
			<tr>
				{#each columns as col (col.key)}
					<th
						scope="col"
						class="db-table__th"
						data-align={col.align ?? (col.numeric ? 'end' : 'start')}
						aria-sort={ariaSort(col)}
						style:width={col.width}
					>
						{#if col.sortable}
							<button type="button" class="db-table__sort" onclick={() => toggleSort(col)}>
								<span>{col.header}</span>
								<span class="db-table__sort-icon" aria-hidden="true">
									{#if sort?.key === col.key}
										{#if sort.direction === 'asc'}<ArrowUp />{:else}<ArrowDown />{/if}
									{:else}
										<ArrowUpDown />
									{/if}
								</span>
							</button>
						{:else}
							{col.header}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sorted as row, i (rowKey(row, i))}
				<tr
					class="db-table__row"
					tabindex={onRowClick ? 0 : undefined}
					onclick={onRowClick
						? (e) => {
								if (!fromControl(e)) onRowClick(row);
							}
						: undefined}
					onkeydown={onRowClick
						? (e) => {
								if (fromControl(e)) return;
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onRowClick(row);
								}
							}
						: undefined}
				>
					{#each columns as col (col.key)}
						<td
							class="db-table__td"
							data-align={col.align ?? (col.numeric ? 'end' : 'start')}
							data-numeric={col.numeric || undefined}
						>
							{#if col.cell}{@render col.cell(row)}{:else}{display(row, col)}{/if}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td class="db-table__empty" colspan={columns.length}>
						{#if empty}{@render empty()}{:else}{emptyText}{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.db-table-wrap {
		width: 100%;
		overflow: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}
	.db-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		color: var(--color-text);
	}
	.db-table__head {
		background: var(--color-bg-subtle);
	}
	.db-table-wrap[data-sticky] .db-table__head {
		position: sticky;
		top: 0;
		z-index: var(--z-raised);
	}
	.db-table__th {
		padding: var(--space-2) var(--space-3);
		height: var(--control-h-md);
		text-align: start;
		font-weight: var(--weight-medium);
		color: var(--color-text-muted);
		white-space: nowrap;
		border-bottom: 1px solid var(--color-border);
	}
	.db-table__th[data-align='end'],
	.db-table__td[data-align='end'] {
		text-align: end;
	}
	.db-table__th[data-align='center'],
	.db-table__td[data-align='center'] {
		text-align: center;
	}
	.db-table__sort {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		margin: calc(var(--space-1) * -1) calc(var(--space-2) * -1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		color: inherit;
		font: inherit;
		transition: var(--transition-colors);
	}
	.db-table__th[data-align='end'] .db-table__sort {
		flex-direction: row-reverse;
	}
	.db-table__sort:hover {
		color: var(--color-text);
		background: var(--color-component);
	}
	.db-table__sort:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.db-table__sort-icon {
		display: inline-flex;
		width: 0.9em;
		height: 0.9em;
		opacity: 0.5;
	}
	.db-table__th[aria-sort='ascending'] .db-table__sort-icon,
	.db-table__th[aria-sort='descending'] .db-table__sort-icon {
		opacity: 1;
		color: var(--color-accent-text);
	}
	.db-table__sort-icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-table__td {
		padding: var(--space-2) var(--space-3);
		height: var(--row-h);
		border-bottom: 1px solid var(--color-border);
		vertical-align: middle;
	}
	.db-table__td[data-numeric] {
		font-variant-numeric: var(--font-numeric);
	}
	.db-table__row:last-child .db-table__td {
		border-bottom: none;
	}
	.db-table[data-striped] .db-table__row:nth-child(even) .db-table__td {
		/* Half-strength component fill: visible in dark schemes where bg-subtle ≈ surface. */
		background: color-mix(in srgb, var(--color-component) 55%, transparent);
	}
	.db-table[data-clickable] .db-table__row {
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.db-table[data-clickable] .db-table__row:hover .db-table__td {
		background: var(--color-component);
	}
	.db-table[data-clickable] .db-table__row:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring-inset);
	}
	.db-table__empty {
		padding: var(--space-8) var(--space-4);
		text-align: center;
		color: var(--color-text-muted);
	}
</style>
