<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
	export type PopoverAlign = 'start' | 'center' | 'end';

	export interface PopoverProps {
		open?: boolean;
		side?: PopoverSide;
		align?: PopoverAlign;
		/** Gap between trigger and panel, in px. */
		sideOffset?: number;
		/** Show the little arrow pointing at the trigger. */
		arrow?: boolean;
		/** Panel width, any CSS length. Defaults to content width (max 20rem). */
		width?: string;
		/** Remove the default padding for edge-to-edge content (lists, menus). */
		flush?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** The element that toggles the popover. Spread `props` onto it. */
		trigger: Snippet<[Record<string, unknown>]>;
		/** Panel content. Receives `close()`. */
		children?: Snippet<[{ close: () => void }]>;
		class?: string;
	}
</script>

<script lang="ts">
	import { Popover as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		open = $bindable(false),
		side = 'bottom',
		align = 'center',
		sideOffset = 8,
		arrow = true,
		width,
		flush = false,
		onOpenChange,
		trigger,
		children,
		class: className
	}: PopoverProps = $props();

	const close = () => (open = false);
</script>

<Bits.Root bind:open {onOpenChange}>
	<Bits.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Bits.Trigger>
	<Bits.Portal>
		<Bits.Content
			class={cn('db-popover', className)}
			{side}
			{align}
			{sideOffset}
			collisionPadding={8}
			data-flush={flush || undefined}
			style={width ? `width: ${width}` : undefined}
		>
			{#if arrow}<Bits.Arrow class="db-popover__arrow" width={12} height={6} />{/if}
			{#if children}{@render children({ close })}{/if}
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-popover) {
		z-index: var(--z-popover);
		max-width: min(20rem, calc(100vw - var(--space-4)));
		padding: var(--space-4);
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
		outline: none;
	}
	:global(.db-popover[data-flush]) {
		padding: 0;
		overflow: hidden;
	}
	:global(.db-popover[data-state='open']) {
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-popover[data-state='closed']) {
		animation: db-pop-out var(--duration-fast) var(--ease-accelerate);
	}
	:global(.db-popover__arrow svg) {
		display: block;
		fill: var(--color-surface-overlay);
		stroke: var(--color-border);
		stroke-width: 1px;
	}
</style>
