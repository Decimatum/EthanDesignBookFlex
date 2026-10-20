<script lang="ts" module>
	export interface SliderProps {
		/** Bindable value: a number, or `[low, high]` for a range. */
		value?: number | number[];
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		size?: 'sm' | 'md';
		/** Visible label above the track; also the accessible name. */
		label?: string;
		/** Show the current value(s) beside the label. */
		showValue?: boolean;
		/** Format the displayed value, e.g. `(v) => `${v}%``. */
		format?: (value: number) => string;
		/** Evenly spaced tick marks under the track. */
		ticks?: number;
		/** Accessible name for the thumb(s) when there is no visible label. */
		'aria-label'?: string;
		/** Form field name; hidden inputs are rendered for native submission. */
		name?: string;
		onValueChange?: (value: number | number[]) => void;
		/** Fires when the user releases the thumb. */
		onValueCommit?: (value: number | number[]) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { Slider as Bits } from 'bits-ui';
	import { getFieldContext } from '../field/context.js';
	import { cn } from '../../utils/index.js';

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		size = 'md',
		label,
		showValue = false,
		format = (v) => String(v),
		ticks = 0,
		'aria-label': ariaLabel,
		name,
		onValueChange,
		onValueCommit,
		class: className
	}: SliderProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const labelId = $derived(label ? `db-slider-label-${own}` : field?.labelId);
	const isDisabled = $derived(disabled || (field?.disabled ?? false));
	const multiple = $derived(Array.isArray(value));
	const shown = $derived(Array.isArray(value) ? value.map(format).join(' – ') : format(value));
	const span = $derived(max - min || 1);
	const tickValues = $derived(
		ticks > 1 ? Array.from({ length: ticks }, (_, i) => min + (span * i) / (ticks - 1)) : []
	);
	const thumbName = (i: number) =>
		labelId ? undefined : (ariaLabel ?? (multiple ? (i === 0 ? 'Minimum' : 'Maximum') : 'Value'));
</script>

<div class={cn('db-slider', className)} data-size={size} data-disabled={isDisabled || undefined}>
	{#if label || showValue}
		<div class="db-slider__meta">
			{#if label}<span class="db-slider__label" id={labelId}>{label}</span>{/if}
			{#if showValue}<span class="db-slider__value">{shown}</span>{/if}
		</div>
	{/if}

	{#snippet track(thumbItems: { index: number }[])}
		<span class="db-slider__track">
			<Bits.Range class="db-slider__range" />
		</span>
		{#each thumbItems as { index } (index)}
			<Bits.Thumb
				{index}
				class="db-slider__thumb"
				aria-labelledby={labelId}
				aria-label={thumbName(index)}
				aria-describedby={field?.describedBy}
			/>
		{/each}
		{#if tickValues.length}
			<span class="db-slider__ticks" aria-hidden="true">
				{#each tickValues as t, i (i)}
					<span class="db-slider__tick" style:left="{((t - min) / span) * 100}%"></span>
				{/each}
			</span>
		{/if}
	{/snippet}

	{#if Array.isArray(value)}
		<Bits.Root
			type="multiple"
			bind:value={value as number[]}
			{min}
			{max}
			{step}
			disabled={isDisabled}
			onValueChange={(v) => onValueChange?.(v)}
			onValueCommit={(v) => onValueCommit?.(v)}
			class="db-slider__root"
			data-ticks={tickValues.length || undefined}
		>
			{#snippet children({ thumbItems })}
				{@render track(thumbItems)}
			{/snippet}
		</Bits.Root>
		{#if name}
			{#each value as v, i (i)}<input type="hidden" name="{name}[]" value={v} />{/each}
		{/if}
	{:else}
		<Bits.Root
			type="single"
			bind:value={value as number}
			{min}
			{max}
			{step}
			disabled={isDisabled}
			onValueChange={(v) => onValueChange?.(v)}
			onValueCommit={(v) => onValueCommit?.(v)}
			class="db-slider__root"
			data-ticks={tickValues.length || undefined}
		>
			{#snippet children({ thumbItems })}
				{@render track(thumbItems)}
			{/snippet}
		</Bits.Root>
		{#if name}<input type="hidden" {name} {value} />{/if}
	{/if}
</div>

<style>
	.db-slider {
		--_track: 0.25rem;
		--_thumb: 1.125rem;
		display: grid;
		gap: var(--space-2);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text);
	}
	.db-slider[data-size='sm'] {
		--_track: 0.1875rem;
		--_thumb: 0.875rem;
	}
	.db-slider__meta {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		line-height: var(--leading-snug);
	}
	.db-slider__label {
		font-weight: var(--weight-medium);
	}
	.db-slider__value {
		margin-inline-start: auto; /* stays right-aligned even when a Field supplies the label */
		color: var(--color-text-muted);
		font-variant-numeric: var(--font-numeric);
	}
	.db-slider :global(.db-slider__root) {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: var(--_thumb);
		touch-action: none;
		user-select: none;
	}
	.db-slider :global(.db-slider__root[data-ticks]) {
		margin-block-end: var(--space-3);
	}
	.db-slider__track {
		position: relative;
		width: 100%;
		height: var(--_track);
		border-radius: var(--radius-full);
		background: var(--color-component);
		overflow: hidden;
	}
	.db-slider :global(.db-slider__range) {
		position: absolute;
		inset-block: 0;
		background: var(--color-accent);
	}
	.db-slider :global(.db-slider__thumb) {
		position: absolute;
		width: var(--_thumb);
		height: var(--_thumb);
		border-radius: var(--radius-full);
		background: var(--color-surface);
		border: 2px solid var(--color-accent);
		box-shadow: var(--shadow-sm);
		cursor: grab;
		transition:
			var(--transition-colors),
			box-shadow var(--duration-fast) var(--ease-standard);
	}
	.db-slider :global(.db-slider__thumb:hover) {
		background: var(--color-accent-subtle);
	}
	.db-slider :global(.db-slider__thumb:active) {
		cursor: grabbing;
	}
	.db-slider :global(.db-slider__thumb:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-slider__ticks {
		position: absolute;
		inset-inline: 0;
		top: calc(100% + var(--space-0-5));
		height: var(--space-1-5);
		pointer-events: none;
	}
	.db-slider__tick {
		position: absolute;
		width: 2px;
		height: 100%;
		border-radius: 1px;
		background: var(--color-text-subtle);
		transform: translateX(-50%);
	}
	.db-slider[data-disabled] {
		opacity: 0.55;
	}
	.db-slider[data-disabled] :global(.db-slider__thumb) {
		cursor: not-allowed;
	}
</style>
