<script lang="ts">
	import { Calendar, type CalendarMarks } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let day = $state('2026-10-13');
	let month = $state('');
	const marks: CalendarMarks = {
		'2026-10-06': [{ label: 'morning' }, { label: 'night' }],
		'2026-10-07': [{ label: 'morning' }, { label: 'night' }, { tone: 'success', label: 'padel' }],
		'2026-10-08': [{ label: 'night' }, { tone: 'success', label: 'padel' }],
		'2026-10-10': [
			{ label: 'morning' },
			{ label: 'night' },
			{ tone: 'warning', label: 'big purchase' }
		],
		'2026-10-11': [{ tone: 'neutral', label: 'work log' }],
		'2026-10-12': [{ label: 'morning' }, { label: 'night' }],
		'2026-10-13': [{ label: 'night' }, { tone: 'success', label: 'padel' }],
		'2026-10-25': [{ tone: 'info', label: 'weekly review' }]
	};
</script>

<h1>Calendar</h1>
<p class="lead">
	A month grid that shows as well as picks: up to three dots per day, ISO strings in and out. The
	same grid sits inside <a href="/components/date-picker/">DatePicker</a>.
</p>

<Demo
	title="With marks"
	stack
	code={`<Calendar bind:value={day} {marks} weekStartsOn={1} today="2026-10-13" />`}
>
	<Calendar bind:value={day} bind:month {marks} today="2026-10-13" />
	<p>
		Selected <code>{day || '—'}</code>{#if month}
			· showing <code>{month.slice(0, 7)}</code>{/if}
	</p>
</Demo>

<Demo
	title="Read-only, week starts Sunday"
	code={`<Calendar value="2026-10-13" readonly weekStartsOn={0} />`}
>
	<Calendar value="2026-10-13" today="2026-10-13" readonly weekStartsOn={0} {marks} />
</Demo>

<Demo title="Bounded" code={`<Calendar minValue="2026-10-05" maxValue="2026-10-20" />`}>
	<Calendar value="2026-10-13" today="2026-10-13" minValue="2026-10-05" maxValue="2026-10-20" />
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'string', default: "''", description: 'Bindable ISO date.' },
		{ name: 'month', type: 'string', description: 'Bindable; the month shown.' },
		{
			name: 'marks',
			type: 'CalendarMarks',
			default: '{}',
			description: "{ 'YYYY-MM-DD': [{ tone?, label }] }"
		},
		{ name: 'today', type: 'string', default: 'device date' },
		{ name: 'weekStartsOn', type: '0–6', default: '1' },
		{ name: 'minValue / maxValue', type: 'string' },
		{ name: 'fixedWeeks', type: 'boolean', default: 'true' },
		{ name: 'readonly', type: 'boolean', default: 'false' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'label', type: 'string', default: "'Calendar'" },
		{ name: 'onValueChange', type: '(value: string) => void' },
		{ name: 'onMonthChange', type: '(month: string) => void' }
	]}
/>
