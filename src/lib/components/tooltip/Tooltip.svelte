<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TooltipProps {
		/** Tooltip text. For rich content use the `content` snippet instead. */
		text?: string;
		content?: Snippet;
		side?: 'top' | 'right' | 'bottom' | 'left';
		align?: 'start' | 'center' | 'end';
		/** Hover delay before showing, in ms. */
		delay?: number;
		disabled?: boolean;
		/** The element the tooltip describes. Spread `props` onto it — it must be focusable. */
		children: Snippet<[Record<string, unknown>]>;
		class?: string;
	}
</script>

<script lang="ts">
	import { Tooltip as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		text,
		content,
		side = 'top',
		align = 'center',
		delay = 300,
		disabled = false,
		children,
		class: className
	}: TooltipProps = $props();
</script>

<Bits.Provider delayDuration={delay}>
	<Bits.Root {disabled}>
		<Bits.Trigger>
			{#snippet child({ props })}
				{@render children(props)}
			{/snippet}
		</Bits.Trigger>
		<Bits.Portal>
			<Bits.Content
				role="tooltip"
				class={cn('db-tooltip', className)}
				{side}
				{align}
				sideOffset={6}
				collisionPadding={8}
			>
				<Bits.Arrow class="db-tooltip__arrow" width={10} height={5} />
				{#if content}{@render content()}{:else}{text}{/if}
			</Bits.Content>
		</Bits.Portal>
	</Bits.Root>
</Bits.Provider>

<style>
	:global(.db-tooltip) {
		z-index: var(--z-tooltip);
		max-width: 18rem;
		padding: var(--space-1-5) var(--space-2-5);
		background: var(--color-neutral);
		color: var(--color-neutral-fg);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		line-height: var(--leading-snug);
		text-wrap: balance;
		pointer-events: none;
	}
	:global(.db-tooltip[data-state='delayed-open']),
	:global(.db-tooltip[data-state='instant-open']) {
		animation: db-pop-in var(--duration-fast) var(--ease-decelerate);
	}
	:global(.db-tooltip[data-state='closed']) {
		animation: db-fade-out var(--duration-fast) var(--ease-standard);
	}
	:global(.db-tooltip__arrow svg) {
		display: block;
		fill: var(--color-neutral);
	}
</style>
