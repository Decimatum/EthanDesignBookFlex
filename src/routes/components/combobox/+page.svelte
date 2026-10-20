<script lang="ts">
	import { Combobox, Field, Text, Stack } from '$lib/index.js';
	import { Search } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	const tickers = [
		{ value: 'msft', label: 'Microsoft', group: 'Tech', keywords: 'MSFT' },
		{ value: 'aapl', label: 'Apple', group: 'Tech', keywords: 'AAPL' },
		{ value: 'nvda', label: 'NVIDIA', group: 'Tech', keywords: 'NVDA' },
		{ value: 'asml', label: 'ASML Holding', group: 'Tech', keywords: 'ASML' },
		{ value: 'jpm', label: 'JPMorgan Chase', group: 'Finance', keywords: 'JPM' },
		{ value: 'gs', label: 'Goldman Sachs', group: 'Finance', keywords: 'GS' },
		{ value: 'v', label: 'Visa', group: 'Finance', keywords: 'V' },
		{ value: 'xom', label: 'Exxon Mobil', group: 'Energy', keywords: 'XOM' },
		{ value: 'cvx', label: 'Chevron', group: 'Energy', keywords: 'CVX' },
		{ value: 'gone', label: 'Delisted Corp', group: 'Energy', disabled: true }
	];
	let ticker = $state('nvda');
	let watchlist = $state<string[]>(['msft', 'jpm']);
</script>

<h1>Combobox</h1>
<p class="lead">A searchable select: type to filter, pick one — or several, as chips.</p>

<Demo
	title="Single, inside a Field"
	stack
	code={`<Field label="Ticker" hint="Type a name or symbol">
	<Combobox items={tickers} bind:value={ticker} name="ticker" />
</Field>`}
>
	<Field label="Ticker" hint="Type a name or symbol — groups and keywords are searched too">
		<Combobox items={tickers} bind:value={ticker} name="ticker" placeholder="Find a ticker">
			{#snippet leading()}<Search />{/snippet}
		</Combobox>
	</Field>
	<Text size="sm" tone="muted">Selected: <code>{ticker || '—'}</code></Text>
</Demo>

<Demo
	title="Multiple"
	stack
	code={`<Combobox items={tickers} bind:value={watchlist} multiple aria-label="Watchlist" placeholder="Add symbols…" />`}
>
	<Combobox
		items={tickers}
		bind:value={watchlist}
		multiple
		aria-label="Watchlist"
		placeholder="Add symbols…"
	/>
	<Text size="sm" tone="muted">Watchlist: {watchlist.join(', ') || 'empty'}</Text>
</Demo>

<Demo
	title="Sizes and states"
	stack
	code={`<Combobox size="sm" … />
<Field label="Sector" error="Pick at least one"><Combobox … /></Field>`}
>
	<Stack gap="4">
		<Combobox items={tickers} size="sm" aria-label="Small" placeholder="Small" />
		<Field label="Sector" error="Pick a sector to continue">
			<Combobox items={tickers} placeholder="Invalid" />
		</Field>
		<Field label="Locked" disabled>
			<Combobox items={tickers} value="aapl" />
		</Field>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{
			name: 'items',
			type: 'ComboboxItem[]',
			description: 'Required: value, label, disabled?, group?, keywords?.'
		},
		{ name: 'value', type: 'string | string[]', description: 'Bindable; array when multiple.' },
		{ name: 'multiple', type: 'boolean', default: 'false' },
		{ name: 'placeholder', type: 'string', default: "'Search…'" },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'invalid / disabled / required', type: 'boolean', default: 'from Field' },
		{ name: 'name', type: 'string', description: 'Hidden input(s) for forms.' },
		{ name: 'emptyText', type: 'string', default: "'No matches'" },
		{ name: 'filter', type: '(item, query) => boolean', description: 'Custom matcher.' },
		{ name: 'onValueChange', type: '(value) => void' },
		{ name: 'leading', type: 'Snippet', description: 'Icon before the text.' }
	]}
/>
