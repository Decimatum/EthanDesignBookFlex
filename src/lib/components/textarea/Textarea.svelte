<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	export interface TextareaProps extends Omit<HTMLTextareaAttributes, 'value'> {
		value?: string | null;
		invalid?: boolean;
		/** Grow with content instead of scrolling. */
		autoResize?: boolean;
		class?: string;
	}
</script>

<script lang="ts">
	import { getFieldContext } from '../field/context.js';

	let {
		value = $bindable(''),
		invalid,
		autoResize = false,
		disabled,
		required,
		rows = 3,
		id: idProp,
		class: className,
		...rest
	}: TextareaProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-textarea-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);

	let el = $state<HTMLTextAreaElement | null>(null);

	function fit(node: HTMLTextAreaElement) {
		node.style.height = 'auto';
		node.style.height = `${node.scrollHeight}px`;
	}

	$effect(() => {
		if (!el) return;
		if (!autoResize) {
			el.style.removeProperty('height');
			return;
		}
		const node = el;
		void value; // re-run on every edit
		fit(node);
		// Width, font and density changes all alter the wrapped line count; re-measure for each.
		const ro = new ResizeObserver(() => fit(node));
		ro.observe(node);
		document.fonts?.ready.then(() => fit(node));
		return () => ro.disconnect();
	});
</script>

<textarea
	{...rest}
	bind:this={el}
	{id}
	{rows}
	class={['db-textarea', className]}
	bind:value
	disabled={isDisabled}
	required={isRequired}
	aria-invalid={isInvalid || undefined}
	aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
	data-invalid={isInvalid || undefined}
	data-auto-resize={autoResize || undefined}></textarea>

<style>
	.db-textarea {
		--_border: var(--color-border-strong);
		display: block;
		width: 100%;
		min-height: var(--control-h-md);
		padding: var(--input-py) var(--control-px-md);
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--control-text-md);
		line-height: var(--leading-normal);
		resize: vertical;
		transition: var(--transition-colors);
	}
	.db-textarea[data-auto-resize] {
		resize: none;
		overflow: hidden;
	}
	.db-textarea::placeholder {
		color: var(--color-text-subtle);
	}
	.db-textarea:hover:not(:disabled) {
		--_border: var(--color-text-subtle);
	}
	.db-textarea:focus-visible {
		--_border: var(--color-focus);
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-textarea[data-invalid] {
		--_border: var(--color-danger);
	}
	.db-textarea[data-invalid]:focus-visible {
		box-shadow:
			0 0 0 2px var(--color-bg),
			0 0 0 4px var(--color-danger);
	}
	.db-textarea:disabled {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
</style>
