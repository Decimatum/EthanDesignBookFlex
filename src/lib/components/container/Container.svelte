<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

	export interface ContainerProps extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer';
		/** Max width from `--container-*`. `full` removes the cap. */
		size?: ContainerSize;
		/** Horizontal page padding (`--page-px`). Defaults to `true`. */
		padded?: boolean;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		as = 'div',
		size = 'lg',
		padded = true,
		children,
		class: className,
		...rest
	}: ContainerProps = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-container', className]}
	data-size={size}
	data-padded={padded || undefined}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-container {
		width: 100%;
		margin-inline: auto;
		min-width: 0;
	}
	.db-container[data-padded] {
		padding-inline: var(--page-px);
	}
	.db-container[data-size='sm'] {
		max-width: var(--container-sm);
	}
	.db-container[data-size='md'] {
		max-width: var(--container-md);
	}
	.db-container[data-size='lg'] {
		max-width: var(--container-lg);
	}
	.db-container[data-size='xl'] {
		max-width: var(--container-xl);
	}
	.db-container[data-size='full'] {
		max-width: none;
	}
</style>
