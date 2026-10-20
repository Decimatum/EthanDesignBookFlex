<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type NumberInputSize = 'sm' | 'md' | 'lg';
	export type NumberInputFormat = 'plain' | 'decimal' | 'currency' | 'percent';
	export type NumberInputControls = 'stacked' | 'split' | 'none';

	export interface NumberInputProps extends Omit<
		HTMLInputAttributes,
		'size' | 'value' | 'type' | 'min' | 'max' | 'step'
	> {
		/** Bindable. `null` when the field is empty. */
		value?: number | null;
		min?: number;
		max?: number;
		/** Increment for the arrows and buttons. Also sets the default `precision`. */
		step?: number;
		/** Decimal places the value is rounded to on commit. Defaults to the decimals in `step`. */
		precision?: number;
		/**
		 * How the committed value is displayed while the field is not focused. Editing always
		 * shows the plain number. `decimal` adds grouping; `currency` and `percent` use `Intl`.
		 */
		format?: NumberInputFormat;
		currency?: string;
		locale?: string;
		/** Increment / decrement buttons: chevrons stacked at the end, split either side, or none. */
		controls?: NumberInputControls;
		size?: NumberInputSize;
		/** Marks the control invalid. Inherited from Field when omitted. */
		invalid?: boolean;
		/** Name of the hidden input that carries the numeric value in a form. */
		name?: string;
		/** Icon or text before the value (decorative). */
		leading?: Snippet;
		/** Icon or text after the value (decorative). */
		trailing?: Snippet;
		/** Called after the value changes, with the committed number (or `null`). */
		onValueChange?: (value: number | null) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { ChevronUp, ChevronDown, Minus, Plus } from '@lucide/svelte';
	import { getFieldContext } from '../field/context.js';

	let {
		value = $bindable(null),
		min,
		max,
		step = 1,
		precision,
		format = 'plain',
		currency = 'USD',
		locale,
		controls = 'stacked',
		size = 'md',
		invalid,
		disabled,
		required,
		readonly,
		name,
		id: idProp,
		leading,
		trailing,
		onValueChange,
		class: className,
		placeholder,
		...rest
	}: NumberInputProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-number-input-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);

	const decimals = $derived(precision ?? decimalsOf(step));
	const formatter = $derived.by(() => {
		const opts: Intl.NumberFormatOptions = {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		};
		if (format === 'currency') Object.assign(opts, { style: 'currency', currency });
		if (format === 'percent') Object.assign(opts, { style: 'percent' });
		if (format === 'plain') opts.useGrouping = false;
		return new Intl.NumberFormat(locale, opts);
	});
	// Which characters the locale uses, so pasted "1.234,5" parses in de-DE and "1,234.5" in en-US.
	const separators = $derived.by(() => {
		const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
		return {
			group: parts.find((p) => p.type === 'group')?.value ?? ',',
			decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.'
		};
	});

	function decimalsOf(n: number) {
		const s = String(n);
		const e = s.indexOf('e-');
		if (e >= 0) return Number(s.slice(e + 2));
		const d = s.indexOf('.');
		return d >= 0 ? s.length - d - 1 : 0;
	}
	function round(n: number) {
		const f = 10 ** decimals;
		return Math.round(n * f) / f;
	}
	function clamp(n: number) {
		if (min !== undefined && n < min) n = min;
		if (max !== undefined && n > max) n = max;
		return n;
	}
	/** Display when not editing: formatted; `percent` formats the value as-is (50 → "50%"). */
	function display(n: number | null) {
		if (n === null || Number.isNaN(n)) return '';
		return formatter.format(format === 'percent' ? n / 100 : n);
	}
	/** Plain, unformatted text for editing. */
	function editable(n: number | null) {
		if (n === null || Number.isNaN(n)) return '';
		return String(round(n)).replace('.', separators.decimal);
	}
	/** Parse whatever the user typed or pasted. Tolerates grouping, currency symbols, %, spaces. */
	function parse(text: string): number | null {
		let t = text.trim();
		if (!t) return null;
		t = t.replace(/[−]/g, '-');
		// Drop everything except digits, sign and the two separators.
		const keep = new RegExp(
			`[^0-9\\-${escape(separators.group)}${escape(separators.decimal)}]`,
			'g'
		);
		t = t.replace(keep, '');
		t = t.split(separators.group).join('');
		t = t.replace(separators.decimal, '.');
		const n = Number(t);
		return Number.isFinite(n) ? n : null;
	}
	function escape(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	let editing = $state(false);
	// Seeded so the formatted value is in the server-rendered HTML, not only after hydration.
	let text = $state(display(value));
	// When the value changes from outside while not editing, re-render the formatted text.
	$effect(() => {
		if (!editing) text = display(value);
	});

	function commit(next: number | null) {
		const v = next === null ? null : round(clamp(next));
		if (v !== value) {
			value = v;
			onValueChange?.(v);
		}
		text = editing ? editable(v) : display(v);
	}
	function nudge(direction: 1 | -1, multiplier = 1) {
		if (isDisabled || readonly) return;
		if (value === null) {
			// From empty, land on the nearest sensible anchor rather than on 0 ± step.
			commit(min ?? (max !== undefined && max < 0 ? max : direction * step));
			return;
		}
		commit(value + direction * step * multiplier);
	}

	function onfocus() {
		editing = true;
		text = editable(value);
	}
	function onblur() {
		editing = false;
		commit(parse(text));
	}
	function oninput(e: Event) {
		text = (e.currentTarget as HTMLInputElement).value;
		// Commit as the user types so bind:value is live, but don't reformat under the caret.
		const n = parse(text);
		const v = n === null ? null : round(clamp(n));
		if (v !== value) {
			value = v;
			onValueChange?.(v);
		}
	}
	function onkeydown(e: KeyboardEvent) {
		if (isDisabled || readonly) return;
		const big = e.shiftKey ? 10 : 1;
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				nudge(1, big);
				break;
			case 'ArrowDown':
				e.preventDefault();
				nudge(-1, big);
				break;
			case 'PageUp':
				e.preventDefault();
				nudge(1, 10);
				break;
			case 'PageDown':
				e.preventDefault();
				nudge(-1, 10);
				break;
			case 'Home':
				if (min !== undefined) {
					e.preventDefault();
					commit(min);
				}
				break;
			case 'End':
				if (max !== undefined) {
					e.preventDefault();
					commit(max);
				}
				break;
			case 'Enter':
				commit(parse(text));
				break;
		}
	}

	// Press-and-hold on the buttons repeats after a short delay.
	let holdTimer: ReturnType<typeof setTimeout> | undefined;
	let repeatTimer: ReturnType<typeof setInterval> | undefined;
	function startHold(direction: 1 | -1) {
		nudge(direction);
		stopHold();
		holdTimer = setTimeout(() => {
			repeatTimer = setInterval(() => nudge(direction), 60);
		}, 400);
	}
	function stopHold() {
		clearTimeout(holdTimer);
		clearInterval(repeatTimer);
		holdTimer = repeatTimer = undefined;
	}
	$effect(() => () => stopHold());

	const atMin = $derived(min !== undefined && value !== null && value <= min);
	const atMax = $derived(max !== undefined && value !== null && value >= max);
</script>

{#snippet stepButton(direction: 1 | -1, label: string, Icon: typeof ChevronUp)}
	<button
		type="button"
		class="db-number-input__step"
		data-direction={direction > 0 ? 'up' : 'down'}
		tabindex="-1"
		aria-hidden="true"
		disabled={isDisabled || readonly || (direction > 0 ? atMax : atMin)}
		title={label}
		onpointerdown={(e) => {
			// Keep focus in the input so arrow keys keep working after a click.
			e.preventDefault();
			if (e.button === 0) startHold(direction);
		}}
		onpointerup={stopHold}
		onpointerleave={stopHold}
		onpointercancel={stopHold}
	>
		<Icon />
	</button>
{/snippet}

<div
	class={['db-number-input', className]}
	data-size={size}
	data-controls={controls}
	data-invalid={isInvalid || undefined}
	data-disabled={isDisabled || undefined}
	data-readonly={readonly || undefined}
>
	{#if controls === 'split'}{@render stepButton(-1, 'Decrease', Minus)}{/if}
	{#if leading}<span class="db-number-input__adornment" aria-hidden="true">{@render leading()}</span
		>{/if}
	<input
		{...rest}
		{id}
		type="text"
		role="spinbutton"
		inputmode={decimals > 0 || (min !== undefined && min < 0) ? 'decimal' : 'numeric'}
		autocomplete="off"
		class="db-number-input__control"
		value={text}
		{placeholder}
		disabled={isDisabled}
		{readonly}
		required={isRequired}
		aria-invalid={isInvalid || undefined}
		aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value ?? undefined}
		aria-valuetext={value === null ? undefined : display(value)}
		{onfocus}
		{onblur}
		{oninput}
		{onkeydown}
	/>
	{#if trailing}<span class="db-number-input__adornment" aria-hidden="true"
			>{@render trailing()}</span
		>{/if}
	{#if controls === 'split'}
		{@render stepButton(1, 'Increase', Plus)}
	{:else if controls === 'stacked'}
		<span class="db-number-input__stack">
			{@render stepButton(1, 'Increase', ChevronUp)}
			{@render stepButton(-1, 'Decrease', ChevronDown)}
		</span>
	{/if}
	{#if name}<input type="hidden" {name} value={value ?? ''} />{/if}
</div>

<style>
	.db-number-input {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
		--_border: var(--color-border-strong);

		display: inline-flex;
		align-items: stretch;
		width: 100%;
		height: var(--_h);
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--_fs);
		transition: var(--transition-colors);
		min-width: 0;
		overflow: hidden;
	}
	.db-number-input:hover:not([data-disabled]) {
		--_border: var(--color-text-subtle);
	}
	.db-number-input:focus-within {
		--_border: var(--color-focus);
		box-shadow: var(--focus-ring);
	}
	.db-number-input[data-invalid] {
		--_border: var(--color-danger);
	}
	.db-number-input[data-invalid]:focus-within {
		box-shadow:
			0 0 0 2px var(--color-bg),
			0 0 0 4px var(--color-danger);
	}
	.db-number-input[data-disabled] {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-number-input[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	.db-number-input[data-size='lg'] {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}

	.db-number-input__control {
		flex: 1;
		min-width: 0;
		height: 100%;
		padding: 0 var(--_px);
		background: none;
		border: none;
		outline: none;
		color: inherit;
		font: inherit;
		font-variant-numeric: var(--font-numeric);
		text-align: end;
	}
	.db-number-input[data-controls='split'] .db-number-input__control {
		text-align: center;
	}
	.db-number-input__control:focus-visible {
		box-shadow: none;
	}
	.db-number-input__control::placeholder {
		color: var(--color-text-subtle);
	}
	.db-number-input__control:disabled {
		cursor: not-allowed;
	}
	.db-number-input__adornment {
		display: inline-flex;
		align-items: center;
		flex: none;
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}
	.db-number-input__adornment:first-child,
	.db-number-input__step + .db-number-input__adornment {
		padding-inline-start: var(--_px);
	}
	.db-number-input__adornment:last-child,
	.db-number-input__adornment:has(+ .db-number-input__step),
	.db-number-input__adornment:has(+ .db-number-input__stack) {
		padding-inline-end: var(--_px);
	}
	.db-number-input__control + .db-number-input__adornment {
		margin-inline-start: calc(var(--_px) * -0.5);
	}
	.db-number-input__adornment + .db-number-input__control {
		padding-inline-start: calc(var(--_px) * 0.5);
	}
	.db-number-input__adornment :global(svg) {
		width: 1.1em;
		height: 1.1em;
	}

	/* Steppers */
	.db-number-input__stack {
		display: flex;
		flex-direction: column;
		flex: none;
		width: calc(var(--_h) * 0.7);
		border-inline-start: 1px solid var(--color-border);
	}
	.db-number-input__step {
		display: inline-grid;
		place-items: center;
		flex: none;
		min-width: 0;
		padding: 0;
		border: none;
		background: var(--color-bg-subtle);
		color: var(--color-text-muted);
		cursor: pointer;
		touch-action: manipulation;
		user-select: none;
		transition: var(--transition-colors);
	}
	.db-number-input__stack .db-number-input__step {
		flex: 1;
		min-height: 0;
	}
	.db-number-input__stack .db-number-input__step + .db-number-input__step {
		border-block-start: 1px solid var(--color-border);
	}
	.db-number-input[data-controls='split'] .db-number-input__step {
		width: var(--_h);
	}
	.db-number-input[data-controls='split'] .db-number-input__step[data-direction='down'] {
		border-inline-end: 1px solid var(--color-border);
	}
	.db-number-input[data-controls='split'] .db-number-input__step[data-direction='up'] {
		border-inline-start: 1px solid var(--color-border);
	}
	.db-number-input__step:hover:not(:disabled) {
		background: var(--color-component-hover);
		color: var(--color-text);
	}
	.db-number-input__step:active:not(:disabled) {
		background: var(--color-component-active);
	}
	.db-number-input__step:disabled {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-number-input__step :global(svg) {
		width: 1em;
		height: 1em;
	}
	.db-number-input__stack .db-number-input__step :global(svg) {
		width: 0.85em;
		height: 0.85em;
	}
</style>
