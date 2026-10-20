<script lang="ts" module>
	import type { DateValue } from '@internationalized/date';

	export type CalendarMarkTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

	export interface CalendarMark {
		tone?: CalendarMarkTone;
		/** Read by screen readers as part of the day's name, e.g. "night entry". */
		label: string;
	}

	/** Marks keyed by ISO date (`YYYY-MM-DD`). Up to three dots are drawn per day. */
	export type CalendarMarks = Record<string, CalendarMark[]>;

	export interface CalendarBodyProps {
		months: Array<{ value: DateValue; weeks: DateValue[][] }>;
		weekdays: string[];
		marks?: CalendarMarks;
		/** ISO date to ring as "today". */
		today?: string;
	}
</script>

<!--
	The month grid shared by Calendar and DatePicker. Both Bits roots provide the same
	calendar context, and Bits re-exports the grid parts under both names, so one body
	serves both: it must be rendered inside a Calendar.Root or a DatePicker.Calendar.
-->
<script lang="ts">
	import { Calendar as Bits } from 'bits-ui';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	let { months, weekdays, marks = {}, today }: CalendarBodyProps = $props();

	function marksFor(date: DateValue): CalendarMark[] {
		return marks[date.toString()] ?? [];
	}
	/** The marks as an aria-description, so the dots are not colour-only. */
	function describe(date: DateValue): Record<string, string> {
		const m = marksFor(date);
		return m.length ? { 'aria-description': m.map((x) => x.label).join(', ') } : {};
	}
</script>

<Bits.Header class="db-calendar__header">
	<Bits.PrevButton class="db-calendar__nav" aria-label="Previous month"
		><ChevronLeft aria-hidden="true" /></Bits.PrevButton
	>
	<Bits.Heading class="db-calendar__heading" />
	<Bits.NextButton class="db-calendar__nav" aria-label="Next month"
		><ChevronRight aria-hidden="true" /></Bits.NextButton
	>
</Bits.Header>
<div class="db-calendar__months">
	{#each months as month (month.value.toString())}
		<Bits.Grid class="db-calendar__grid">
			<Bits.GridHead>
				<Bits.GridRow class="db-calendar__row">
					{#each weekdays as day, di (di)}
						<Bits.HeadCell class="db-calendar__weekday">{day.slice(0, 2)}</Bits.HeadCell>
					{/each}
				</Bits.GridRow>
			</Bits.GridHead>
			<Bits.GridBody>
				{#each month.weeks as week, wi (wi)}
					<Bits.GridRow class="db-calendar__row">
						{#each week as date (date.toString())}
							<Bits.Cell {date} month={month.value} class="db-calendar__cell">
								<Bits.Day
									class="db-calendar__day"
									data-today={today === date.toString() || undefined}
									{...describe(date)}
								>
									{#snippet children({ day })}
										<span class="db-calendar__number">{day}</span>
										{#if marksFor(date).length}
											<span class="db-calendar__marks" aria-hidden="true">
												{#each marksFor(date).slice(0, 3) as mark, i (i)}
													<span class="db-calendar__mark" data-tone={mark.tone ?? 'accent'}></span>
												{/each}
											</span>
										{/if}
									{/snippet}
								</Bits.Day>
							</Bits.Cell>
						{/each}
					</Bits.GridRow>
				{/each}
			</Bits.GridBody>
		</Bits.Grid>
	{/each}
</div>

<style>
	:global(.db-calendar__header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}
	:global(.db-calendar__heading) {
		font-weight: 600;
		font-size: var(--text-md);
		color: var(--color-text);
	}
	:global(.db-calendar__nav) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		border: 0;
		border-radius: var(--control-radius);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
	}
	:global(.db-calendar__nav svg) {
		width: 1.1em;
		height: 1.1em;
	}
	:global(.db-calendar__nav:hover) {
		background: var(--color-component-hover);
		color: var(--color-text);
	}
	:global(.db-calendar__nav:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	:global(.db-calendar__nav:disabled) {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-calendar__months {
		display: flex;
		gap: var(--space-6);
	}
	:global(.db-calendar__grid) {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}
	:global(.db-calendar__weekday) {
		padding-bottom: var(--space-1);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-text-muted);
		text-align: center;
	}
	:global(.db-calendar__cell) {
		padding: 1px;
		text-align: center;
	}
	:global(.db-calendar__day) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		width: 100%;
		min-width: var(--control-h-sm);
		aspect-ratio: 1;
		min-height: var(--control-h-md);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		transition: var(--transition-colors);
	}
	:global(.db-calendar__day:hover) {
		background: var(--color-component-hover);
	}
	:global(.db-calendar__day:focus-visible) {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	:global(.db-calendar__day[data-outside-month]) {
		color: var(--color-text-subtle);
	}
	:global(.db-calendar__day[data-disabled]),
	:global(.db-calendar__day[data-unavailable]) {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	:global(.db-calendar__day[data-today]) {
		box-shadow: inset 0 0 0 1px var(--color-accent-border);
	}
	:global(.db-calendar__day[data-selected]) {
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-weight: 600;
	}
	:global(.db-calendar__day[data-selected] .db-calendar__mark) {
		background: var(--color-accent-fg);
	}
	.db-calendar__marks {
		display: flex;
		gap: 2px;
		height: 4px;
	}
	.db-calendar__mark {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--color-accent);
	}
	.db-calendar__mark[data-tone='neutral'] {
		background: var(--color-text-subtle);
	}
	.db-calendar__mark[data-tone='success'] {
		background: var(--color-success);
	}
	.db-calendar__mark[data-tone='warning'] {
		background: var(--color-warning);
	}
	.db-calendar__mark[data-tone='danger'] {
		background: var(--color-danger);
	}
	.db-calendar__mark[data-tone='info'] {
		background: var(--color-info);
	}
</style>
