<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export type RatingSize = 'sm' | 'md';

	export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		/** Bindable. 0 means not rated. */
		value?: number;
		/** Number of steps (1…max). */
		max?: number;
		size?: RatingSize;
		/** Short labels per step, from 1; shown as the step's tooltip and read by screen readers. */
		labels?: string[];
		readonly?: boolean;
		disabled?: boolean;
		/** Form field name; a hidden input carries the value. */
		name?: string;
		/** Accessible name when not inside a Field. */
		'aria-label'?: string;
		onchange?: (value: number) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { getFieldContext } from '../field/context.js';

	let {
		value = $bindable(0),
		max = 5,
		size = 'md',
		labels,
		readonly = false,
		disabled,
		name,
		'aria-label': ariaLabel,
		onchange,
		class: className,
		...rest
	}: RatingProps = $props();

	const field = getFieldContext();
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const inert = $derived(isDisabled || readonly);
	const steps = $derived(Array.from({ length: Math.max(1, max) }, (_, i) => i + 1));

	let hover = $state(0);
	let root = $state<HTMLDivElement | null>(null);

	function set(n: number) {
		if (inert) return;
		const next = n === value ? 0 : n; // tapping the current step clears it
		if (next !== value) {
			value = next;
			onchange?.(value);
		}
	}

	/** Arrows move the value; digits set it; 0, Backspace and Delete clear it. */
	function onkeydown(e: KeyboardEvent) {
		if (inert) return;
		let next: number | null = null;
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				next = Math.min(max, value + 1);
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				next = Math.max(0, value - 1);
				break;
			case 'Home':
				next = 1;
				break;
			case 'End':
				next = max;
				break;
			case '0':
			case 'Backspace':
			case 'Delete':
				next = 0;
				break;
			default:
				if (/^[1-9]$/.test(e.key) && Number(e.key) <= max) next = Number(e.key);
		}
		if (next === null) return;
		e.preventDefault();
		if (next !== value) {
			value = next;
			onchange?.(value);
		}
		// Keep focus on the step that now holds the value (or the first, when cleared).
		const buttons = root?.querySelectorAll<HTMLButtonElement>('button');
		buttons?.[Math.max(0, next - 1)]?.focus();
	}

	const shown = $derived(hover || value);
</script>

<div
	{...rest}
	bind:this={root}
	class={['db-rating', className]}
	role="radiogroup"
	data-size={size}
	data-readonly={readonly || undefined}
	data-disabled={isDisabled || undefined}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabel ? undefined : field?.labelId}
	aria-describedby={field?.describedBy}
	aria-disabled={isDisabled || undefined}
	aria-readonly={readonly || undefined}
	{onkeydown}
	onmouseleave={() => (hover = 0)}
>
	{#each steps as n (n)}
		<button
			type="button"
			role="radio"
			class="db-rating__step"
			aria-checked={value === n}
			aria-label={labels?.[n - 1] ? `${n} — ${labels[n - 1]}` : String(n)}
			title={labels?.[n - 1]}
			tabindex={n === Math.max(1, value) ? 0 : -1}
			disabled={isDisabled}
			data-filled={n <= shown || undefined}
			data-current={n === value || undefined}
			onclick={() => set(n)}
			onmouseenter={() => !inert && (hover = n)}
			onfocus={() => (hover = 0)}
		>
			<span class="db-rating__number" aria-hidden="true">{n}</span>
		</button>
	{/each}
	{#if name}<input type="hidden" {name} value={value || ''} />{/if}
</div>

<style>
	.db-rating {
		--_h: var(--control-h-md);
		--_fs: var(--control-text-md);
		display: inline-flex;
		gap: var(--space-1);
	}
	.db-rating[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_fs: var(--control-text-sm);
	}
	.db-rating__step {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--_h);
		height: var(--_h);
		padding: 0;
		border: var(--control-border-width) solid var(--color-border-strong);
		border-radius: var(--control-radius);
		background: var(--color-surface);
		color: var(--color-text-muted);
		font-family: var(--font-body);
		font-size: var(--_fs);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.db-rating__step[data-filled] {
		background: var(--color-accent-subtle);
		border-color: var(--color-accent-border);
		color: var(--color-accent-text);
	}
	.db-rating__step[data-current] {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-accent-fg);
		font-weight: 600;
	}
	.db-rating__step:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-rating[data-readonly] .db-rating__step {
		cursor: default;
	}
	.db-rating__step:disabled {
		cursor: not-allowed;
		color: var(--color-text-disabled);
		background: var(--color-bg-subtle);
	}
	.db-rating__step:disabled[data-filled] {
		background: var(--color-component);
		border-color: var(--color-border);
		color: var(--color-text-disabled);
	}
</style>
