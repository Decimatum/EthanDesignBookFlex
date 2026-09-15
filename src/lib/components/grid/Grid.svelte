<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Align, Space } from '../../types.js';

	export interface GridProps extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'section' | 'ul' | 'ol';
		/**
		 * Fixed column count, or a raw `grid-template-columns` value.
		 * Ignored when `min` is set.
		 */
		columns?: number | string;
		/** Responsive mode: as many columns as fit with this minimum width, e.g. `'16rem'`. */
		min?: string;
		gap?: Space;
		/** Separate row gap; defaults to `gap`. */
		rowGap?: Space;
		align?: Align;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { alignValue, space } from '../../types.js';

	let {
		as = 'div',
		columns = 2,
		min,
		gap = '4',
		rowGap,
		align,
		children,
		class: className,
		...rest
	}: GridProps = $props();

	const template = $derived(
		min
			? `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`
			: typeof columns === 'number'
				? `repeat(${columns}, minmax(0, 1fr))`
				: columns
	);
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-grid', className]}
	style:grid-template-columns={template}
	style:column-gap={space(gap)}
	style:row-gap={space(rowGap ?? gap)}
	style:align-items={alignValue(align)}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-grid {
		display: grid;
		min-width: 0;
	}
	ul.db-grid,
	ol.db-grid {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
