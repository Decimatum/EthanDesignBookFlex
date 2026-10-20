<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface LinkProps extends HTMLAnchorAttributes {
		href: string;
		/** `accent` is the default coloured link; `inherit` keeps the surrounding text colour. */
		tone?: 'accent' | 'inherit' | 'muted';
		/** Underline only on hover. */
		subtle?: boolean;
		/** Opens in a new tab with `rel="noopener noreferrer"` and an external icon. */
		external?: boolean;
		/** Icon after the label (replaces the external icon). */
		trailing?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';

	let {
		href,
		tone = 'accent',
		subtle = false,
		external = false,
		trailing,
		target,
		rel,
		children,
		class: className,
		...rest
	}: LinkProps = $props();
</script>

<a
	{...rest}
	{href}
	class={['db-link', className]}
	data-tone={tone}
	data-subtle={subtle || undefined}
	target={target ?? (external ? '_blank' : undefined)}
	rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
>
	{#if children}{@render children()}{/if}
	{#if trailing}
		<span class="db-link__icon" aria-hidden="true">{@render trailing()}</span>
	{:else if external}
		<span class="db-link__icon" aria-hidden="true"><ArrowUpRight /></span>
		<span class="sr-only">(opens in a new tab)</span>
	{/if}
</a>

<style>
	.db-link {
		--_fg: var(--color-accent-text);
		--_fg-hover: var(--color-accent-hover);
		display: inline;
		color: var(--_fg);
		font: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
		border-radius: var(--radius-xs);
		transition:
			var(--transition-colors),
			text-decoration-color var(--duration-fast) var(--ease-standard);
	}
	.db-link:hover {
		color: var(--_fg-hover);
		text-decoration-color: currentColor;
	}
	.db-link:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-link[data-tone='inherit'] {
		--_fg: inherit;
		--_fg-hover: var(--color-accent-text);
	}
	.db-link[data-tone='muted'] {
		--_fg: var(--color-text-muted);
		--_fg-hover: var(--color-text);
	}
	.db-link[data-subtle] {
		text-decoration-color: transparent;
	}
	.db-link[data-subtle]:hover {
		text-decoration-color: currentColor;
	}
	.db-link__icon {
		display: inline-flex;
		width: 0.9em;
		height: 0.9em;
		margin-inline-start: 0.1em;
		vertical-align: -0.05em;
	}
	.db-link__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
