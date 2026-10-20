<script lang="ts">
	import { CourtMap, Button, type CourtMarker, type CourtMarkerKind } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let markers = $state<CourtMarker[]>([
		{ id: 'me', kind: 'me', x: 7.2, y: 15.4 },
		{ id: 'partner', kind: 'partner', x: 3.1, y: 11.8 },
		{ id: 'correct', kind: 'correct', x: 7.0, y: 11.4 }
	]);
	let placing = $state<CourtMarkerKind>('me');
	let selected = $state<string | null>(null);

	function place(x: number, y: number) {
		const k = markers.findIndex((m) => m.id === placing);
		if (k >= 0) markers[k] = { ...markers[k], x, y };
		else markers.push({ id: placing, kind: placing, x, y });
	}
	function move(id: string, x: number, y: number) {
		const m = markers.find((k) => k.id === id);
		if (m) {
			m.x = x;
			m.y = y;
		}
	}

	// A month of mistakes for the heat view.
	const heat: CourtMarker[] = Array.from({ length: 40 }, (_, i) => {
		const cluster = i % 3;
		const cx = cluster === 0 ? 7 : cluster === 1 ? 3 : 5;
		const cy = cluster === 0 ? 15 : cluster === 1 ? 11.5 : 17.5;
		const jitter = () => (Math.sin(i * 12.9898 + cluster) * 43758.5453) % 1;
		return {
			id: `h${i}`,
			kind: 'point',
			tone: cluster === 1 ? 'neutral' : 'warning',
			x: cx + jitter() * 2 - 1,
			y: cy + ((jitter() * 7) % 1) * 2 - 1
		};
	});
</script>

<h1>CourtMap</h1>
<p class="lead">
	A padel court to scale. Tap to place, drag to move, arrows to nudge; coordinates are metres, so a
	season of moments is one heat map. Built for Daybook's padel journal.
</p>

<Demo
	title="Logging a moment"
	stack
	code={`<CourtMap mode="edit" placing="me" {markers} arrows={[{ from: 'me', to: 'correct' }]} onPlace={place} onMove={move} />`}
>
	<div class="row">
		<span>Tap places:</span>
		{#each ['me', 'partner', 'correct'] as k (k)}
			<Button
				size="sm"
				variant={placing === k ? 'solid' : 'outline'}
				tone="neutral"
				onclick={() => (placing = k as CourtMarkerKind)}>{k}</Button
			>
		{/each}
	</div>
	<CourtMap
		mode="edit"
		{placing}
		{markers}
		{selected}
		arrows={[{ from: 'me', to: 'correct' }]}
		onPlace={place}
		onMove={move}
		onSelect={(id) => (selected = id)}
		width={300}
	/>
	<p>
		{#each markers as m (m.id)}<code>{m.id} {m.x},{m.y}</code>&nbsp;{/each}
	</p>
</Demo>

<Demo
	title="Reading a session"
	code={`<CourtMap {markers} arrows={[{ from: 'me', to: 'correct' }]} width={240} />`}
>
	<CourtMap {markers} arrows={[{ from: 'me', to: 'correct' }]} width={240} />
</Demo>

<Demo title="A month of mistakes" code={`<CourtMap markers={heat} heat width={240} />`}>
	<CourtMap markers={heat} heat width={240} label="Heat map of 40 mistakes" />
</Demo>

<PropsTable
	rows={[
		{
			name: 'markers',
			type: 'CourtMarker[]',
			default: '[]',
			description: '{ id, x, y, kind?, tone?, label?, title? } in court metres.'
		},
		{
			name: 'arrows',
			type: 'CourtArrow[]',
			default: '[]',
			description: '{ from, to, tone?, dashed? }; marker ids or {x, y}.'
		},
		{ name: 'mode', type: "'edit' | 'view'", default: "'view'" },
		{
			name: 'placing',
			type: 'CourtMarkerKind | null',
			default: 'null',
			description: 'What a tap on empty court places.'
		},
		{ name: 'selected', type: 'string | null', default: 'null' },
		{ name: 'heat', type: 'boolean', default: 'false' },
		{ name: 'width', type: 'number | string', default: "'100%'" },
		{ name: 'onPlace / onSelect / onMove', type: 'callbacks' },
		{ name: 'label', type: 'string', default: "'Padel court'" }
	]}
/>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
</style>
