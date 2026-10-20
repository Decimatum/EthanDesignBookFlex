<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Tone } from '../../types.js';

	export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
		tone?: Tone;
		size?: 'sm' | 'md';
		/** Adds a remove button. */
		onRemove?: () => void;
		/** Renders the body as a toggle; `selected` reflects state. */
		selected?: boolean;
		onSelect?: (selected: boolean) => void;
		disabled?: boolean;
		/** Icon before the label. */
		leading?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { X } from '@lucide/svelte';

	let {
		tone = 'neutral',
		size = 'md',
		onRemove,
		selected = $bindable(false),
		onSelect,
		disabled = false,
		leading,
		children,
		class: className,
		...rest
	}: TagProps = $props();

	const selectable = $derived(onSelect !== undefined);
	function toggle() {
		if (disabled) return;
		selected = !selected;
		onSelect?.(selected);
	}
</script>

{#snippet body()}
	{#if leading}<span class="db-tag__icon" aria-hidden="true">{@render leading()}</span>{/if}
	{#if children}<span class="db-tag__label">{@render children()}</span>{/if}
{/snippet}

<span
	{...rest}
	class={['db-tag', className]}
	data-tone={tone}
	data-size={size}
	data-selected={selected || undefined}
	data-disabled={disabled || undefined}
	data-removable={onRemove ? true : undefined}
>
	{#if selectable}
		<button
			type="button"
			class="db-tag__body db-tag__toggle"
			aria-pressed={selected}
			{disabled}
			onclick={toggle}
		>
			{@render body()}
		</button>
	{:else}
		<span class="db-tag__body">{@render body()}</span>
	{/if}
	{#if onRemove}
		<button
			type="button"
			class="db-tag__remove"
			aria-label="Remove"
			{disabled}
			onclick={() => onRemove()}
		>
			<X aria-hidden="true" />
		</button>
	{/if}
</span>

<style>
	.db-tag {
		--_bg: var(--color-component);
		--_fg: var(--color-text);
		--_border: var(--color-border);
		--_h: 1.75rem;
		--_fs: var(--text-sm);
		display: inline-flex;
		align-items: stretch;
		height: var(--_h);
		border: 1px solid var(--_border);
		border-radius: var(--radius-full);
		background: var(--_bg);
		color: var(--_fg);
		font-family: var(--font-body);
		font-size: var(--_fs);
		font-weight: var(--weight-medium);
		line-height: 1;
		white-space: nowrap;
		vertical-align: middle;
		overflow: hidden;
		transition: var(--transition-colors);
	}
	.db-tag[data-size='sm'] {
		--_h: 1.375rem;
		--_fs: var(--text-xs);
	}

	/* tones */
	.db-tag[data-tone='accent'] {
		--_bg: var(--color-accent-subtle);
		--_fg: var(--color-accent-text);
		--_border: var(--color-accent-border);
	}
	.db-tag[data-tone='success'] {
		--_bg: var(--color-success-subtle);
		--_fg: var(--color-success-text);
		--_border: var(--color-success-border);
	}
	.db-tag[data-tone='warning'] {
		--_bg: var(--color-warning-subtle);
		--_fg: var(--color-warning-text);
		--_border: var(--color-warning-border);
	}
	.db-tag[data-tone='danger'] {
		--_bg: var(--color-danger-subtle);
		--_fg: var(--color-danger-text);
		--_border: var(--color-danger-border);
	}
	.db-tag[data-tone='info'] {
		--_bg: var(--color-info-subtle);
		--_fg: var(--color-info-text);
		--_border: var(--color-info-border);
	}

	/* selected: invert to solid neutral, whatever the tone */
	.db-tag[data-selected] {
		--_bg: var(--color-neutral);
		--_fg: var(--color-neutral-fg);
		--_border: var(--color-neutral);
	}
	.db-tag[data-disabled] {
		opacity: 0.55;
	}

	/* parts */
	.db-tag__body {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		padding-inline: var(--space-2-5);
		color: inherit;
		font: inherit;
	}
	.db-tag[data-removable] .db-tag__body {
		padding-inline-end: var(--space-1-5);
	}
	.db-tag__toggle {
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.db-tag__toggle:hover:not(:disabled) {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	.db-tag__toggle:disabled {
		cursor: not-allowed;
	}
	.db-tag__toggle:focus-visible,
	.db-tag__remove:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring-inset);
	}
	.db-tag__icon {
		display: inline-flex;
		width: 1em;
		height: 1em;
	}
	.db-tag__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-tag__remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(var(--_h) - 0.25rem);
		margin-inline-end: 0.125rem;
		border-radius: var(--radius-full);
		color: inherit;
		opacity: 0.7;
		cursor: pointer;
		transition:
			var(--transition-colors),
			opacity var(--duration-fast) var(--ease-standard);
	}
	.db-tag__remove:hover:not(:disabled) {
		opacity: 1;
		background: color-mix(in srgb, currentColor 12%, transparent);
	}
	.db-tag__remove:disabled {
		cursor: not-allowed;
	}
	.db-tag__remove :global(svg) {
		width: 0.9em;
		height: 0.9em;
	}
</style>
