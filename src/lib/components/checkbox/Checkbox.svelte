<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface CheckboxProps extends Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> {
		checked?: boolean;
		/** Mixed state for "select all" controls. Visual + aria only; clicking sets `checked`. */
		indeterminate?: boolean;
		size?: 'sm' | 'md';
		invalid?: boolean;
		/** Secondary line under the label. */
		description?: string;
		/** Label. */
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { getFieldContext } from '../field/context.js';

	let {
		checked = $bindable(false),
		indeterminate = false,
		size = 'md',
		invalid,
		disabled,
		description,
		id: idProp,
		children,
		class: className,
		...rest
	}: CheckboxProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? `db-checkbox-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);

	let el = $state<HTMLInputElement | null>(null);
	// Clicking a mixed checkbox clears the native flag; re-assert the prop's value whenever
	// `checked` changes so the parent stays in control of the mixed state.
	$effect(() => {
		void checked;
		if (el) el.indeterminate = indeterminate;
	});
</script>

<label
	class={['db-checkbox', className]}
	for={id}
	data-size={size}
	data-invalid={isInvalid || undefined}
	data-disabled={isDisabled || undefined}
>
	<input
		{...rest}
		bind:this={el}
		{id}
		type="checkbox"
		class="db-checkbox__control sr-only"
		bind:checked
		disabled={isDisabled}
		aria-invalid={isInvalid || undefined}
		aria-checked={indeterminate ? 'mixed' : undefined}
		aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
	/>
	<span class="db-checkbox__box" aria-hidden="true">
		<svg
			class="db-checkbox__icon"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="2.2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{#if indeterminate}
				<path d="M4 8h8" />
			{:else}
				<path d="M3.5 8.5l3 3 6-7" />
			{/if}
		</svg>
	</span>
	{#if children || description}
		<span class="db-checkbox__text">
			{#if children}<span class="db-checkbox__label">{@render children()}</span>{/if}
			{#if description}<span class="db-checkbox__description">{description}</span>{/if}
		</span>
	{/if}
</label>

<style>
	.db-checkbox {
		--_size: 1.125rem;
		display: inline-flex;
		align-items: flex-start;
		gap: var(--space-2-5);
		cursor: pointer;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		color: var(--color-text);
		user-select: none;
	}
	.db-checkbox[data-size='sm'] {
		--_size: 1rem;
		font-size: var(--text-xs);
	}
	.db-checkbox[data-disabled] {
		cursor: not-allowed;
		color: var(--color-text-disabled);
	}
	.db-checkbox__box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--_size);
		height: var(--_size);
		margin-top: calc((1em * var(--leading-snug) - var(--_size)) / 2);
		border: var(--control-border-width) solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-accent-fg);
		transition: var(--transition-colors);
	}
	.db-checkbox__icon {
		width: 80%;
		height: 80%;
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity var(--duration-fast) var(--ease-standard),
			transform var(--duration-fast) var(--ease-spring);
	}
	.db-checkbox:hover:not([data-disabled]) .db-checkbox__box {
		border-color: var(--color-text-subtle);
	}
	.db-checkbox__control:checked + .db-checkbox__box,
	.db-checkbox__control:indeterminate + .db-checkbox__box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}
	.db-checkbox__control:checked + .db-checkbox__box .db-checkbox__icon,
	.db-checkbox__control:indeterminate + .db-checkbox__box .db-checkbox__icon {
		opacity: 1;
		transform: scale(1);
	}
	.db-checkbox__control:focus-visible + .db-checkbox__box {
		box-shadow: var(--focus-ring);
	}
	.db-checkbox[data-invalid] .db-checkbox__box {
		border-color: var(--color-danger);
	}
	.db-checkbox[data-disabled] .db-checkbox__box {
		background: var(--color-bg-subtle);
		border-color: var(--color-border);
	}
	.db-checkbox[data-disabled] .db-checkbox__control:checked + .db-checkbox__box {
		background: var(--color-border-strong);
		border-color: var(--color-border-strong);
	}
	.db-checkbox__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	.db-checkbox__description {
		color: var(--color-text-muted);
	}
	.db-checkbox[data-disabled] .db-checkbox__description {
		color: var(--color-text-disabled);
	}
</style>
