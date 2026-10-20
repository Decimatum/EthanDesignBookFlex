<script lang="ts" module>
	import type { CalendarMarks } from './CalendarBody.svelte';

	export interface CalendarProps {
		/** Bindable ISO date (`YYYY-MM-DD`), or `''` for none. */
		value?: string;
		/** Bindable ISO date of the month being shown (any day in it). */
		month?: string;
		/** Dots under days, keyed by ISO date. */
		marks?: CalendarMarks;
		/** ISO date to ring as today. Defaults to the device's date. */
		today?: string;
		/** 0 = Sunday … 6 = Saturday. */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		minValue?: string;
		maxValue?: string;
		/** Six rows always, so the height never jumps between months. */
		fixedWeeks?: boolean;
		/** Show without taking a selection (a day still gets focus and `onDaySelect`). */
		readonly?: boolean;
		disabled?: boolean;
		locale?: string;
		/** Accessible name of the grid. */
		label?: string;
		onValueChange?: (value: string) => void;
		onMonthChange?: (month: string) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { Calendar as Bits } from 'bits-ui';
	import {
		parseDate,
		today as todayIn,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { cn } from '../../utils/index.js';
	import CalendarBody from './CalendarBody.svelte';

	let {
		value = $bindable(''),
		month = $bindable(''),
		marks = {},
		today,
		weekStartsOn = 1,
		minValue,
		maxValue,
		fixedWeeks = true,
		readonly = false,
		disabled = false,
		locale,
		label = 'Calendar',
		onValueChange,
		onMonthChange,
		class: className
	}: CalendarProps = $props();

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
	const placeholder = $derived(safe(month) ?? dv ?? parseDate(todayISO));
</script>

<Bits.Root
	type="single"
	value={dv}
	onValueChange={(v) => {
		value = v ? v.toString() : '';
		onValueChange?.(value);
	}}
	{placeholder}
	onPlaceholderChange={(p) => {
		month = p.toString();
		onMonthChange?.(month);
	}}
	{weekStartsOn}
	weekdayFormat="short"
	minValue={safe(minValue)}
	maxValue={safe(maxValue)}
	{fixedWeeks}
	{readonly}
	{disabled}
	{locale}
	calendarLabel={label}
	class={cn('db-calendar', className)}
>
	{#snippet children({ months, weekdays })}
		<CalendarBody {months} {weekdays} {marks} today={todayISO} />
	{/snippet}
</Bits.Root>

<style>
	:global(.db-calendar) {
		display: block;
		width: 100%;
		max-width: 26rem;
		color: var(--color-text);
		font-family: var(--font-body);
	}
</style>
