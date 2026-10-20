<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TimeGridTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

	/** One block on the grid. Times are instants (ISO strings or Dates), shown in the browser's zone. */
	export interface TimeGridEvent {
		id: string;
		start: string | Date;
		end: string | Date;
		title: string;
		/** Second line: type, place… */
		meta?: string;
		tone?: TimeGridTone;
		/** Struck through and muted. */
		cancelled?: boolean;
		/** Anything the caller wants back from onSelect. */
		data?: unknown;
	}

	export interface TimeGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** ISO dates of the columns, in order (1–7). */
		days: string[];
		events?: TimeGridEvent[];
		/** First and last hour shown (24 h). */
		hourFrom?: number;
		hourTo?: number;
		/** Height of one hour; any CSS length. */
		hourHeight?: string;
		/** Instant for the "now" line; omit to hide it. */
		now?: Date;
		/** ISO date to mark as today; defaults to the device's date. */
		today?: string;
		/** Minutes a tap on empty space snaps to. */
		slotMinutes?: 15 | 30 | 60;
		/** Month and weekday names. */
		locale?: string;
		/** Accessible name of the grid. */
		label?: string;
		onSelect?: (event: TimeGridEvent) => void;
		/** A tap on empty space: the day and the "HH:MM" it landed on. */
		onCreate?: (day: string, time: string) => void;
		/** Replace the block's content. */
		event?: Snippet<[TimeGridEvent]>;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		days,
		events = [],
		hourFrom = 6,
		hourTo = 23,
		hourHeight = '3.5rem',
		now,
		today,
		slotMinutes = 30,
		locale,
		label = 'Schedule',
		onSelect,
		onCreate,
		event: eventSnippet,
		class: className,
		...rest
	}: TimeGridProps = $props();

	const pad = (n: number) => String(n).padStart(2, '0');
	const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	const toDate = (v: string | Date) => (v instanceof Date ? v : new Date(v));
	const todayIso = $derived(today ?? isoOf(new Date()));
	const minutesShown = $derived((hourTo - hourFrom) * 60);
	const hours = $derived(Array.from({ length: hourTo - hourFrom }, (_, i) => hourFrom + i));
	const slotsPerDay = $derived(minutesShown / slotMinutes);

	const dayFmt = $derived(new Intl.DateTimeFormat(locale, { weekday: 'short' }));
	const dateFmt = $derived(new Intl.DateTimeFormat(locale, { day: 'numeric' }));
	const longFmt = $derived(
		new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
	);
	const timeFmt = $derived(new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }));
	const hourFmt = $derived(new Intl.DateTimeFormat(locale, { hour: 'numeric' }));
	const dayDate = (iso: string) => {
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d);
	};
	const clockOf = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
	const hourLabel = (h: number) => hourFmt.format(new Date(2000, 0, 1, h));

	/** A block laid out in its column: minutes from the top, length, lane and lane count. */
	interface Placed {
		ev: TimeGridEvent;
		top: number;
		len: number;
		lane: number;
		lanes: number;
		start: Date;
		end: Date;
	}

	// Place every event in its day; overlapping ones share the width in lanes.
	const placedByDay = $derived.by(() => {
		const out: Record<string, Placed[]> = {};
		for (const day of days) out[day] = [];
		for (const ev of events) {
			const start = toDate(ev.start);
			const end = toDate(ev.end);
			const day = isoOf(start);
			const col = out[day];
			if (!col) continue;
			const startMin = start.getHours() * 60 + start.getMinutes() - hourFrom * 60;
			const endMin = Math.min(
				minutesShown,
				Math.max(startMin + 15, (end.getTime() - dayDate(day).getTime()) / 60000 - hourFrom * 60)
			);
			const top = Math.max(0, startMin);
			if (top >= minutesShown || endMin <= 0) continue;
			col.push({ ev, top, len: endMin - top, lane: 0, lanes: 1, start, end });
		}
		for (const col of Object.values(out)) {
			col.sort((a, b) => a.top - b.top || b.len - a.len);
			// Sweep: a cluster is a run of blocks that transitively overlap; lanes are assigned greedily within it.
			let cluster: Placed[] = [];
			let laneEnds: number[] = [];
			let clusterEnd = -1;
			const close = () => {
				for (const p of cluster) p.lanes = laneEnds.length;
				cluster = [];
				laneEnds = [];
			};
			for (const p of col) {
				if (p.top >= clusterEnd) close();
				let lane = laneEnds.findIndex((e) => e <= p.top);
				if (lane === -1) {
					lane = laneEnds.length;
					laneEnds.push(0);
				}
				laneEnds[lane] = p.top + p.len;
				p.lane = lane;
				cluster.push(p);
				clusterEnd = Math.max(clusterEnd, p.top + p.len);
			}
			close();
		}
		return out;
	});

	const nowTop = $derived.by(() => {
		if (!now) return null;
		const min = now.getHours() * 60 + now.getMinutes() - hourFrom * 60;
		return min < 0 || min > minutesShown ? null : { day: isoOf(now), min };
	});

	// Open scrolled to an hour before now (or the first event), not to the top of the morning.
	let root = $state<HTMLDivElement | null>(null);
	$effect(() => {
		const el = root;
		if (!el || typeof window === 'undefined') return;
		const hourPx =
			parseFloat(getComputedStyle(el).getPropertyValue('--_hour')) *
				parseFloat(getComputedStyle(el).fontSize) || 56;
		let target = now ? now.getHours() - 1 : NaN;
		if (Number.isNaN(target)) {
			const first = Math.min(...events.map((e) => toDate(e.start).getHours()));
			target = Number.isFinite(first) ? first - 1 : hourFrom;
		}
		el.scrollTop = Math.max(0, target - hourFrom) * hourPx;
	});

	const eventLabel = (p: Placed) =>
		`${p.ev.title}, ${timeFmt.format(p.start)} to ${timeFmt.format(p.end)}${p.ev.meta ? `, ${p.ev.meta}` : ''}${p.ev.cancelled ? ', cancelled' : ''}`;
</script>

<div
	{...rest}
	bind:this={root}
	class={['db-time-grid', className]}
	role="grid"
	aria-label={label}
	data-cols={days.length}
	style="--_hour: {hourHeight}; --_cols: {days.length}; --_n-hours: {hourTo - hourFrom}"
>
	<div class="db-time-grid__head" role="row">
		<div class="db-time-grid__corner" role="columnheader" aria-hidden="true"></div>
		{#each days as day (day)}
			<div class="db-time-grid__day" role="columnheader" data-today={day === todayIso || undefined}>
				<span class="db-time-grid__weekday">{dayFmt.format(dayDate(day))}</span>
				<span class="db-time-grid__date">{dateFmt.format(dayDate(day))}</span>
			</div>
		{/each}
	</div>
	<div class="db-time-grid__body" role="row">
		<div class="db-time-grid__hours" role="rowheader" aria-hidden="true">
			{#each hours as h (h)}
				<span class="db-time-grid__hour">{hourLabel(h)}</span>
			{/each}
		</div>
		{#each days as day (day)}
			<div class="db-time-grid__col" role="gridcell" data-today={day === todayIso || undefined}>
				{#if onCreate}
					<div class="db-time-grid__slots">
						{#each { length: slotsPerDay }, i (i)}
							<button
								type="button"
								class="db-time-grid__slot"
								aria-label="Add on {longFmt.format(dayDate(day))} at {timeFmt.format(
									new Date(
										2000,
										0,
										1,
										hourFrom + Math.floor((i * slotMinutes) / 60),
										(i * slotMinutes) % 60
									)
								)}"
								onclick={() => onCreate?.(day, clockOf(hourFrom * 60 + i * slotMinutes))}
							></button>
						{/each}
					</div>
				{/if}
				{#each placedByDay[day] ?? [] as p (p.ev.id)}
					<button
						type="button"
						class="db-time-grid__event"
						data-tone={p.ev.tone ?? 'accent'}
						data-cancelled={p.ev.cancelled || undefined}
						data-short={p.len < 40 || undefined}
						style="--_top: {p.top}; --_len: {p.len}; --_lane: {p.lane}; --_lanes: {p.lanes}"
						aria-label={eventLabel(p)}
						onclick={() => onSelect?.(p.ev)}
					>
						{#if eventSnippet}
							{@render eventSnippet(p.ev)}
						{:else}
							<span class="db-time-grid__event-title">{p.ev.title}</span>
							<span class="db-time-grid__event-time"
								>{timeFmt.format(p.start)}{#if p.ev.meta}
									· {p.ev.meta}{/if}</span
							>
						{/if}
					</button>
				{/each}
				{#if nowTop && nowTop.day === day}
					<span class="db-time-grid__now" style="--_top: {nowTop.min}" aria-hidden="true"></span>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.db-time-grid {
		--_hours-w: 3.25rem;
		--_col-min: 6.5rem;
		position: relative;
		overflow: auto;
		color: var(--color-text);
		font-size: var(--text-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}
	/* Few columns (a phone's three days) fit the width instead of scrolling sideways. */
	.db-time-grid[data-cols='1'],
	.db-time-grid[data-cols='2'],
	.db-time-grid[data-cols='3'] {
		--_col-min: 4rem;
	}
	.db-time-grid__head,
	.db-time-grid__body {
		padding-top: 0.75em; /* room for the first hour label, which sits on its line */
		display: grid;
		grid-template-columns: var(--_hours-w) repeat(var(--_cols), minmax(var(--_col-min), 1fr));
		min-width: max-content;
	}
	.db-time-grid__head {
		position: sticky;
		top: 0;
		z-index: 3;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}
	.db-time-grid__day {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-0-5);
		padding: var(--space-2) var(--space-1);
		border-left: 1px solid var(--color-border);
	}
	.db-time-grid__weekday {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.db-time-grid__date {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-full);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.db-time-grid__day[data-today] .db-time-grid__date {
		background: var(--color-accent);
		color: var(--color-accent-fg);
	}
	.db-time-grid__hours {
		position: relative;
		height: calc((var(--_hour)) * var(--_n-hours, 1));
	}
	.db-time-grid__hour {
		display: block;
		height: var(--_hour);
		padding-right: var(--space-2);
		text-align: right;
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		transform: translateY(-0.6em);
	}
	.db-time-grid__col {
		position: relative;
		border-left: 1px solid var(--color-border);
		background-image: repeating-linear-gradient(
			to bottom,
			var(--color-border) 0 1px,
			transparent 1px var(--_hour)
		);
		background-size: 100% var(--_hour);
	}
	.db-time-grid__col[data-today] {
		background-color: var(--color-bg-subtle);
	}
	.db-time-grid__slots {
		display: flex;
		flex-direction: column;
	}
	.db-time-grid__slot {
		all: unset;
		box-sizing: border-box;
		display: block;
		height: calc(var(--_hour) / 2);
		cursor: pointer;
	}
	.db-time-grid__slot:hover {
		background: var(--color-component-hover);
	}
	.db-time-grid__slot:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: -2px;
	}
	/* The column's height comes from the slots when present, else from the hours. */
	.db-time-grid__col:not(:has(.db-time-grid__slots)) {
		min-height: calc(var(--_hour) * var(--_n-hours, 1));
	}
	.db-time-grid__event {
		all: unset;
		box-sizing: border-box;
		position: absolute;
		top: calc(var(--_top) / 60 * var(--_hour));
		height: calc(var(--_len) / 60 * var(--_hour) - 2px);
		left: calc(var(--_lane) / var(--_lanes) * 100% + 2px);
		width: calc(100% / var(--_lanes) - 4px);
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: var(--space-1) var(--space-1-5);
		overflow: hidden;
		border-left: 3px solid var(--_tone);
		border-radius: var(--radius-sm);
		background: var(--_tone-bg);
		color: var(--_tone-fg);
		cursor: pointer;
		z-index: 1;
		transition: box-shadow var(--duration-fast) var(--ease-standard);
	}
	.db-time-grid__event:hover {
		box-shadow: var(--shadow-sm);
		z-index: 2;
	}
	.db-time-grid__event:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: 1px;
		z-index: 2;
	}
	.db-time-grid__event[data-tone='accent'] {
		--_tone: var(--color-accent);
		--_tone-bg: var(--color-accent-subtle);
		--_tone-fg: var(--color-accent-text);
	}
	.db-time-grid__event[data-tone='info'] {
		--_tone: var(--color-info);
		--_tone-bg: var(--color-info-subtle);
		--_tone-fg: var(--color-info-text);
	}
	.db-time-grid__event[data-tone='success'] {
		--_tone: var(--color-success);
		--_tone-bg: var(--color-success-subtle);
		--_tone-fg: var(--color-success-text);
	}
	.db-time-grid__event[data-tone='warning'] {
		--_tone: var(--color-warning);
		--_tone-bg: var(--color-warning-subtle);
		--_tone-fg: var(--color-warning-text);
	}
	.db-time-grid__event[data-tone='danger'] {
		--_tone: var(--color-danger);
		--_tone-bg: var(--color-danger-subtle);
		--_tone-fg: var(--color-danger-text);
	}
	.db-time-grid__event[data-tone='neutral'] {
		--_tone: var(--color-border-strong);
		--_tone-bg: var(--color-component);
		--_tone-fg: var(--color-text);
	}
	.db-time-grid__event[data-cancelled] {
		--_tone-bg: var(--color-surface);
		border-left-style: dashed;
		color: var(--color-text-muted);
	}
	.db-time-grid__event[data-cancelled] .db-time-grid__event-title {
		text-decoration: line-through;
	}
	.db-time-grid__event-title {
		font-weight: 600;
		line-height: 1.25;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.db-time-grid__event-time {
		font-size: var(--text-xs);
		opacity: 0.85;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.db-time-grid__event[data-short] {
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		padding-block: 0;
	}
	.db-time-grid__event[data-short] .db-time-grid__event-time {
		display: none;
	}
	.db-time-grid__now {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(var(--_top) / 60 * var(--_hour));
		height: 0;
		border-top: 2px solid var(--color-danger);
		z-index: 2;
		pointer-events: none;
	}
	.db-time-grid__now::before {
		content: '';
		position: absolute;
		left: -4px;
		top: -4px;
		width: 6px;
		height: 6px;
		border-radius: var(--radius-full);
		background: var(--color-danger);
	}
</style>
