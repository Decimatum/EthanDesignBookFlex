<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';

	export interface RadioGroupProps extends Omit<HTMLFieldsetAttributes, 'disabled'> {
		/** Selected value. */
		value?: string;
		/** Form field name shared by the radios; generated when omitted. */
		name?: string;
		/** Group label, rendered as the legend. */
		label?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		orientation?: 'vertical' | 'horizontal';
		/** Called after the value changes. */
		onValueChange?: (value: string) => void;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { setRadioGroupContext } from './context.js';

	let {
		value = $bindable(),
		name: nameProp,
		label,
		hint,
		error,
		required = false,
		disabled = false,
		orientation = 'vertical',
		onValueChange,
		children,
		class: className,
		...rest
	}: RadioGroupProps = $props();

	const own = $props.id();
	const name = $derived(nameProp ?? `db-radio-${own}`);
	const hintId = `db-radio-${own}-hint`;
	const errorId = `db-radio-${own}-error`;
	const describedBy = $derived(
		[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
	);

	setRadioGroupContext({
		get name() {
			return name;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get invalid() {
			return Boolean(error);
		},
		get describedBy() {
			return describedBy;
		},
		select(v) {
			value = v;
			onValueChange?.(v);
		}
	});
</script>

<fieldset
	{...rest}
	class={['db-radio-group', className]}
	{disabled}
	data-orientation={orientation}
	data-invalid={error ? true : undefined}
>
	{#if label}
		<legend class="db-radio-group__legend">
			{label}{#if required}<span class="db-radio-group__required" aria-hidden="true">*</span>{/if}
		</legend>
	{/if}
	<div
		class="db-radio-group__items"
		role="radiogroup"
		aria-label={label}
		aria-required={required || undefined}
		aria-invalid={error ? true : undefined}
		aria-describedby={describedBy}
	>
		{#if children}{@render children()}{/if}
	</div>
	{#if error}
		<p class="db-radio-group__error" id={errorId} role="alert">{error}</p>
	{:else if hint}
		<p class="db-radio-group__hint" id={hintId}>{hint}</p>
	{/if}
</fieldset>

<style>
	.db-radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		border: none;
		min-width: 0;
	}
	.db-radio-group__legend {
		padding: 0;
		margin-block-end: var(--space-1);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--color-text);
	}
	.db-radio-group:disabled .db-radio-group__legend {
		color: var(--color-text-disabled);
	}
	.db-radio-group__required {
		color: var(--color-danger-text);
		margin-inline-start: 0.2em;
	}
	.db-radio-group__items {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.db-radio-group[data-orientation='horizontal'] .db-radio-group__items {
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
	.db-radio-group__hint,
	.db-radio-group__error {
		margin: 0;
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
	}
	.db-radio-group__hint {
		color: var(--color-text-muted);
	}
	.db-radio-group__error {
		color: var(--color-danger-text);
	}
</style>
