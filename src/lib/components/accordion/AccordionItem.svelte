<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface AccordionItemProps {
		/** Identifies this item in the Accordion's value. */
		value: string;
		title: string;
		/** Secondary text under the title. */
		description?: string;
		disabled?: boolean;
		/** Icon before the title. */
		leading?: Snippet;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Accordion as Bits } from 'bits-ui';
	import { ChevronDown } from '@lucide/svelte';
	import { cn } from '../../utils/index.js';

	let {
		value,
		title,
		description,
		disabled = false,
		leading,
		children,
		class: className
	}: AccordionItemProps = $props();
</script>

<Bits.Item {value} {disabled} class={cn('db-accordion-item', className)}>
	<Bits.Header level={3} class="db-accordion-item__header">
		<Bits.Trigger class="db-accordion-item__trigger">
			{#if leading}<span class="db-accordion-item__icon" aria-hidden="true"
					>{@render leading()}</span
				>{/if}
			<span class="db-accordion-item__text">
				<span class="db-accordion-item__title">{title}</span>
				{#if description}<span class="db-accordion-item__description">{description}</span>{/if}
			</span>
			<ChevronDown class="db-accordion-item__chevron" aria-hidden="true" />
		</Bits.Trigger>
	</Bits.Header>
	<Bits.Content class="db-accordion-item__content">
		<div class="db-accordion-item__body">{@render children()}</div>
	</Bits.Content>
</Bits.Item>

<style>
	:global(.db-accordion-item) {
		border-bottom: 1px solid var(--color-border);
	}
	:global(.db-accordion-item:last-child) {
		border-bottom: none;
	}
	:global(.db-accordion-item__header) {
		margin: 0;
		font: inherit;
	}
	:global(.db-accordion-item__trigger) {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		text-align: left;
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--text-md);
		font-weight: var(--weight-medium);
		line-height: var(--leading-snug);
		cursor: pointer;
		transition: var(--transition-colors);
	}
	:global(.db-accordion-item__trigger:hover) {
		background: var(--color-bg-subtle);
	}
	:global(.db-accordion-item__trigger:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring-inset);
	}
	:global(.db-accordion-item__trigger[data-disabled]) {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	:global(.db-accordion-item__icon) {
		display: inline-flex;
		flex: none;
		width: 1.1em;
		height: 1.1em;
		color: var(--color-text-muted);
	}
	:global(.db-accordion-item__icon svg) {
		width: 100%;
		height: 100%;
	}
	:global(.db-accordion-item__text) {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	:global(.db-accordion-item__description) {
		font-size: var(--text-sm);
		font-weight: var(--weight-regular);
		color: var(--color-text-muted);
	}
	:global(.db-accordion-item__chevron) {
		flex: none;
		width: 1.1em;
		height: 1.1em;
		color: var(--color-text-subtle);
		transition: transform var(--duration-base) var(--ease-standard);
	}
	:global(.db-accordion-item__trigger[data-state='open'] .db-accordion-item__chevron) {
		transform: rotate(180deg);
	}
	:global(.db-accordion-item__content) {
		overflow: hidden;
	}
	:global(.db-accordion-item__content[data-state='open']) {
		animation: db-accordion-down var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-accordion-item__content[data-state='closed']) {
		animation: db-accordion-up var(--duration-fast) var(--ease-accelerate);
	}
	@keyframes db-accordion-down {
		from {
			height: 0;
		}
		to {
			height: var(--bits-accordion-content-height);
		}
	}
	@keyframes db-accordion-up {
		from {
			height: var(--bits-accordion-content-height);
		}
		to {
			height: 0;
		}
	}
	:global(.db-accordion-item__body) {
		padding: 0 var(--space-4) var(--space-4);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
		color: var(--color-text-muted);
	}
	:global(.db-accordion-item__body > :first-child) {
		margin-top: 0;
	}
</style>
