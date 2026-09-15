<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface RadioProps extends Omit<
		HTMLInputAttributes,
		'type' | 'size' | 'value' | 'checked'
	> {
		/** This option's value. */
		value: string;
		/** Standalone use only — inside a RadioGroup the group's value wins. */
		checked?: boolean;
		size?: 'sm' | 'md';
		description?: string;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { getRadioGroupContext } from './context.js';

	let {
		value,
		checked = $bindable(false),
		size = 'md',
		description,
		disabled,
		name: nameProp,
		id: idProp,
		children,
		class: className,
		...rest
	}: RadioProps = $props();

	const group = getRadioGroupContext();
	const own = $props.id();
	const id = $derived(idProp ?? `db-radio-${own}`);
	const name = $derived(nameProp ?? group?.name);
	const isChecked = $derived(group ? group.value === value : checked);
	const isDisabled = $derived(disabled ?? group?.disabled ?? false);
	const isInvalid = $derived(group?.invalid ?? false);

	function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		if (group) group.select(value);
		else checked = e.currentTarget.checked;
	}
</script>

<label
	class={['db-radio', className]}
	for={id}
	data-size={size}
	data-invalid={isInvalid || undefined}
	data-disabled={isDisabled || undefined}
>
	<input
		{...rest}
		{id}
		{name}
		{value}
		type="radio"
		class="db-radio__control sr-only"
		checked={isChecked}
		disabled={isDisabled}
		{onchange}
	/>
	<span class="db-radio__circle" aria-hidden="true"></span>
	{#if children || description}
		<span class="db-radio__text">
			{#if children}<span class="db-radio__label">{@render children()}</span>{/if}
			{#if description}<span class="db-radio__description">{description}</span>{/if}
		</span>
	{/if}
</label>

<style>
	.db-radio {
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
	.db-radio[data-size='sm'] {
		--_size: 1rem;
		font-size: var(--text-xs);
	}
	.db-radio[data-disabled] {
		cursor: not-allowed;
		color: var(--color-text-disabled);
	}
	.db-radio__circle {
		position: relative;
		flex: none;
		width: var(--_size);
		height: var(--_size);
		margin-top: calc((1em * var(--leading-snug) - var(--_size)) / 2);
		border: var(--control-border-width) solid var(--color-border-strong);
		border-radius: var(--radius-full);
		background: var(--color-surface);
		transition: var(--transition-colors);
	}
	.db-radio__circle::after {
		content: '';
		position: absolute;
		inset: 0;
		margin: auto;
		width: 40%;
		height: 40%;
		border-radius: var(--radius-full);
		background: var(--color-accent-fg);
		transform: scale(0);
		transition: transform var(--duration-fast) var(--ease-spring);
	}
	.db-radio:hover:not([data-disabled]) .db-radio__circle {
		border-color: var(--color-text-subtle);
	}
	.db-radio__control:checked + .db-radio__circle {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}
	.db-radio__control:checked + .db-radio__circle::after {
		transform: scale(1);
	}
	.db-radio__control:focus-visible + .db-radio__circle {
		box-shadow: var(--focus-ring);
	}
	.db-radio[data-invalid] .db-radio__circle {
		border-color: var(--color-danger);
	}
	.db-radio[data-disabled] .db-radio__circle {
		background: var(--color-bg-subtle);
		border-color: var(--color-border);
	}
	.db-radio[data-disabled] .db-radio__control:checked + .db-radio__circle {
		background: var(--color-border-strong);
		border-color: var(--color-border-strong);
	}
	.db-radio__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	.db-radio__description {
		color: var(--color-text-muted);
	}
	.db-radio[data-disabled] .db-radio__description {
		color: var(--color-text-disabled);
	}
</style>
