<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface StatProps extends HTMLAttributes<HTMLElement> {
		/** What the number is. */
		label: string;
		/** The formatted value. */
		value: string;
		/** Small text under the value (period, comparison). */
		hint?: string;
		/** Signed change shown as a Delta next to the value. */
		delta?: number;
		deltaFormat?: 'number' | 'percent' | 'currency';
		/** Positive delta is bad (costs, latency). */
		deltaInvert?: boolean;
		/** Icon in the corner. */
		icon?: Snippet;
		/** Anything extra under the value: a sparkline, a progress bar. */
		children?: Snippet;
		/** Skeleton state while loading. */
		loading?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Card surface, or flush (for grids that draw their own borders). */
		variant?: 'card' | 'flush';
		class?: string;
	}
</script>

<script lang="ts">
	import Delta from '../delta/Delta.svelte';
	import Skeleton from '../skeleton/Skeleton.svelte';

	let {
		label,
		value,
		hint,
		delta,
		deltaFormat = 'percent',
		deltaInvert = false,
		icon,
		children,
		loading = false,
		size = 'md',
		variant = 'card',
		class: className,
		...rest
	}: StatProps = $props();
</script>

<article
	{...rest}
	class={['db-stat', className]}
	data-size={size}
	data-variant={variant}
	aria-busy={loading || undefined}
>
	<div class="db-stat__head">
		<span class="db-stat__label">{label}</span>
		{#if icon}<span class="db-stat__icon" aria-hidden="true">{@render icon()}</span>{/if}
	</div>
	{#if loading}
		<Skeleton variant="rect" width="60%" height="1.6em" class="db-stat__skeleton" />
		{#if hint}<Skeleton variant="text" width="40%" />{/if}
	{:else}
		<div class="db-stat__row">
			<span class="db-stat__value">{value}</span>
			{#if delta !== undefined}
				<Delta value={delta} format={deltaFormat} invert={deltaInvert} variant="pill" size="sm" />
			{/if}
		</div>
		{#if hint}<span class="db-stat__hint">{hint}</span>{/if}
		{#if children}<div class="db-stat__extra">{@render children()}</div>{/if}
	{/if}
</article>

<style>
	.db-stat {
		--_value: var(--text-2xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
		padding: var(--space-4) var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		color: var(--color-text);
		font-family: var(--font-body);
	}
	.db-stat[data-variant='flush'] {
		padding: 0;
		background: none;
		border: none;
		border-radius: 0;
	}
	.db-stat[data-size='sm'] {
		--_value: var(--text-xl);
		padding: var(--space-3) var(--space-4);
	}
	.db-stat[data-size='lg'] {
		--_value: var(--text-4xl);
		padding: var(--space-5) var(--space-6);
	}
	.db-stat__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}
	.db-stat__label {
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.db-stat__icon {
		display: inline-flex;
		flex: none;
		width: 1.1rem;
		height: 1.1rem;
		color: var(--color-text-subtle);
	}
	.db-stat__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-stat__row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.db-stat__value {
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		font-size: var(--_value);
		font-variant-numeric: var(--font-numeric);
		line-height: 1.1;
	}
	.db-stat__hint {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
	.db-stat__extra {
		margin-block-start: var(--space-2);
	}
	.db-stat :global(.db-stat__skeleton) {
		margin-block: var(--space-1);
	}
</style>
