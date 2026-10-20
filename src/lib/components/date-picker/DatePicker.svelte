<script lang="ts" module>
	import type { CalendarMarks } from '../calendar/CalendarBody.svelte';

	export interface DatePickerProps {
		/** Bindable ISO date (`YYYY-MM-DD`), or `''` for none. */
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
		/** Form field name; a hidden input carries the ISO value. */
		name?: string;
		id?: string;
		/** 0 = Sunday … 6 = Saturday. */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		minValue?: string;
		maxValue?: string;
		/** Dots in the pop-up calendar, as in Calendar. */
		marks?: CalendarMarks;
		/** ISO date to ring as today. Defaults to the device's date. */
		today?: string;
		locale?: string;
		/** Accessible name when not inside a Field. */
		'aria-label'?: string;
		onValueChange?: (value: string) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { DatePicker as Bits } from 'bits-ui';
	import { CalendarDays } from '@lucide/svelte';
	import {
		parseDate,
		today as todayIn,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { cn } from '../../utils/index.js';
	import { getFieldContext } from '../field/context.js';
	import CalendarBody from '../calendar/CalendarBody.svelte';

	let {
		value = $bindable(''),
		size = 'md',
		invalid,
		disabled,
		required,
		readonly = false,
		name,
		id: idProp,
		weekStartsOn = 1,
		minValue,
		maxValue,
		marks = {},
		today,
		locale,
		'aria-label': ariaLabel,
		onValueChange,
		class: className
	}: DatePickerProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-date-picker-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);

	const safe = (s?: string): DateValue | undefined => {
		if (!s) return undefined;
		try {
			return parseDate(s);
		} catch {
			return undefined;
		}
	};
	const todayISO = $derived(today ?? todayIn(getLocalTimeZone()).toString());
	const dv = $derived(safe(value));
</script>

<Bits.Root
	value={dv}
	onValueChange={(v) => {
		value = v ? v.toString() : '';
		onValueChange?.(value);
	}}
	placeholder={dv ?? parseDate(todayISO)}
	{weekStartsOn}
	weekdayFormat="short"
	minValue={safe(minValue)}
	maxValue={safe(maxValue)}
	disabled={isDisabled}
	required={isRequired}
	{readonly}
	{locale}
	granularity="day"
	fixedWeeks
	closeOnDateSelect
>
	<Bits.Input
		{id}
		{name}
		class={cn('db-date-picker', className)}
		data-size={size}
		data-invalid={isInvalid || undefined}
		aria-label={ariaLabel}
		aria-invalid={isInvalid || undefined}
		aria-describedby={field?.describedBy}
	>
		{#snippet children({ segments })}
			<span class="db-date-picker__segments">
				{#each segments as { part, value: segValue }, i (i)}
					{#if part === 'literal'}
						<span class="db-date-picker__literal" aria-hidden="true">{segValue}</span>
					{:else}
						<Bits.Segment {part} class="db-date-picker__segment">{segValue}</Bits.Segment>
					{/if}
				{/each}
			</span>
			<Bits.Trigger class="db-date-picker__trigger" aria-label="Open calendar">
				<CalendarDays aria-hidden="true" />
			</Bits.Trigger>
		{/snippet}
	</Bits.Input>
	<Bits.Portal>
		<Bits.Content class="db-date-picker__content" sideOffset={6} collisionPadding={8}>
			<Bits.Calendar class="db-calendar db-date-picker__calendar">
				{#snippet children({ months, weekdays })}
					<CalendarBody {months} {weekdays} {marks} today={todayISO} />
				{/snippet}
			</Bits.Calendar>
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-date-picker) {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
		--_border: var(--color-border-strong);
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		height: var(--_h);
		padding-inline: var(--_px) var(--space-1);
		box-sizing: border-box;
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--_fs);
		font-variant-numeric: tabular-nums;
		transition: var(--transition-colors);
	}
	:global(.db-date-picker[data-size='sm']) {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	:global(.db-date-picker[data-size='lg']) {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}
	:global(.db-date-picker:hover) {
		--_border: var(--color-text-subtle);
	}
	:global(.db-date-picker:focus-within) {
		--_border: var(--color-accent);
		box-shadow: var(--focus-ring);
	}
	:global(.db-date-picker[data-invalid]) {
		--_border: var(--color-danger);
	}
	:global(.db-date-picker[data-disabled]) {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-date-picker__segments {
		display: inline-flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}
	:global(.db-date-picker__segment) {
		padding: 0 1px;
		border-radius: 2px;
		outline: none;
	}
	:global(.db-date-picker__segment:focus) {
		background: var(--color-accent-subtle);
		color: var(--color-accent-text);
	}
	:global(.db-date-picker__segment[data-placeholder]) {
		color: var(--color-text-muted);
	}
	.db-date-picker__literal {
		color: var(--color-text-muted);
		padding: 0 1px;
	}
	:global(.db-date-picker__trigger) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(var(--_h) - 2 * var(--control-border-width) - var(--space-1));
		height: calc(var(--_h) - 2 * var(--control-border-width) - var(--space-1));
		border: 0;
		border-radius: calc(var(--control-radius) - 2px);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		flex: none;
	}
	:global(.db-date-picker__trigger svg) {
		width: 1.15em;
		height: 1.15em;
	}
	:global(.db-date-picker__trigger:hover) {
		background: var(--color-component-hover);
		color: var(--color-text);
	}
	:global(.db-date-picker__trigger:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	:global(.db-date-picker__content) {
		z-index: 50;
		padding: var(--space-3);
		background: var(--color-surface-overlay);
		border: 1px solid var(--color-border);
		border-radius: var(--control-radius);
		box-shadow: var(--shadow-overlay);
		width: 20rem;
		max-width: calc(100vw - 16px);
	}
	:global(.db-date-picker__content[data-state='open']) {
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-date-picker__content[data-state='closed']) {
		animation: db-pop-out var(--duration-fast) var(--ease-accelerate);
	}
	:global(.db-date-picker__calendar) {
		display: block;
		color: var(--color-text);
		font-family: var(--font-body);
	}
</style>
