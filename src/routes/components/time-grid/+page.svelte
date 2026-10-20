<script lang="ts">
	import { TimeGrid, type TimeGridEvent } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	// A fixed week so the screenshots are stable.
	const days = [
		'2026-10-19',
		'2026-10-20',
		'2026-10-21',
		'2026-10-22',
		'2026-10-23',
		'2026-10-24',
		'2026-10-25'
	];
	const at = (d: string, h: number, m = 0) => {
		const [y, mo, da] = d.split('-').map(Number);
		return new Date(y, mo - 1, da, h, m);
	};
	const events: TimeGridEvent[] = [
		{
			id: '1',
			start: at(days[0], 9),
			end: at(days[0], 10),
			title: 'Ah Boy',
			meta: 'Swimming · Pool A',
			tone: 'info'
		},
		{
			id: '2',
			start: at(days[0], 9, 30),
			end: at(days[0], 11),
			title: 'Mei Ling',
			meta: 'Programming · condo',
			tone: 'success'
		},
		{
			id: '3',
			start: at(days[0], 10, 15),
			end: at(days[0], 10, 45),
			title: 'Call back parent',
			tone: 'neutral'
		},
		{
			id: '4',
			start: at(days[1], 18),
			end: at(days[1], 19),
			title: 'Raj',
			meta: 'Swimming · Pool A',
			tone: 'info',
			cancelled: true
		},
		{
			id: '5',
			start: at(days[2], 7),
			end: at(days[2], 8, 30),
			title: 'Squad training',
			meta: 'Pool B',
			tone: 'warning'
		},
		{
			id: '6',
			start: at(days[3], 16),
			end: at(days[3], 17),
			title: 'Ah Boy',
			meta: 'Swimming · Pool A',
			tone: 'info'
		},
		{
			id: '7',
			start: at(days[3], 17, 30),
			end: at(days[3], 19),
			title: 'Mei Ling',
			meta: 'Programming',
			tone: 'success'
		},
		{
			id: '8',
			start: at(days[5], 10),
			end: at(days[5], 12),
			title: 'Open water',
			meta: 'East Coast',
			tone: 'accent'
		}
	];
	const now = at(days[0], 10, 20);
	let last = $state('');
	const many: TimeGridEvent[] = Array.from({ length: 1000 }, (_, i) => {
		const d = days[i % 7];
		const h = 6 + (i % 16);
		return {
			id: `m${i}`,
			start: at(d, h, (i * 7) % 60),
			end: at(d, h, ((i * 7) % 60) + 25),
			title: `Session ${i}`,
			tone: (['info', 'success', 'accent'] as const)[i % 3]
		};
	});
</script>

<h1>TimeGrid</h1>
<p class="lead">
	A week as hours down the side and sessions as blocks. Overlaps share the column, now is a red
	line, and a tap on empty space tells the caller where to add something.
</p>

<Demo
	title="A week"
	code={`<TimeGrid {days} {events} hourFrom={7} hourTo={21} now={now}
  onSelect={(e) => (last = e.title)}
  onCreate={(day, time) => (last = \`add on \${day} at \${time}\`)} />`}
>
	<div style="height: 32rem">
		<TimeGrid
			{days}
			{events}
			hourFrom={7}
			hourTo={21}
			{now}
			today={days[0]}
			onSelect={(e) => (last = e.title)}
			onCreate={(day, time) => (last = `add on ${day} at ${time}`)}
			style="height: 100%"
		/>
	</div>
	<p class="demo-note">Last action: <code>{last || '—'}</code></p>
</Demo>

<Demo
	title="Three days, read-only (a phone)"
	code={`<TimeGrid days={days.slice(0, 3)} {events} hourFrom={8} hourTo={20} />`}
>
	<div style="max-width: 24rem; height: 26rem">
		<TimeGrid
			days={days.slice(0, 3)}
			{events}
			hourFrom={8}
			hourTo={20}
			today={days[0]}
			style="height: 100%"
		/>
	</div>
</Demo>

<Demo
	title="Custom block content"
	code={`<TimeGrid {days} {events}>\n  {#snippet event(e)}<strong>{e.title}</strong>{/snippet}\n</TimeGrid>`}
>
	<div style="height: 18rem">
		<TimeGrid
			days={days.slice(0, 4)}
			{events}
			hourFrom={8}
			hourTo={12}
			today={days[0]}
			hourHeight="4rem"
			style="height: 100%"
		>
			{#snippet event(e)}<strong style="font-size: var(--text-xs)">{e.title}</strong>{/snippet}
		</TimeGrid>
	</div>
</Demo>

<Demo title="1,000 blocks" code={`<TimeGrid {days} events={many} slotMinutes={60} />`}>
	<div style="height: 20rem">
		<TimeGrid
			{days}
			events={many}
			hourFrom={6}
			hourTo={22}
			today={days[0]}
			slotMinutes={60}
			style="height: 100%"
		/>
	</div>
</Demo>

<PropsTable
	rows={[
		{
			name: 'days',
			type: 'string[]',
			description: 'ISO dates of the columns, in order (1–7). Required.'
		},
		{
			name: 'events',
			type: 'TimeGridEvent[]',
			default: '[]',
			description: '{ id, start, end, title, meta?, tone?, cancelled?, data? }'
		},
		{ name: 'hourFrom', type: 'number', default: '6' },
		{ name: 'hourTo', type: 'number', default: '23' },
		{ name: 'hourHeight', type: 'string', default: "'3.5rem'" },
		{ name: 'now', type: 'Date', description: 'Draws the now line; omit to hide it.' },
		{ name: 'today', type: 'string', default: "device's date" },
		{ name: 'slotMinutes', type: '15 | 30 | 60', default: '30' },
		{ name: 'locale', type: 'string', default: 'browser' },
		{ name: 'label', type: 'string', default: "'Schedule'" },
		{ name: 'onSelect', type: '(event) => void' },
		{ name: 'onCreate', type: '(day, time) => void', description: 'Omit for a read-only grid.' }
	]}
/>

<style>
	.demo-note {
		margin-top: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>
