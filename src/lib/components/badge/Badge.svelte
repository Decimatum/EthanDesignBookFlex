<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Tone } from '../../types.js';

	export type BadgeVariant = 'soft' | 'solid' | 'outline';

	export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
		variant?: BadgeVariant;
		tone?: Tone;
		size?: 'sm' | 'md';
		/** Leading status dot. */
		dot?: boolean;
		/** Fully rounded pill shape. */
		pill?: boolean;
		/** Icon before the label. */
		leading?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		variant = 'soft',
		tone = 'neutral',
		size = 'md',
		dot = false,
		pill = false,
		leading,
		children,
		class: className,
		...rest
	}: BadgeProps = $props();
</script>

<span
	{...rest}
	class={['db-badge', className]}
	data-variant={variant}
	data-tone={tone}
	data-size={size}
	data-pill={pill || undefined}
>
	{#if dot}<span class="db-badge__dot" aria-hidden="true"></span>{/if}
	{#if leading}<span class="db-badge__icon" aria-hidden="true">{@render leading()}</span>{/if}
	{#if children}{@render children()}{/if}
</span>

<style>
	.db-badge {
		--_bg: transparent;
		--_fg: var(--color-text);
		--_border: transparent;
		--_dot: currentColor;

		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0 var(--space-2);
		height: 1.5rem;
		border: 1px solid var(--_border);
		border-radius: var(--radius-sm);
		background: var(--_bg);
		color: var(--_fg);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		line-height: 1;
		letter-spacing: 0.01em;
		white-space: nowrap;
		vertical-align: middle;
	}
	.db-badge[data-size='sm'] {
		height: 1.25rem;
		padding-inline: var(--space-1-5);
		font-size: 0.6875rem;
	}
	.db-badge[data-pill] {
		border-radius: var(--radius-full);
	}

	/* tones */
	.db-badge[data-tone='neutral'] {
		--_solid: var(--color-neutral);
		--_solid-fg: var(--color-neutral-fg);
		--_subtle: var(--color-component);
		--_text: var(--color-text-muted);
		--_outline: var(--color-border-strong);
	}
	.db-badge[data-tone='accent'] {
		--_solid: var(--color-accent);
		--_solid-fg: var(--color-accent-fg);
		--_subtle: var(--color-accent-subtle);
		--_text: var(--color-accent-text);
		--_outline: var(--color-accent-border);
	}
	.db-badge[data-tone='success'] {
		--_solid: var(--color-success);
		--_solid-fg: var(--color-success-fg);
		--_subtle: var(--color-success-subtle);
		--_text: var(--color-success-text);
		--_outline: var(--color-success-border);
	}
	.db-badge[data-tone='warning'] {
		--_solid: var(--color-warning);
		--_solid-fg: var(--color-warning-fg);
		--_subtle: var(--color-warning-subtle);
		--_text: var(--color-warning-text);
		--_outline: var(--color-warning-border);
	}
	.db-badge[data-tone='danger'] {
		--_solid: var(--color-danger);
		--_solid-fg: var(--color-danger-fg);
		--_subtle: var(--color-danger-subtle);
		--_text: var(--color-danger-text);
		--_outline: var(--color-danger-border);
	}
	.db-badge[data-tone='info'] {
		--_solid: var(--color-info);
		--_solid-fg: var(--color-info-fg);
		--_subtle: var(--color-info-subtle);
		--_text: var(--color-info-text);
		--_outline: var(--color-info-border);
	}

	/* variants */
	.db-badge[data-variant='soft'] {
		--_bg: var(--_subtle);
		--_fg: var(--_text);
	}
	.db-badge[data-variant='solid'] {
		--_bg: var(--_solid);
		--_fg: var(--_solid-fg);
	}
	.db-badge[data-variant='outline'] {
		--_fg: var(--_text);
		--_border: var(--_outline);
	}
	.db-badge[data-variant='outline'] .db-badge__dot,
	.db-badge[data-variant='soft'] .db-badge__dot {
		--_dot: var(--_solid);
	}

	.db-badge__dot {
		width: 0.5em;
		height: 0.5em;
		border-radius: var(--radius-full);
		background: var(--_dot);
		flex: none;
	}
	.db-badge__icon {
		display: inline-flex;
		width: 1em;
		height: 1em;
	}
	.db-badge__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
