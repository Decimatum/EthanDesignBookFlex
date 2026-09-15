<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type CardVariant = 'outlined' | 'elevated' | 'filled';

	export interface CardProps extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'section' | 'article' | 'li' | 'a';
		variant?: CardVariant;
		/** Inner padding. `none` for edge-to-edge content (tables, images). */
		padding?: 'none' | 'sm' | 'md' | 'lg';
		/** Hover/focus affordance for clickable cards (pair with `as="a"` + `href`). */
		interactive?: boolean;
		href?: string;
		/** Optional header row, separated by a rule. */
		header?: Snippet;
		/** Optional footer row, separated by a rule. */
		footer?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		as = 'div',
		variant = 'outlined',
		padding = 'md',
		interactive = false,
		href,
		header,
		footer,
		children,
		class: className,
		...rest
	}: CardProps = $props();

	const tag = $derived(href ? 'a' : as);
</script>

<svelte:element
	this={tag}
	{...rest}
	{href}
	class={['db-card', className]}
	data-variant={variant}
	data-padding={padding}
	data-interactive={interactive || href ? true : undefined}
>
	{#if header}<div class="db-card__header">{@render header()}</div>{/if}
	{#if children}<div class="db-card__body">{@render children()}</div>{/if}
	{#if footer}<div class="db-card__footer">{@render footer()}</div>{/if}
</svelte:element>

<style>
	.db-card {
		--_pad: var(--space-5);
		display: flex;
		flex-direction: column;
		min-width: 0;
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		color: var(--color-text);
		text-decoration: none;
		transition: var(--transition-colors), var(--transition-transform);
	}
	.db-card[data-variant='outlined'] {
		border: 1px solid var(--color-border);
	}
	.db-card[data-variant='elevated'] {
		border: 1px solid transparent;
		box-shadow: var(--shadow-md);
	}
	.db-card[data-variant='filled'] {
		border: 1px solid transparent;
		background: var(--color-bg-subtle);
	}
	.db-card[data-padding='none'] {
		--_pad: 0;
	}
	.db-card[data-padding='sm'] {
		--_pad: var(--space-3);
	}
	.db-card[data-padding='lg'] {
		--_pad: var(--space-8);
	}
	.db-card__body {
		padding: var(--_pad);
		flex: 1;
		min-width: 0;
	}
	.db-card__header,
	.db-card__footer {
		padding: var(--space-3) var(--_pad);
	}
	.db-card[data-padding='none'] .db-card__header,
	.db-card[data-padding='none'] .db-card__footer {
		padding: var(--space-3) var(--space-4);
	}
	.db-card__header {
		border-bottom: 1px solid var(--color-border);
	}
	.db-card__footer {
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-subtle);
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
	}
	.db-card[data-interactive] {
		cursor: pointer;
	}
	.db-card[data-interactive]:hover {
		border-color: var(--color-border-hover);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}
	.db-card[data-interactive]:active {
		transform: none;
	}
	.db-card[data-interactive]:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
</style>
