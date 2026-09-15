<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuItemProps {
		/** Called when the item is chosen (click, Enter or Space). */
		onSelect?: () => void;
		/** Render as a link instead of an action. */
		href?: string;
		disabled?: boolean;
		/** Danger tone for destructive actions. */
		tone?: 'default' | 'danger';
		/** Keyboard shortcut hint, e.g. "⌘S". Display only. */
		shortcut?: string;
		/** Keep the menu open after selecting. */
		keepOpen?: boolean;
		/** Icon before the label. */
		leading?: Snippet;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { DropdownMenu as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';

	let {
		onSelect,
		href,
		disabled = false,
		tone = 'default',
		shortcut,
		keepOpen = false,
		leading,
		children,
		class: className
	}: MenuItemProps = $props();
</script>

{#snippet inner()}
	{#if leading}<span class="db-menu-item__icon" aria-hidden="true">{@render leading()}</span>{/if}
	<span class="db-menu-item__label">{@render children()}</span>
	{#if shortcut}<kbd class="db-menu-item__shortcut" aria-hidden="true">{shortcut}</kbd>{/if}
{/snippet}

{#if href}
	<Bits.Item
		class={cn('db-menu-item', className)}
		data-tone={tone}
		{disabled}
		closeOnSelect={!keepOpen}
		onSelect={() => onSelect?.()}
	>
		{#snippet child({ props }: { props: Record<string, unknown> })}
			<a {...props} {href}>{@render inner()}</a>
		{/snippet}
	</Bits.Item>
{:else}
	<Bits.Item
		class={cn('db-menu-item', className)}
		data-tone={tone}
		{disabled}
		closeOnSelect={!keepOpen}
		onSelect={() => onSelect?.()}
	>
		{@render inner()}
	</Bits.Item>
{/if}

<style>
	:global(.db-menu-item) {
		display: flex;
		align-items: center;
		gap: var(--space-2-5);
		min-height: var(--control-h-sm);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		text-decoration: none;
		cursor: default;
		user-select: none;
		outline: none;
		transition: var(--transition-colors);
	}
	:global(.db-menu-item[data-highlighted]) {
		background: var(--color-component);
	}
	:global(.db-menu-item[data-tone='danger']) {
		color: var(--color-danger-text);
	}
	:global(.db-menu-item[data-tone='danger'][data-highlighted]) {
		background: var(--color-danger-subtle);
	}
	:global(.db-menu-item[data-disabled]) {
		color: var(--color-text-disabled);
		pointer-events: none;
	}
	:global(.db-menu-item__icon) {
		display: inline-flex;
		flex: none;
		width: 1em;
		height: 1em;
		color: var(--color-text-muted);
	}
	:global(.db-menu-item[data-tone='danger'] .db-menu-item__icon) {
		color: inherit;
	}
	:global(.db-menu-item__icon svg) {
		width: 100%;
		height: 100%;
	}
	:global(.db-menu-item__label) {
		flex: 1;
		min-width: 0;
	}
	:global(.db-menu-item__shortcut) {
		margin-inline-start: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
</style>
