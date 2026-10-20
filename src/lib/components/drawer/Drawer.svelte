<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface DrawerProps {
		open?: boolean;
		/** Required accessible name. */
		title: string;
		description?: string;
		/** Edge the panel slides in from. */
		side?: 'right' | 'left' | 'bottom';
		/** Panel width (left/right) or height (bottom). */
		size?: string;
		dismissible?: boolean;
		onOpenChange?: (open: boolean) => void;
		trigger?: Snippet<[Record<string, unknown>]>;
		children?: Snippet<[{ close: () => void }]>;
		footer?: Snippet<[{ close: () => void }]>;
		class?: string;
	}
</script>

<script lang="ts">
	import { Dialog as Bits } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import { cn } from '../../utils/index.js';

	let {
		open = $bindable(false),
		title,
		description,
		side = 'right',
		size = '24rem',
		dismissible = true,
		onOpenChange,
		trigger,
		children,
		footer,
		class: className
	}: DrawerProps = $props();

	const close = () => (open = false);
</script>

<Bits.Root bind:open {onOpenChange}>
	{#if trigger}
		<Bits.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</Bits.Trigger>
	{/if}
	<Bits.Portal>
		<Bits.Overlay class="db-drawer__overlay" />
		<Bits.Content
			class={cn('db-drawer', className)}
			data-side={side}
			style="--_size: {size}"
			escapeKeydownBehavior={dismissible ? 'close' : 'ignore'}
			interactOutsideBehavior={dismissible ? 'close' : 'ignore'}
		>
			<header class="db-drawer__header">
				<div class="db-drawer__heading">
					<Bits.Title class="db-drawer__title" level={2}>{title}</Bits.Title>
					{#if description}<Bits.Description class="db-drawer__description"
							>{description}</Bits.Description
						>{/if}
				</div>
				{#if dismissible}
					<Bits.Close class="db-drawer__close" aria-label="Close"
						><X aria-hidden="true" /></Bits.Close
					>
				{/if}
			</header>
			{#if children}<div class="db-drawer__body">{@render children({ close })}</div>{/if}
			{#if footer}<footer class="db-drawer__footer">{@render footer({ close })}</footer>{/if}
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-drawer__overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-overlay);
		background: oklch(0% 0 0 / 0.45);
	}
	:global(.db-drawer__overlay[data-state='open']) {
		animation: db-fade-in var(--duration-base) var(--ease-standard);
	}
	:global(.db-drawer__overlay[data-state='closed']) {
		animation: db-fade-out var(--duration-fast) var(--ease-standard);
	}
	:global(.db-drawer) {
		position: fixed;
		z-index: var(--z-modal);
		display: flex;
		flex-direction: column;
		background: var(--color-surface-overlay);
		color: var(--color-text);
		box-shadow: var(--shadow-overlay);
		outline: none;
	}
	:global(.db-drawer[data-side='right']),
	:global(.db-drawer[data-side='left']) {
		top: 0;
		bottom: 0;
		width: min(var(--_size), calc(100vw - var(--space-8)));
	}
	:global(.db-drawer[data-side='right']) {
		right: 0;
		border-left: 1px solid var(--color-border);
	}
	:global(.db-drawer[data-side='left']) {
		left: 0;
		border-right: 1px solid var(--color-border);
	}
	:global(.db-drawer[data-side='bottom']) {
		left: 0;
		right: 0;
		bottom: 0;
		max-height: min(var(--_size), calc(100dvh - var(--space-8)));
		border-top: 1px solid var(--color-border);
		border-radius: var(--radius-xl) var(--radius-xl) 0 0;
	}
	:global(.db-drawer[data-side='right'][data-state='open']) {
		animation: db-slide-from-right var(--duration-slow) var(--ease-decelerate);
	}
	:global(.db-drawer[data-side='right'][data-state='closed']) {
		animation: db-slide-to-right var(--duration-base) var(--ease-accelerate);
	}
	:global(.db-drawer[data-side='left'][data-state='open']) {
		animation: db-slide-from-left var(--duration-slow) var(--ease-decelerate);
	}
	:global(.db-drawer[data-side='left'][data-state='closed']) {
		animation: db-slide-to-left var(--duration-base) var(--ease-accelerate);
	}
	:global(.db-drawer[data-side='bottom'][data-state='open']) {
		animation: db-slide-from-bottom var(--duration-slow) var(--ease-decelerate);
	}
	:global(.db-drawer[data-side='bottom'][data-state='closed']) {
		animation: db-slide-to-bottom var(--duration-base) var(--ease-accelerate);
	}
	@keyframes db-slide-from-right {
		from {
			transform: translateX(100%);
		}
	}
	@keyframes db-slide-to-right {
		to {
			transform: translateX(100%);
		}
	}
	@keyframes db-slide-from-left {
		from {
			transform: translateX(-100%);
		}
	}
	@keyframes db-slide-to-left {
		to {
			transform: translateX(-100%);
		}
	}
	@keyframes db-slide-from-bottom {
		from {
			transform: translateY(100%);
		}
	}
	@keyframes db-slide-to-bottom {
		to {
			transform: translateY(100%);
		}
	}
	:global(.db-drawer__header) {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-5) var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}
	:global(.db-drawer__heading) {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	:global(.db-drawer__title) {
		margin: 0;
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		font-size: var(--text-lg);
		line-height: var(--leading-tight);
	}
	:global(.db-drawer__description) {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	:global(.db-drawer__close) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		margin: calc(var(--space-1) * -1) calc(var(--space-2) * -1) 0 0;
		border-radius: var(--control-radius);
		color: var(--color-text-muted);
		transition: var(--transition-colors);
	}
	:global(.db-drawer__close:hover) {
		background: var(--color-component);
		color: var(--color-text);
	}
	:global(.db-drawer__close:focus-visible) {
		box-shadow: var(--focus-ring);
	}
	:global(.db-drawer__close svg) {
		width: 1.1rem;
		height: 1.1rem;
	}
	:global(.db-drawer__body) {
		flex: 1;
		min-height: 0;
		overflow: auto;
		padding: var(--space-5);
		font-size: var(--text-md);
		line-height: var(--leading-normal);
	}
	:global(.db-drawer__footer) {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-subtle);
	}
</style>
