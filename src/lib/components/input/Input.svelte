<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type InputSize = 'sm' | 'md' | 'lg';

	export interface InputProps extends Omit<HTMLInputAttributes, 'size' | 'value'> {
		value?: string | number | null;
		size?: InputSize;
		/** Marks the control invalid (aria-invalid + danger border). Inherited from Field when omitted. */
		invalid?: boolean;
		/** Tabular numerals; use for amounts and codes. */
		numeric?: boolean;
		/** Icon or text before the value. */
		leading?: Snippet;
		/** Icon or text after the value. */
		trailing?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { getFieldContext } from '../field/context.js';

	let {
		value = $bindable(''),
		size = 'md',
		invalid,
		numeric = false,
		disabled,
		required,
		id: idProp,
		type = 'text',
		leading,
		trailing,
		class: className,
		...rest
	}: InputProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-input-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);
</script>

<div
	class={['db-input', className]}
	data-size={size}
	data-invalid={isInvalid || undefined}
	data-disabled={isDisabled || undefined}
	data-numeric={numeric || undefined}
>
	{#if leading}<span class="db-input__adornment" aria-hidden="true">{@render leading()}</span>{/if}
	<input
		{...rest}
		{id}
		{type}
		class="db-input__control"
		bind:value
		disabled={isDisabled}
		required={isRequired}
		aria-invalid={isInvalid || undefined}
		aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
	/>
	{#if trailing}<span class="db-input__adornment" aria-hidden="true">{@render trailing()}</span
		>{/if}
</div>

<style>
	.db-input {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
		--_border: var(--color-border-strong);

		display: flex;
		align-items: center;
		gap: var(--space-2);
		height: var(--_h);
		padding-inline: var(--_px);
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--_fs);
		transition: var(--transition-colors);
		min-width: 0;
	}
	.db-input:hover:not([data-disabled]) {
		--_border: var(--color-text-subtle);
	}
	.db-input:focus-within {
		--_border: var(--color-focus);
		box-shadow: var(--focus-ring);
	}
	.db-input[data-invalid] {
		--_border: var(--color-danger);
	}
	.db-input[data-invalid]:focus-within {
		box-shadow:
			0 0 0 2px var(--color-bg),
			0 0 0 4px var(--color-danger);
	}
	.db-input[data-disabled] {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-input[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	.db-input[data-size='lg'] {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}
	.db-input[data-numeric] .db-input__control {
		font-variant-numeric: var(--font-numeric);
	}
	.db-input__control {
		flex: 1;
		min-width: 0;
		height: 100%;
		background: none;
		border: none;
		outline: none;
		padding: 0;
		color: inherit;
		font: inherit;
	}
	/* The wrapper draws the ring via :focus-within; suppress the global one on the control. */
	.db-input__control:focus-visible {
		box-shadow: none;
	}
	.db-input__control::placeholder {
		color: var(--color-text-subtle);
	}
	.db-input__control:disabled {
		cursor: not-allowed;
	}
	.db-input__adornment {
		display: inline-flex;
		align-items: center;
		flex: none;
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}
	.db-input__adornment :global(svg) {
		width: 1.1em;
		height: 1.1em;
	}
</style>
