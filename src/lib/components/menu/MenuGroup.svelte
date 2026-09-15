<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuGroupProps {
		/** Small heading above the items. */
		label?: string;
		children: Snippet;
	}
</script>

<script lang="ts">
	import { DropdownMenu as Bits } from 'bits-ui';

	let { label, children }: MenuGroupProps = $props();
</script>

<Bits.Group class="db-menu-group">
	{#if label}<Bits.GroupHeading class="db-menu-group__label">{label}</Bits.GroupHeading>{/if}
	{@render children()}
</Bits.Group>

<style>
	:global(.db-menu-group__label) {
		padding: var(--space-2) var(--space-2-5) var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}
</style>
