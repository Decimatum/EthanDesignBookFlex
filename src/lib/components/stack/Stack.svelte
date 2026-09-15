<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Align, Justify, Space } from '../../types.js';

	export interface StackProps extends HTMLAttributes<HTMLElement> {
		/** Element to render. */
		as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav' | 'form' | 'fieldset';
		/** Gap between children, from the spacing scale. */
		gap?: Space;
		/** Cross-axis alignment. */
		align?: Align;
		/** Main-axis distribution. */
		justify?: Justify;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { alignValue, justifyValue, space } from '../../types.js';

	let {
		as = 'div',
		gap = '4',
		align,
		justify,
		children,
		class: className,
		...rest
	}: StackProps = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-stack', className]}
	style:--_gap={space(gap)}
	style:align-items={alignValue(align)}
	style:justify-content={justifyValue(justify)}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-stack {
		display: flex;
		flex-direction: column;
		gap: var(--_gap);
		min-width: 0;
	}
	ul.db-stack,
	ol.db-stack {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
