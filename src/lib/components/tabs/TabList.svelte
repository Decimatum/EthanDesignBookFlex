<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TabListProps {
		/** Accessible name for the set of tabs. */
		label: string;
		/** Stretch tabs to fill the width. */
		grow?: boolean;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Tabs as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';
	import { getTabsContext } from './context.js';

	let { label, grow = false, children, class: className }: TabListProps = $props();
	const ctx = getTabsContext();
</script>

<Bits.List
	class={cn('db-tab-list', className)}
	aria-label={label}
	data-variant={ctx?.variant ?? 'underline'}
	data-size={ctx?.size ?? 'md'}
	data-grow={grow || undefined}
>
	{@render children()}
</Bits.List>

<style>
	:global(.db-tab-list) {
		display: flex;
		gap: var(--space-1);
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}
	:global(.db-tab-list[data-orientation='vertical']) {
		flex-direction: column;
		overflow: visible;
	}
	:global(.db-tab-list[data-variant='underline']) {
		gap: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}
	:global(.db-tab-list[data-variant='underline'][data-orientation='vertical']) {
		gap: var(--space-1);
		border-bottom: none;
		border-right: 1px solid var(--color-border);
	}
	:global(.db-tab-list[data-variant='pill']) {
		padding: var(--space-1);
		background: var(--color-bg-subtle);
		border-radius: var(--radius-lg);
	}
	:global(.db-tab-list[data-grow] .db-tab) {
		flex: 1;
	}
</style>
