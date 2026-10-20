<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface AccordionProps {
		/** `single` opens one item at a time; `multiple` allows several. */
		type?: 'single' | 'multiple';
		/** Bindable open value(s): a string for single, string[] for multiple. */
		value?: string | string[];
		/** Hairline between items and no outer border. */
		variant?: 'bordered' | 'divided';
		disabled?: boolean;
		onValueChange?: (value: string | string[]) => void;
		/** AccordionItem children. */
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Accordion as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		type = 'single',
		value = $bindable(),
		variant = 'bordered',
		disabled = false,
		onValueChange,
		children,
		class: className
	}: AccordionProps = $props();
</script>

{#if type === 'multiple'}
	<Bits.Root
		type="multiple"
		bind:value={value as string[]}
		onValueChange={(v) => onValueChange?.(v)}
		{disabled}
		class={cn('db-accordion', className)}
		data-variant={variant}
	>
		{@render children()}
	</Bits.Root>
{:else}
	<Bits.Root
		type="single"
		bind:value={value as string}
		onValueChange={(v) => onValueChange?.(v)}
		{disabled}
		class={cn('db-accordion', className)}
		data-variant={variant}
	>
		{@render children()}
	</Bits.Root>
{/if}

<style>
	:global(.db-accordion) {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	:global(.db-accordion[data-variant='bordered']) {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}
</style>
