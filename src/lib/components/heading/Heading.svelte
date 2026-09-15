<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	/** Visual size, decoupled from the semantic level. */
	export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'display';

	export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
		/** Semantic level (h1–h6). Drives the default size. */
		level?: HeadingLevel;
		/** Override the visual size without changing the level. */
		size?: HeadingSize;
		tone?: 'default' | 'muted' | 'accent';
		align?: 'start' | 'center' | 'end';
		/** Render with the body font instead of the display font (e.g. section labels). */
		plain?: boolean;
		truncate?: boolean;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	const defaultSize: Record<HeadingLevel, HeadingSize> = {
		1: 'xl',
		2: 'lg',
		3: 'md',
		4: 'sm',
		5: 'xs',
		6: 'xs'
	};

	let {
		level = 2,
		size,
		tone = 'default',
		align,
		plain = false,
		truncate = false,
		children,
		class: className,
		...rest
	}: HeadingProps = $props();

	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element
	this={tag}
	{...rest}
	class={['db-heading', className]}
	data-size={size ?? defaultSize[level]}
	data-tone={tone}
	data-plain={plain || undefined}
	data-truncate={truncate || undefined}
	style:text-align={align}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-heading {
		margin: 0;
		font-family: var(--font-display);
		font-feature-settings: var(--font-features-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		line-height: var(--leading-tight);
		color: var(--color-text);
		text-wrap: balance;
	}
	.db-heading[data-size='xs'] {
		font-size: var(--text-md);
	}
	.db-heading[data-size='sm'] {
		font-size: var(--text-lg);
	}
	.db-heading[data-size='md'] {
		font-size: var(--text-xl);
	}
	.db-heading[data-size='lg'] {
		font-size: var(--text-2xl);
	}
	.db-heading[data-size='xl'] {
		font-size: var(--text-3xl);
	}
	.db-heading[data-size='2xl'] {
		font-size: var(--text-4xl);
	}
	.db-heading[data-size='display'] {
		font-size: var(--text-6xl);
		line-height: var(--leading-none);
	}
	.db-heading[data-tone='muted'] {
		color: var(--color-text-muted);
	}
	.db-heading[data-tone='accent'] {
		color: var(--color-accent-text);
	}
	.db-heading[data-plain] {
		font-family: var(--font-body);
		font-feature-settings: var(--font-features-body);
		font-variation-settings: normal;
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-normal);
	}
	.db-heading[data-truncate] {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-wrap: initial;
	}
</style>
