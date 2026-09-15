<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types.js';

	export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
		orientation?: 'horizontal' | 'vertical';
		/** Space above/below (or left/right). Defaults to `0`. */
		spacing?: Space;
		/** Optional centred label, e.g. "or". */
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { space } from '../../types.js';

	let {
		orientation = 'horizontal',
		spacing = '0',
		children,
		class: className,
		...rest
	}: DividerProps = $props();
</script>

<div
	{...rest}
	class={['db-divider', className]}
	role="separator"
	aria-orientation={orientation}
	data-orientation={orientation}
	data-labelled={children ? true : undefined}
	style:--_spacing={space(spacing)}
>
	{#if children}
		<span class="db-divider__label">{@render children()}</span>
	{/if}
</div>

<style>
	.db-divider {
		--_line: var(--color-border);
		flex: none;
	}
	.db-divider[data-orientation='horizontal'] {
		display: flex;
		align-items: center;
		width: 100%;
		height: 1px;
		background: var(--_line);
		margin-block: var(--_spacing);
	}
	.db-divider[data-orientation='vertical'] {
		align-self: stretch;
		width: 1px;
		min-height: 1em;
		background: var(--_line);
		margin-inline: var(--_spacing);
	}
	.db-divider[data-orientation='horizontal'][data-labelled] {
		background: none;
		height: auto;
		gap: var(--space-3);
	}
	.db-divider[data-labelled]::before,
	.db-divider[data-labelled]::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--_line);
	}
	.db-divider__label {
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		white-space: nowrap;
	}
</style>
