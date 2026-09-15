<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
		/** `text` renders one or more text-height lines; `rect` and `circle` use width/height. */
		variant?: 'text' | 'rect' | 'circle';
		/** Number of lines for the text variant (last line is shorter). */
		lines?: number;
		width?: string;
		height?: string;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		variant = 'text',
		lines = 1,
		width,
		height,
		class: className,
		...rest
	}: SkeletonProps = $props();
</script>

<div
	{...rest}
	class={['db-skeleton', className]}
	data-variant={variant}
	aria-hidden="true"
	style:width
	style:height
>
	{#if variant === 'text'}
		{#each Array.from({ length: lines }, (_, i) => i) as i (i)}
			<span class="db-skeleton__line" data-last={i === lines - 1 && lines > 1 ? true : undefined}
			></span>
		{/each}
	{/if}
</div>

<style>
	.db-skeleton {
		--_base: var(--color-component);
		--_shine: var(--color-component-hover);
		display: block;
		min-width: 0;
	}
	.db-skeleton[data-variant='text'] {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.db-skeleton__line,
	.db-skeleton[data-variant='rect'],
	.db-skeleton[data-variant='circle'] {
		background: linear-gradient(90deg, var(--_base) 25%, var(--_shine) 50%, var(--_base) 75%);
		background-size: 200% 100%;
		animation: db-shimmer 1.6s ease-in-out infinite;
		border-radius: var(--radius-sm);
	}
	.db-skeleton__line {
		display: block;
		height: 0.9em;
		width: 100%;
	}
	.db-skeleton__line[data-last] {
		width: 60%;
	}
	.db-skeleton[data-variant='rect'] {
		width: 100%;
		height: 6rem;
		border-radius: var(--radius-md);
	}
	.db-skeleton[data-variant='circle'] {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-full);
	}
	@keyframes db-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.db-skeleton__line,
		.db-skeleton[data-variant='rect'],
		.db-skeleton[data-variant='circle'] {
			animation: none;
		}
	}
</style>
