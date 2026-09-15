<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuCheckboxItemProps {
		checked?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		disabled?: boolean;
		/** Keep the menu open after toggling (default true — toggles usually come in sets). */
		keepOpen?: boolean;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { DropdownMenu as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		checked = $bindable(false),
		onCheckedChange,
		disabled = false,
		keepOpen = true,
		children: label,
		class: className
	}: MenuCheckboxItemProps = $props();
</script>

<Bits.CheckboxItem
	class={cn('db-menu-item db-menu-item--checkbox', className)}
	bind:checked
	{onCheckedChange}
	{disabled}
	closeOnSelect={!keepOpen}
>
	{#snippet children({ checked: isChecked })}
		<span class="db-menu-item__check" aria-hidden="true" data-checked={isChecked || undefined}>
			<svg
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg
			>
		</span>
		<span class="db-menu-item__label">{@render label()}</span>
	{/snippet}
</Bits.CheckboxItem>

<style>
	:global(.db-menu-item__check) {
		display: inline-flex;
		flex: none;
		width: 1em;
		height: 1em;
		color: var(--color-accent-text);
		opacity: 0;
	}
	:global(.db-menu-item__check[data-checked]) {
		opacity: 1;
	}
	:global(.db-menu-item__check svg) {
		width: 100%;
		height: 100%;
	}
</style>
