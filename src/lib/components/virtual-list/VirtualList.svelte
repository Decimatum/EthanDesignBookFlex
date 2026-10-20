<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type VirtualListAlign = 'start' | 'center' | 'end' | 'nearest';

	export interface VirtualListRange {
		/** First rendered index (includes overscan). */
		start: number;
		/** Last rendered index, inclusive (includes overscan). */
		end: number;
	}

	export interface VirtualListProps<T> {
		items: T[];
		/** Renders one row. Rows are positioned by the list; give the content its own padding. */
		row: Snippet<[T, number]>;
		/** Row height in px. With `measure`, the estimate used until a row has been rendered. */
		itemHeight?: number;
		/** Measure rendered rows with a ResizeObserver so heights may vary. */
		measure?: boolean;
		/** Height of the scrolling viewport (any CSS length). */
		height?: string;
		/** Extra rows rendered above and below the viewport. */
		overscan?: number;
		/** Stable key per item; defaults to the index. Give one when items are inserted or removed. */
		itemKey?: (item: T, index: number) => string | number;
		/** Accessible name of the scrolling region. */
		label?: string;
		/** Divider between rows. */
		divided?: boolean;
		/** Shown when `items` is empty. */
		emptyText?: string;
		/** Rendered instead of `emptyText`, e.g. an EmptyState. */
		empty?: Snippet;
		/** Called when the rendered window changes. */
		onRangeChange?: (range: VirtualListRange) => void;
		/** Called once each time the last `endThreshold` rows come into view — for loading more. */
		onEndReached?: () => void;
		endThreshold?: number;
		class?: string;
	}
</script>

<script lang="ts" generics="T">
	let {
		items,
		row,
		itemHeight = 40,
		measure = false,
		height = '20rem',
		overscan = 4,
		itemKey = (_item, i) => i,
		label = 'List',
		divided = false,
		emptyText = 'No items',
		empty,
		onRangeChange,
		onEndReached,
		endThreshold = 5,
		class: className
	}: VirtualListProps<T> = $props();

	let viewport: HTMLDivElement | undefined = $state();
	let scrollTop = $state(0);
	let viewportHeight = $state(0);
	// Measured heights by index (only in `measure` mode); missing entries fall back to itemHeight.
	let measured = $state<Record<number, number>>({});

	// Prefix sums of row offsets. offsets[i] is the top of row i; offsets[n] is the total height.
	const offsets = $derived.by(() => {
		const n = items.length;
		const out = new Array<number>(n + 1);
		out[0] = 0;
		if (!measure) {
			for (let i = 0; i < n; i++) out[i + 1] = out[i] + itemHeight;
		} else {
			for (let i = 0; i < n; i++) out[i + 1] = out[i] + (measured[i] ?? itemHeight);
		}
		return out;
	});
	const total = $derived(offsets[items.length] ?? 0);

	/** Index of the row containing `y` (last row whose top is ≤ y). */
	function indexAt(y: number) {
		let lo = 0;
		let hi = items.length - 1;
		while (lo < hi) {
			const mid = (lo + hi + 1) >> 1;
			if (offsets[mid] <= y) lo = mid;
			else hi = mid - 1;
		}
		return lo;
	}

	const range = $derived.by((): VirtualListRange => {
		const n = items.length;
		if (n === 0) return { start: 0, end: -1 };
		// Before layout (SSR, first paint) the viewport height is unknown: render a screenful.
		const vh = viewportHeight || itemHeight * 12;
		const first = indexAt(scrollTop);
		const last = indexAt(scrollTop + vh);
		return { start: Math.max(0, first - overscan), end: Math.min(n - 1, last + overscan) };
	});

	const visible = $derived.by(() => {
		const out: Array<{ item: T; index: number; key: string | number; top: number }> = [];
		for (let i = range.start; i <= range.end; i++) {
			out.push({ item: items[i], index: i, key: itemKey(items[i], i), top: offsets[i] });
		}
		return out;
	});

	// Notify range changes and end-reached once per crossing.
	let endFired = false;
	$effect(() => {
		const r = range;
		onRangeChange?.(r);
		const nearEnd = items.length > 0 && r.end >= items.length - 1 - endThreshold;
		if (nearEnd && !endFired) {
			endFired = true;
			onEndReached?.();
		} else if (!nearEnd) {
			endFired = false;
		}
	});
	// New items arriving re-arm the end trigger.
	$effect(() => {
		void items.length;
		endFired = false;
	});

	// Track the viewport size so the window follows the layout, not a guess.
	$effect(() => {
		if (!viewport) return;
		const el = viewport;
		viewportHeight = el.clientHeight;
		const ro = new ResizeObserver(() => (viewportHeight = el.clientHeight));
		ro.observe(el);
		return () => ro.disconnect();
	});

	// Measured mode: one observer for every rendered row, keyed by index.
	let rowObserver: ResizeObserver | undefined;
	function measureRow(node: HTMLElement, index: number) {
		if (!measure) return;
		node.dataset.index = String(index);
		rowObserver ??= new ResizeObserver((entries) => {
			let changed = false;
			const next = { ...measured };
			for (const entry of entries) {
				const i = Number((entry.target as HTMLElement).dataset.index);
				const h = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
				if (h > 0 && next[i] !== h) {
					next[i] = h;
					changed = true;
				}
			}
			if (changed) measured = next;
		});
		rowObserver.observe(node);
		return {
			update(i: number) {
				node.dataset.index = String(i);
			},
			destroy() {
				rowObserver?.unobserve(node);
			}
		};
	}
	$effect(() => () => rowObserver?.disconnect());

	function onscroll() {
		if (viewport) scrollTop = viewport.scrollTop;
	}

	/** Scroll so that row `index` is visible. `nearest` (default) scrolls the least distance. */
	export function scrollToIndex(index: number, align: VirtualListAlign = 'nearest') {
		if (!viewport || items.length === 0) return;
		const i = Math.max(0, Math.min(items.length - 1, index));
		const top = offsets[i];
		const size = offsets[i + 1] - top;
		const vh = viewport.clientHeight;
		let target: number;
		switch (align) {
			case 'start':
				target = top;
				break;
			case 'center':
				target = top - (vh - size) / 2;
				break;
			case 'end':
				target = top + size - vh;
				break;
			default:
				if (top < viewport.scrollTop) target = top;
				else if (top + size > viewport.scrollTop + vh) target = top + size - vh;
				else return;
		}
		viewport.scrollTop = Math.max(0, Math.min(total - vh, target));
		scrollTop = viewport.scrollTop;
	}

	/** The rows currently rendered (for tests and for callers that sync a selection). */
	export function getRange(): VirtualListRange {
		return range;
	}
</script>

<!-- A scrollable region must be keyboard-focusable (axe: scrollable-region-focusable). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={viewport}
	class={['db-virtual-list', className]}
	style:height
	role="region"
	aria-label={label}
	tabindex="0"
	data-divided={divided || undefined}
	data-measure={measure || undefined}
	{onscroll}
>
	{#if items.length === 0}
		<div class="db-virtual-list__empty">
			{#if empty}{@render empty()}{:else}{emptyText}{/if}
		</div>
	{:else}
		<ul class="db-virtual-list__track" role="list" style:height="{total}px">
			{#each visible as v (v.key)}
				<li
					class="db-virtual-list__row"
					role="listitem"
					aria-setsize={items.length}
					aria-posinset={v.index + 1}
					style:transform="translateY({v.top}px)"
					style:height={measure ? undefined : `${itemHeight}px`}
					use:measureRow={v.index}
				>
					{@render row(v.item, v.index)}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.db-virtual-list {
		position: relative;
		overflow-y: auto;
		overflow-anchor: none;
		-webkit-overflow-scrolling: touch;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
		contain: content;
	}
	.db-virtual-list:focus-visible {
		box-shadow: var(--focus-ring-inset);
		outline: none;
	}
	.db-virtual-list__track {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
		width: 100%;
	}
	.db-virtual-list__row {
		position: absolute;
		inset-inline: 0;
		top: 0;
		box-sizing: border-box;
		will-change: transform;
	}
	.db-virtual-list[data-divided] .db-virtual-list__row {
		border-bottom: 1px solid var(--color-border);
	}
	.db-virtual-list__empty {
		display: grid;
		place-items: center;
		height: 100%;
		padding: var(--space-6);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
</style>
