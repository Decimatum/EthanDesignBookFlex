<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TabPanelProps {
		value: string;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Tabs as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let { value, children, class: className }: TabPanelProps = $props();
</script>

<Bits.Content {value} class={cn('db-tab-panel', className)}>
	{@render children()}
</Bits.Content>

<style>
	:global(.db-tab-panel) {
		min-width: 0;
		flex: 1;
		outline: none;
	}
	:global(.db-tab-panel:focus-visible) {
		box-shadow: var(--focus-ring);
		border-radius: var(--radius-sm);
	}
</style>
