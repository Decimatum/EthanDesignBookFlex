<script lang="ts">
	import { Field, DatePicker } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let on = $state('2026-10-13');
	let empty = $state('');
	const marks = {
		'2026-10-17': [{ label: 'padel booked', tone: 'success' as const }],
		'2026-10-25': [{ label: 'weekly review', tone: 'info' as const }]
	};
</script>

<h1>DatePicker</h1>
<p class="lead">
	Type the date segment by segment, or open the calendar. ISO strings in and out; the pop-up is
	<a href="/components/calendar/">Calendar</a>'s grid, marks included.
</p>

<Demo
	title="In a field"
	code={`<Field label="Due on" hint="Leave empty for someday">
	<DatePicker bind:value={on} weekStartsOn={1} />
</Field>`}
>
	<Field label="Due on" hint="Leave empty for someday">
		<DatePicker bind:value={on} today="2026-10-13" {marks} />
	</Field>
	<p>Value: <code>{on || '—'}</code></p>
</Demo>

<Demo
	title="Empty, with bounds"
	code={`<DatePicker bind:value minValue="2026-10-01" maxValue="2026-12-31" />`}
>
	<Field label="Start"
		><DatePicker
			bind:value={empty}
			today="2026-10-13"
			minValue="2026-10-01"
			maxValue="2026-12-31"
		/></Field
	>
</Demo>

<Demo title="Sizes and states" code={`<DatePicker size="sm" value="2026-10-13" />`}>
	<DatePicker size="sm" value="2026-10-13" aria-label="Small" />
	<DatePicker size="lg" value="2026-10-13" aria-label="Large" />
	<Field label="Invalid" error="That day is before the start"
		><DatePicker value="2026-09-30" /></Field
	>
	<DatePicker value="2026-10-13" disabled aria-label="Disabled" />
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'string', default: "''", description: 'Bindable ISO date.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'invalid / disabled / required', type: 'boolean', default: 'from Field' },
		{ name: 'readonly', type: 'boolean', default: 'false' },
		{ name: 'name', type: 'string', description: 'Hidden input for forms.' },
		{ name: 'weekStartsOn', type: '0–6', default: '1' },
		{ name: 'minValue / maxValue', type: 'string' },
		{ name: 'marks', type: 'CalendarMarks', default: '{}' },
		{ name: 'today', type: 'string', default: 'device date' },
		{ name: 'onValueChange', type: '(value: string) => void' }
	]}
/>
