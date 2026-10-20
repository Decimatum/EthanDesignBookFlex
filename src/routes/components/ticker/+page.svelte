<script lang="ts">
	import { Ticker, Button, Inline, Stack, Switch, toast, type TickerItem } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	const base: TickerItem[] = [
		{ id: 'nvda', label: 'NVDA', value: 902.5, change: 1.24 },
		{ id: 'msft', label: 'MSFT', value: 412.3, change: 0.31 },
		{ id: 'aapl', label: 'AAPL', value: 189.9, change: -0.42 },
		{ id: 'tsm', label: 'TSM', value: 145.2, change: 2.05 },
		{ id: 'asml', label: 'ASML', value: 880.0, change: -1.1 },
		{ id: 'btc', label: 'BTC', value: 64210, change: 1850, changeFormat: 'currency' },
		{ id: 'us10y', label: 'US10Y', value: '4.28%', change: -0.03, changeFormat: 'number' }
	];
	let items = $state<TickerItem[]>(structuredClone(base));
	let live = $state(false);
	let paused = $state(false);

	// Simulated feed: nudge a random price every 700 ms while "live" is on.
	$effect(() => {
		if (!live) return;
		const id = setInterval(() => {
			const i = Math.floor(Math.random() * items.length);
			const item = items[i];
			if (typeof item.value !== 'number') return;
			const delta = (Math.random() - 0.5) * item.value * 0.004;
			const value = Math.round((item.value + delta) * 100) / 100;
			const change = Math.round(((item.change ?? 0) + (delta / item.value) * 100) * 100) / 100;
			items[i] = { ...item, value, change };
		}, 700);
		return () => clearInterval(id);
	});
</script>

<h1>Ticker</h1>
<p class="lead">
	A scrolling strip of labelled figures with a pause button. Pauses on hover and focus, flashes
	values that change, and becomes a plain scrollable row under reduced motion.
</p>

<Demo title="Basic" stack code={`<Ticker {items} label="Watchlist" />`}>
	<Ticker {items} label="Watchlist" bind:paused />
	<Inline gap="4">
		<Switch bind:checked={live} size="sm">Simulate live prices</Switch>
		<Button size="sm" variant="outline" tone="neutral" onclick={() => (paused = !paused)}>
			{paused ? 'Play' : 'Pause'} from outside
		</Button>
	</Inline>
</Demo>

<Demo
	title="Links, speed and direction"
	stack
	code={`<Ticker items={withLinks} speed={90} direction="right" size="sm" />`}
>
	<Stack gap="3">
		<Ticker
			items={base.map((i) => ({ ...i, href: `/patterns/dashboard/` }))}
			speed={90}
			direction="right"
			size="sm"
			label="Fast, small, links"
		/>
		<Ticker items={base.slice(0, 3)} speed={25} label="Few items still loop" />
	</Stack>
</Demo>

<Demo
	title="Clickable items"
	stack
	code={`<Ticker {items} onItemClick={(item) => select(item)} />`}
>
	<Ticker
		items={base}
		onItemClick={(item) => toast(`Open ${item.label}`, { description: `Last ${item.value}` })}
		label="Click an item"
	/>
</Demo>

<PropsTable
	rows={[
		{
			name: 'items',
			type: 'TickerItem[]',
			description: '{ id, label, value, change?, changeFormat?, href? }'
		},
		{ name: 'speed', type: 'number', default: '40', description: 'Pixels per second.' },
		{ name: 'direction', type: "'left' | 'right'", default: "'left'" },
		{ name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Also on focus.' },
		{ name: 'paused', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'controls', type: 'boolean', default: 'true', description: 'Pause / play button.' },
		{ name: 'label', type: 'string', default: "'Ticker'", description: 'Accessible name.' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'digits', type: 'number', default: '2' },
		{ name: 'locale / currency', type: 'string' },
		{ name: 'flash', type: 'boolean', default: 'true', description: 'Tint changed values.' },
		{ name: 'onItemClick', type: '(item: TickerItem) => void' }
	]}
/>
