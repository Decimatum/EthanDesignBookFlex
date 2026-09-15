<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TabProps {
		value: string;
		disabled?: boolean;
		/** Count or status shown after the label. */
		badge?: string | number;
		leading?: Snippet;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Tabs as Bits } from 'bits-ui';
	import { cn } from '../../utils/index.js';
	import { getTabsContext } from './context.js';

	let { value, disabled = false, badge, leading, children, class: className }: TabProps = $props();
	const ctx = getTabsContext();
</script>

<Bits.Trigger
	{value}
	{disabled}
	class={cn('db-tab', className)}
	data-variant={ctx?.variant ?? 'underline'}
	data-size={ctx?.size ?? 'md'}
>
	{#if leading}<span class="db-tab__icon" aria-hidden="true">{@render leading()}</span>{/if}
	<span class="db-tab__label">{@render children()}</span>
	{#if badge !== undefined}<span class="db-tab__badge">{badge}</span>{/if}
</Bits.Trigger>

<style>
	:global(.db-tab) {
		--_h: var(--control-h-md);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		height: var(--_h);
		padding-inline: var(--space-3);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		user-select: none;
		transition: var(--transition-colors);
		position: relative;
	}
	:global(.db-tab[data-size='sm']) {
		--_h: var(--control-h-sm);
		font-size: var(--text-xs);
		padding-inline: var(--space-2-5);
	}
	:global(.db-tab:hover) {
		color: var(--color-text);
	}
	:global(.db-tab:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	:global(.db-tab[data-disabled]) {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}

	/* underline */
	:global(.db-tab[data-variant='underline']) {
		padding-inline: var(--space-1);
		border-radius: var(--radius-xs);
	}
	:global(.db-tab[data-variant='underline']::after) {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 2px;
		border-radius: 2px 2px 0 0;
		background: transparent;
		transition: var(--transition-colors);
	}
	:global(.db-tab[data-variant='underline'][data-state='active']) {
		color: var(--color-text);
	}
	:global(.db-tab[data-variant='underline'][data-state='active']::after) {
		background: var(--color-accent);
	}
	:global(.db-tab-list[data-orientation='vertical'] .db-tab[data-variant='underline']) {
		justify-content: flex-start;
		padding-inline: var(--space-3);
	}
	:global(.db-tab-list[data-orientation='vertical'] .db-tab[data-variant='underline']::after) {
		left: auto;
		right: -1px;
		top: 0;
		bottom: 0;
		width: 2px;
		height: auto;
		border-radius: 2px 0 0 2px;
	}

	/* pill */
	:global(.db-tab[data-variant='pill'][data-state='active']) {
		background: var(--color-surface);
		color: var(--color-text);
		box-shadow: var(--shadow-sm);
	}

	:global(.db-tab__icon) {
		display: inline-flex;
		width: 1.1em;
		height: 1.1em;
	}
	:global(.db-tab__icon svg) {
		width: 100%;
		height: 100%;
	}
	:global(.db-tab__badge) {
		padding: 0 0.45em;
		min-width: 1.4em;
		height: 1.4em;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		background: var(--color-component);
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		font-variant-numeric: var(--font-numeric);
	}
	:global(.db-tab[data-state='active'] .db-tab__badge) {
		background: var(--color-accent-subtle);
		color: var(--color-accent-text);
	}
</style>
