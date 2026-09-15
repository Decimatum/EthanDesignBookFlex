<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuProps {
		open?: boolean;
		side?: 'top' | 'right' | 'bottom' | 'left';
		align?: 'start' | 'center' | 'end';
		/** Minimum panel width. */
		minWidth?: string;
		onOpenChange?: (open: boolean) => void;
		/** The button that opens the menu. Spread `props` onto it. */
		trigger: Snippet<[Record<string, unknown>]>;
		/** MenuItem / MenuGroup / MenuSeparator children. */
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { DropdownMenu as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		open = $bindable(false),
		side = 'bottom',
		align = 'start',
		minWidth = '12rem',
		onOpenChange,
		trigger,
		children,
		class: className
	}: MenuProps = $props();
</script>

<Bits.Root bind:open {onOpenChange}>
	<Bits.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Bits.Trigger>
	<Bits.Portal>
		<Bits.Content
			class={cn('db-menu', className)}
			{side}
			{align}
			sideOffset={6}
			collisionPadding={8}
			style="min-width: {minWidth}"
		>
			{@render children()}
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-menu) {
		z-index: var(--z-popover);
		max-height: calc(100dvh - var(--space-8));
		overflow-y: auto;
		padding: var(--space-1);
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		outline: none;
	}
	:global(.db-menu[data-state='open']) {
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-menu[data-state='closed']) {
		animation: db-pop-out var(--duration-fast) var(--ease-accelerate);
	}
</style>
