<script lang="ts" module>
	export interface PaginationProps {
		/** Bindable current page, 1-based. */
		page?: number;
		/** Total number of pages. Alternatively pass `count` + `perPage`. */
		pages?: number;
		count?: number;
		perPage?: number;
		/** Pages shown either side of the current one. */
		siblings?: number;
		size?: 'sm' | 'md';
		onPageChange?: (page: number) => void;
		/** Accessible name for the nav landmark. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	let {
		page = $bindable(1),
		pages,
		count,
		perPage = 10,
		siblings = 1,
		size = 'md',
		onPageChange,
		label = 'Pagination',
		class: className
	}: PaginationProps = $props();

	const total = $derived(
		Math.max(1, (pages ?? Math.ceil((count ?? 0) / Math.max(1, perPage))) || 1)
	);

	// Pages to render, with `null` for ellipses. The number of slots stays constant
	// (2 × siblings + 5) so the control never jumps in width as the page changes:
	// 1 2 3 4 5 … 20   ·   1 … 9 10 11 … 20   ·   1 … 16 17 18 19 20
	const items = $derived.by((): Array<number | null> => {
		const slots = siblings * 2 + 5;
		if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
		const current = Math.min(Math.max(1, page), total);
		const left = Math.max(current - siblings, 1);
		const right = Math.min(current + siblings, total);
		const leftDots = left > 3;
		const rightDots = right < total - 2;
		if (!leftDots && rightDots) {
			const count = slots - 2;
			return [...Array.from({ length: count }, (_, i) => i + 1), null, total];
		}
		if (leftDots && !rightDots) {
			const count = slots - 2;
			return [1, null, ...Array.from({ length: count }, (_, i) => total - count + 1 + i)];
		}
		return [1, null, ...Array.from({ length: right - left + 1 }, (_, i) => left + i), null, total];
	});
	function go(p: number) {
		const next = Math.min(Math.max(1, p), total);
		if (next === page) return;
		page = next;
		onPageChange?.(next);
	}
</script>

<nav class={['db-pagination', className]} aria-label={label} data-size={size}>
	<button
		type="button"
		class="db-pagination__btn"
		aria-label="Previous page"
		disabled={page <= 1}
		onclick={() => go(page - 1)}
	>
		<ChevronLeft aria-hidden="true" />
	</button>
	{#each items as item, i (i)}
		{#if item === null}
			<span class="db-pagination__ellipsis" aria-hidden="true">…</span>
		{:else}
			<button
				type="button"
				class="db-pagination__btn db-pagination__page"
				aria-label="Page {item}"
				aria-current={item === page ? 'page' : undefined}
				onclick={() => go(item)}
			>
				{item}
			</button>
		{/if}
	{/each}
	<button
		type="button"
		class="db-pagination__btn"
		aria-label="Next page"
		disabled={page >= total}
		onclick={() => go(page + 1)}
	>
		<ChevronRight aria-hidden="true" />
	</button>
</nav>

<style>
	.db-pagination {
		--_h: var(--control-h-md);
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-family: var(--font-body);
		font-size: var(--text-sm);
	}
	.db-pagination[data-size='sm'] {
		--_h: var(--control-h-sm);
		font-size: var(--text-xs);
	}
	.db-pagination__btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--_h);
		height: var(--_h);
		padding-inline: var(--space-2);
		border-radius: var(--control-radius);
		color: var(--color-text-muted);
		font-weight: var(--weight-medium);
		font-variant-numeric: var(--font-numeric);
		transition: var(--transition-colors);
	}
	.db-pagination__btn:hover:not(:disabled) {
		background: var(--color-component);
		color: var(--color-text);
	}
	.db-pagination__btn:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.db-pagination__btn:disabled {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-pagination__page[aria-current='page'] {
		background: var(--color-accent);
		color: var(--color-accent-fg);
	}
	.db-pagination__btn :global(svg) {
		width: 1.1em;
		height: 1.1em;
	}
	.db-pagination__ellipsis {
		min-width: var(--_h);
		text-align: center;
		color: var(--color-text-subtle);
	}
</style>
