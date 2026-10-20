<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		title: string;
		description?: string;
		/** Large icon or illustration above the title. */
		icon?: Snippet;
		/** Primary and secondary actions. */
		actions?: Snippet;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}
</script>

<script lang="ts">
	let {
		title,
		description,
		icon,
		actions,
		size = 'md',
		class: className,
		...rest
	}: EmptyStateProps = $props();
</script>

<div {...rest} class={['db-empty-state', className]} data-size={size}>
	{#if icon}<div class="db-empty-state__icon" aria-hidden="true">{@render icon()}</div>{/if}
	<p class="db-empty-state__title">{title}</p>
	{#if description}<p class="db-empty-state__description">{description}</p>{/if}
	{#if actions}<div class="db-empty-state__actions">{@render actions()}</div>{/if}
</div>

<style>
	.db-empty-state {
		--_py: var(--space-12);
		--_icon: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		padding: var(--_py) var(--space-6);
		text-align: center;
		font-family: var(--font-body);
	}
	.db-empty-state[data-size='sm'] {
		--_py: var(--space-6);
		--_icon: 2rem;
	}
	.db-empty-state[data-size='lg'] {
		--_py: var(--space-20);
		--_icon: 3.5rem;
	}
	.db-empty-state__icon {
		display: inline-flex;
		width: var(--_icon);
		height: var(--_icon);
		margin-bottom: var(--space-2);
		color: var(--color-text-subtle);
	}
	.db-empty-state__icon :global(svg) {
		width: 100%;
		height: 100%;
		stroke-width: 1.5;
	}
	.db-empty-state__title {
		margin: 0;
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		font-size: var(--text-lg);
		color: var(--color-text);
		text-wrap: balance;
	}
	.db-empty-state__description {
		margin: 0;
		max-width: 36ch;
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
		color: var(--color-text-muted);
		text-wrap: pretty;
	}
	.db-empty-state__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}
</style>
