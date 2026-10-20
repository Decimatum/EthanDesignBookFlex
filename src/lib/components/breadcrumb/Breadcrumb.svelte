<script lang="ts" module>
	export interface BreadcrumbItem {
		label: string;
		/** Omit on the current page (last item). */
		href?: string;
	}

	export interface BreadcrumbProps {
		items: BreadcrumbItem[];
		/** Collapse the middle into an ellipsis when there are more items than this. */
		maxItems?: number;
		/** Accessible name for the nav landmark. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';

	let { items, maxItems = 4, label = 'Breadcrumb', class: className }: BreadcrumbProps = $props();

	let expanded = $state(false);
	type Entry = BreadcrumbItem | { ellipsis: true };
	const visible = $derived.by((): Entry[] => {
		const cap = Math.max(3, maxItems); // first, ellipsis, last at minimum
		if (expanded || items.length <= cap) return items;
		return [items[0], { ellipsis: true }, ...items.slice(-(cap - 2))];
	});
</script>

<nav class={['db-breadcrumb', className]} aria-label={label}>
	<ol class="db-breadcrumb__list">
		{#each visible as item, i (i)}
			{@const last = i === visible.length - 1}
			<li class="db-breadcrumb__item">
				{#if 'ellipsis' in item}
					<button
						type="button"
						class="db-breadcrumb__ellipsis"
						aria-label="Show all breadcrumbs"
						onclick={() => (expanded = true)}
					>
						…
					</button>
				{:else if item.href && !last}
					<a class="db-breadcrumb__link" href={item.href}>{item.label}</a>
				{:else}
					<span class="db-breadcrumb__current" aria-current={last ? 'page' : undefined}
						>{item.label}</span
					>
				{/if}
				{#if !last}<ChevronRight class="db-breadcrumb__sep" aria-hidden="true" />{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.db-breadcrumb__list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-body);
		font-size: var(--text-sm);
	}
	.db-breadcrumb__item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		min-width: 0;
	}
	.db-breadcrumb__link,
	.db-breadcrumb__ellipsis {
		padding: var(--space-0-5) var(--space-1);
		margin: 0 calc(var(--space-1) * -1);
		border-radius: var(--radius-xs);
		color: var(--color-text-muted);
		text-decoration: none;
		font: inherit;
		transition: var(--transition-colors);
	}
	.db-breadcrumb__link:hover,
	.db-breadcrumb__ellipsis:hover {
		color: var(--color-text);
		background: var(--color-component);
	}
	.db-breadcrumb__link:focus-visible,
	.db-breadcrumb__ellipsis:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.db-breadcrumb__current {
		color: var(--color-text);
		font-weight: var(--weight-medium);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.db-breadcrumb :global(.db-breadcrumb__sep) {
		width: 1em;
		height: 1em;
		flex: none;
		color: var(--color-text-subtle);
	}
</style>
