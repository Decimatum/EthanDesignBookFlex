<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DescriptionItem {
		term: string;
		/** Plain text, or a snippet for anything richer (a Badge, a link, a number with a unit). */
		description: string | Snippet;
		/** Muted text under the description. */
		note?: string;
	}

	export type DescriptionListLayout = 'stacked' | 'inline' | 'columns';

	export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
		items: DescriptionItem[];
		/**
		 * `stacked`: term above description, one per row (the mobile default).
		 * `inline`: term and description side by side on one row, a hairline between rows.
		 * `columns`: stacked pairs flowing into `columns` columns — a facts grid.
		 */
		layout?: DescriptionListLayout;
		/** Column count for `layout="columns"`. */
		columns?: 2 | 3 | 4;
		/** Width of the term column for `inline`. */
		termWidth?: string;
		size?: 'sm' | 'md';
		class?: string;
	}
</script>

<script lang="ts">
	let {
		items,
		layout = 'stacked',
		columns = 2,
		termWidth = '10rem',
		size = 'md',
		class: className,
		...rest
	}: DescriptionListProps = $props();
</script>

<dl
	{...rest}
	class={['db-description-list', className]}
	data-layout={layout}
	data-size={size}
	style:--_cols={columns}
	style:--_term-w={termWidth}
>
	{#each items as item (item.term)}
		<div class="db-description-list__item">
			<dt class="db-description-list__term">{item.term}</dt>
			<dd class="db-description-list__desc">
				{#if typeof item.description === 'string'}{item.description}{:else}{@render item.description()}{/if}
				{#if item.note}<span class="db-description-list__note">{item.note}</span>{/if}
			</dd>
		</div>
	{/each}
</dl>

<style>
	.db-description-list {
		margin: 0;
		display: grid;
		gap: var(--space-3);
		font-size: var(--text-md);
	}
	.db-description-list[data-size='sm'] {
		font-size: var(--text-sm);
	}
	.db-description-list__item {
		display: grid;
		gap: var(--space-1);
		min-width: 0;
	}
	.db-description-list__term {
		color: var(--color-text-muted);
		font-size: 0.875em;
	}
	.db-description-list__desc {
		margin: 0;
		color: var(--color-text);
		overflow-wrap: anywhere;
	}
	.db-description-list__note {
		display: block;
		color: var(--color-text-muted);
		font-size: 0.875em;
	}

	/* inline: term | description, hairline rows */
	.db-description-list[data-layout='inline'] {
		gap: 0;
	}
	.db-description-list[data-layout='inline'] .db-description-list__item {
		grid-template-columns: minmax(0, var(--_term-w)) minmax(0, 1fr);
		gap: var(--space-4);
		padding-block: var(--space-2);
		border-bottom: 1px solid var(--color-border);
		align-items: baseline;
	}
	.db-description-list[data-layout='inline'] .db-description-list__item:last-child {
		border-bottom: 0;
	}
	.db-description-list[data-layout='inline'] .db-description-list__term {
		font-size: 1em;
	}

	/* columns: a facts grid */
	.db-description-list[data-layout='columns'] {
		grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
		gap: var(--space-4) var(--space-6);
	}
	@container (max-width: 40rem) {
		.db-description-list[data-layout='columns'] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 40rem) {
		.db-description-list[data-layout='columns'] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.db-description-list[data-layout='inline'] .db-description-list__item {
			grid-template-columns: 1fr;
			gap: var(--space-1);
		}
		.db-description-list[data-layout='inline'] .db-description-list__term {
			font-size: 0.875em;
		}
	}
</style>
