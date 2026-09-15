<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Align, Justify, Space } from '../../types.js';

	export interface InlineProps extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'span' | 'nav' | 'ul' | 'ol' | 'header' | 'footer';
		/** Gap between children (both axes when wrapping). */
		gap?: Space;
		/** Cross-axis alignment. Defaults to `center`. */
		align?: Align;
		justify?: Justify;
		/** Allow children to wrap onto new lines. Defaults to `true`. */
		wrap?: boolean;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { alignValue, justifyValue, space } from '../../types.js';

	let {
		as = 'div',
		gap = '3',
		align = 'center',
		justify,
		wrap = true,
		children,
		class: className,
		...rest
	}: InlineProps = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-inline', className]}
	style:--_gap={space(gap)}
	style:align-items={alignValue(align)}
	style:justify-content={justifyValue(justify)}
	style:flex-wrap={wrap ? 'wrap' : 'nowrap'}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-inline {
		display: flex;
		flex-direction: row;
		gap: var(--_gap);
		min-width: 0;
	}
	ul.db-inline,
	ol.db-inline {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
