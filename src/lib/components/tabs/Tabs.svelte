<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type TabsVariant = 'underline' | 'pill';

	export interface TabsProps {
		/** Bindable active tab value. */
		value?: string;
		variant?: TabsVariant;
		size?: 'sm' | 'md';
		orientation?: 'horizontal' | 'vertical';
		/** `automatic` activates on arrow-key focus; `manual` waits for Enter/Space. */
		activation?: 'automatic' | 'manual';
		onValueChange?: (value: string) => void;
		/** TabList and TabPanel children. */
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Tabs as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';
	import { setTabsContext } from './context.js';

	let {
		value = $bindable(),
		variant = 'underline',
		size = 'md',
		orientation = 'horizontal',
		activation = 'automatic',
		onValueChange,
		children,
		class: className
	}: TabsProps = $props();

	setTabsContext({
		get variant() {
			return variant;
		},
		get size() {
			return size;
		}
	});
</script>

<Bits.Root
	bind:value
	{onValueChange}
	{orientation}
	activationMode={activation}
	class={cn('db-tabs', className)}
	data-variant={variant}
>
	{@render children()}
</Bits.Root>

<style>
	:global(.db-tabs) {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		min-width: 0;
	}
	:global(.db-tabs[data-orientation='vertical']) {
		flex-direction: row;
		align-items: flex-start;
	}
</style>
