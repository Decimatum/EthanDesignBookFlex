<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
		/** Visible label. Required for accessibility unless the control has its own aria-label. */
		label?: string;
		/** Helper text under the control. */
		hint?: string;
		/** Error message; when set the field is marked invalid and the message is announced. */
		error?: string;
		required?: boolean;
		disabled?: boolean;
		/** Use `fieldset` for groups of controls (radios, checkboxes); the label becomes a legend. */
		as?: 'div' | 'fieldset';
		/** Control id; generated when omitted. */
		id?: string;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { setFieldContext } from './context.js';

	let {
		label,
		hint,
		error,
		required = false,
		disabled = false,
		as = 'div',
		id: idProp,
		children,
		class: className,
		...rest
	}: FieldProps = $props();

	const generated = $props.id();
	const id = $derived(idProp ?? `db-field-${generated}`);
	const hintId = $derived(`${id}-hint`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived(
		[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
	);

	setFieldContext({
		get id() {
			return id;
		},
		get describedBy() {
			return describedBy;
		},
		get invalid() {
			return Boolean(error);
		},
		get required() {
			return required;
		},
		get disabled() {
			return disabled;
		}
	});
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-field', className]}
	data-invalid={error ? true : undefined}
	data-disabled={disabled || undefined}
	disabled={as === 'fieldset' && disabled ? true : undefined}
	aria-describedby={as === 'fieldset' ? describedBy : undefined}
>
	{#if label}
		{#if as === 'fieldset'}
			<legend class="db-field__label">
				{label}{#if required}<span class="db-field__required" aria-hidden="true">*</span>{/if}
			</legend>
		{:else}
			<label class="db-field__label" for={id}>
				{label}{#if required}<span class="db-field__required" aria-hidden="true">*</span>{/if}
			</label>
		{/if}
	{/if}
	<div class="db-field__control">
		{#if children}{@render children()}{/if}
	</div>
	{#if error}
		<p class="db-field__error" id={errorId} role="alert">{error}</p>
	{:else if hint}
		<p class="db-field__hint" id={hintId}>{hint}</p>
	{/if}
</svelte:element>

<style>
	.db-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1-5);
		min-width: 0;
		margin: 0;
		padding: 0;
		border: none;
	}
	.db-field__label {
		font-family: var(--font-body);
		margin: 0;
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--color-text);
		line-height: var(--leading-snug);
		padding: 0;
	}
	/* legend sits outside the flex flow, so it needs its own gap */
	legend.db-field__label {
		margin-block-end: var(--space-1-5);
	}
	.db-field[data-disabled] .db-field__label {
		color: var(--color-text-disabled);
	}
	.db-field__required {
		color: var(--color-danger-text);
		margin-inline-start: 0.2em;
	}
	.db-field__control {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-width: 0;
	}
	.db-field__hint,
	.db-field__error {
		margin: 0;
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
	}
	.db-field__hint {
		color: var(--color-text-muted);
	}
	.db-field__error {
		color: var(--color-danger-text);
	}
</style>
