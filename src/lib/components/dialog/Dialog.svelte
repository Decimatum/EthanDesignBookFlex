<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type DialogSize = 'sm' | 'md' | 'lg' | 'full';

	export interface DialogProps {
		/** Bindable open state. */
		open?: boolean;
		/** Required: the accessible name announced when the dialog opens. */
		title: string;
		/** Optional supporting text under the title, linked via aria-describedby. */
		description?: string;
		size?: DialogSize;
		/**
		 * Allow closing via Escape, clicking the overlay and the corner X.
		 * Set false for flows that must be completed (a confirmation with an explicit action).
		 */
		dismissible?: boolean;
		/** Hide the corner close button while keeping Escape/outside-click. */
		hideClose?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** The element that opens the dialog. Spread `props` onto it. */
		trigger?: Snippet<[Record<string, unknown>]>;
		/** Body. Receives `close()` for convenience. */
		children?: Snippet<[{ close: () => void }]>;
		/** Action row, right-aligned. Receives `close()`. */
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
		size = 'md',
		dismissible = true,
		hideClose = false,
		onOpenChange,
		trigger,
		children,
		footer,
		class: className
	}: DialogProps = $props();

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
		<Bits.Overlay class="db-dialog__overlay" />
		<Bits.Content
			class={cn('db-dialog', className)}
			data-size={size}
			escapeKeydownBehavior={dismissible ? 'close' : 'ignore'}
			interactOutsideBehavior={dismissible ? 'close' : 'ignore'}
		>
			<header class="db-dialog__header">
				<div class="db-dialog__heading">
					<Bits.Title class="db-dialog__title" level={2}>{title}</Bits.Title>
					{#if description}
						<Bits.Description class="db-dialog__description">{description}</Bits.Description>
					{/if}
				</div>
				{#if dismissible && !hideClose}
					<Bits.Close class="db-dialog__close" aria-label="Close">
						<X aria-hidden="true" />
					</Bits.Close>
				{/if}
			</header>
			{#if children}
				<div class="db-dialog__body">{@render children({ close })}</div>
			{/if}
			{#if footer}
				<footer class="db-dialog__footer">{@render footer({ close })}</footer>
			{/if}
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-dialog__overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-overlay);
		background: oklch(0% 0 0 / 0.45);
		backdrop-filter: blur(2px);
	}
	:global(.db-dialog__overlay[data-state='open']) {
		animation: db-fade-in var(--duration-base) var(--ease-standard);
	}
	:global(.db-dialog__overlay[data-state='closed']) {
		animation: db-fade-out var(--duration-fast) var(--ease-standard);
	}

	:global(.db-dialog) {
		--_w: 32rem;
		/* inset:0 + margin:auto centres without a transform, leaving transform free for the animation */
		position: fixed;
		inset: 0;
		margin: auto;
		z-index: var(--z-modal);
		width: min(var(--_w), calc(100vw - var(--space-8)));
		height: fit-content;
		max-height: calc(100dvh - var(--space-8));
		display: flex;
		flex-direction: column;
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-overlay);
		outline: none;
	}
	:global(.db-dialog[data-size='sm']) {
		--_w: 24rem;
	}
	:global(.db-dialog[data-size='lg']) {
		--_w: 48rem;
	}
	:global(.db-dialog[data-size='full']) {
		--_w: calc(100vw - var(--space-8));
		height: calc(100dvh - var(--space-8));
	}
	:global(.db-dialog[data-state='open']) {
		animation: db-dialog-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-dialog[data-state='closed']) {
		animation: db-dialog-out var(--duration-fast) var(--ease-accelerate);
	}

	:global(.db-dialog__header) {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-6) 0;
	}
	:global(.db-dialog__heading) {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}
	:global(.db-dialog__title) {
		margin: 0;
		font-family: var(--font-display);
		font-feature-settings: var(--font-features-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		letter-spacing: var(--font-display-tracking);
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
	}
	:global(.db-dialog__description) {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: var(--leading-normal);
	}
	:global(.db-dialog__close) {
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
	:global(.db-dialog__close:hover) {
		background: var(--color-component);
		color: var(--color-text);
	}
	:global(.db-dialog__close:focus-visible) {
		box-shadow: var(--focus-ring);
	}
	:global(.db-dialog__close svg) {
		width: 1.1rem;
		height: 1.1rem;
	}
	:global(.db-dialog__body) {
		padding: var(--space-4) var(--space-6) var(--space-6);
		overflow: auto;
		min-height: 0;
		font-size: var(--text-md);
		line-height: var(--leading-normal);
	}
	:global(.db-dialog__footer) {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-6);
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-subtle);
		border-radius: 0 0 var(--radius-xl) var(--radius-xl);
	}
</style>
