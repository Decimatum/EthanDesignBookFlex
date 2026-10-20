<script lang="ts">
	import {
		AppShell,
		Nav,
		NavSection,
		NavItem,
		Stat,
		Grid,
		Table,
		Card,
		Badge,
		Button,
		Tabs,
		TabList,
		Tab,
		Progress,
		Heading,
		Text,
		Stack,
		Inline,
		Kbd,
		Delta,
		Ticker,
		type TableColumn,
		type SortState
	} from '$lib/index.js';
	import {
		LayoutDashboard,
		ListOrdered,
		History,
		Settings,
		Wallet,
		TrendingUp,
		Gauge,
		Bell
	} from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';

	interface Position {
		id: number;
		symbol: string;
		name: string;
		qty: number;
		price: number;
		pnl: number;
		weight: number;
	}
	const positions: Position[] = [
		{ id: 1, symbol: 'NVDA', name: 'NVIDIA', qty: 15, price: 902.5, pnl: 2610.75, weight: 22 },
		{ id: 2, symbol: 'MSFT', name: 'Microsoft', qty: 40, price: 412.3, pnl: 1184.0, weight: 18 },
		{ id: 3, symbol: 'TSM', name: 'Taiwan Semi', qty: 60, price: 145.2, pnl: 96.0, weight: 14 },
		{ id: 4, symbol: 'AAPL', name: 'Apple', qty: 120, price: 189.9, pnl: -342.6, weight: 25 },
		{ id: 5, symbol: 'ASML', name: 'ASML Holding', qty: 8, price: 880.0, pnl: -410.4, weight: 11 }
	];
	const money = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', header: 'Symbol', sortable: true },
		{ key: 'qty', header: 'Qty', numeric: true, sortable: true },
		{ key: 'price', header: 'Price', numeric: true, cell: price },
		{ key: 'pnl', header: 'P&L', numeric: true, sortable: true, cell: pnl },
		{ key: 'weight', header: 'Weight', cell: weight, width: '9rem' }
	];
	let sort = $state<SortState>({ key: 'pnl', direction: 'desc' });
	const tape = [
		{ id: 'spx', label: 'SPX', value: 5321.4, change: 0.42 },
		{ id: 'ndx', label: 'NDX', value: 18740.1, change: 0.88 },
		{ id: 'vix', label: 'VIX', value: 13.2, change: -4.1 },
		{ id: 'us10y', label: 'US10Y', value: '4.28%', change: -0.03, changeFormat: 'number' as const },
		{ id: 'dxy', label: 'DXY', value: 104.7, change: 0.12 },
		{ id: 'btc', label: 'BTC', value: 64210, change: 1.9 }
	];
	let range = $state('1d');
	let nav = $state('dashboard');
	const go = (id: string) => (e: Event) => {
		e.preventDefault();
		nav = id;
	};
</script>

{#snippet price(row: Position)}{money.format(row.price)}{/snippet}
{#snippet pnl(row: Position)}
	<Delta value={row.pnl} format="currency" arrow={false} />
{/snippet}
{#snippet weight(row: Position)}
	<Progress value={row.weight} size="sm" aria-label="{row.symbol} weight {row.weight}%" />
{/snippet}

<h1>Dashboard</h1>
<p class="lead">
	A trading dashboard assembled from the library: AppShell + Nav, a row of Stats, tabs over a
	sortable Table, and a side card. Everything here is the real components — copy the page as a
	starting point.
</p>

<Demo
	title="Live pattern"
	stack
	code={`<AppShell>
	{#snippet brand()}…{/snippet}
	{#snippet sidebar({ close })}<Nav current={page.url.pathname}>…</Nav>{/snippet}
	<Ticker items={tape} size="sm" />
	<Grid min="10rem" gap="4"> <Stat … /> ×3 </Grid>
	<Tabs bind:value={range}> … <Table {columns} {rows} bind:sort /> … </Tabs>
</AppShell>`}
>
	<div class="frame">
		<AppShell embedded mainId="dash-main" sidebarLabel="Dashboard navigation" sidebarWidth="13rem">
			{#snippet brand({ collapsed })}
				<span class="mark" aria-hidden="true">A</span>
				{#if !collapsed}<span>Acme Trading</span>{/if}
			{/snippet}
			{#snippet header()}
				<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Notifications">
					{#snippet leading()}<Bell />{/snippet}
				</Button>
				<Button size="sm">New order</Button>
			{/snippet}
			{#snippet sidebar({ close })}
				<Nav>
					<NavSection title="Trading">
						<NavItem
							href="/patterns/dashboard/"
							active={nav === 'dashboard'}
							onclick={(e) => {
								go('dashboard')(e);
								close();
							}}
						>
							{#snippet icon()}<LayoutDashboard />{/snippet}Dashboard
						</NavItem>
						<NavItem
							href="/patterns/dashboard/"
							badge={3}
							badgeTone="accent"
							active={nav === 'orders'}
							onclick={(e) => {
								go('orders')(e);
								close();
							}}
						>
							{#snippet icon()}<ListOrdered />{/snippet}Orders
						</NavItem>
						<NavItem
							href="/patterns/dashboard/"
							active={nav === 'history'}
							onclick={(e) => {
								go('history')(e);
								close();
							}}
						>
							{#snippet icon()}<History />{/snippet}History
						</NavItem>
					</NavSection>
					<NavSection title="Account">
						<NavItem
							href="/patterns/dashboard/"
							active={nav === 'settings'}
							onclick={(e) => {
								go('settings')(e);
								close();
							}}
						>
							{#snippet icon()}<Settings />{/snippet}Settings
						</NavItem>
					</NavSection>
				</Nav>
			{/snippet}
			{#snippet sidebarFooter({ collapsed })}
				{#if !collapsed}<Text size="xs" tone="subtle"><Kbd keys="mod+k" size="sm" /> search</Text
					>{/if}
			{/snippet}

			<Stack gap="5">
				<Ticker items={tape} size="sm" label="Market tape" />
				<Inline justify="between" align="end" wrap>
					<Stack gap="1">
						<Heading level={2} size="lg">Good morning, Ada</Heading>
						<Text size="sm" tone="muted"
							>Markets open in 42 minutes · 5 positions · 3 working orders</Text
						>
					</Stack>
					<Tabs bind:value={range} variant="pill" size="sm">
						<TabList label="Range">
							{#each ['1d', '1w', '1m', 'ytd'] as r (r)}<Tab value={r}>{r.toUpperCase()}</Tab
								>{/each}
						</TabList>
					</Tabs>
				</Inline>

				<Grid min="10rem" gap="4">
					<Stat label="Net liquidation" value="$1.24M" delta={1.8} hint="vs. yesterday close">
						{#snippet icon()}<Wallet />{/snippet}
					</Stat>
					<Stat label="Day P&L" value="+$4,210" delta={2.4} hint="realised + unrealised">
						{#snippet icon()}<TrendingUp />{/snippet}
					</Stat>
					<Stat label="Margin used" value="42%" delta={3} deltaInvert hint="of $80k available">
						{#snippet icon()}<Gauge />{/snippet}
						<Progress value={42} aria-label="Margin used" size="sm" tone="warning" />
					</Stat>
				</Grid>

				<Grid min="20rem" gap="4">
					<Card padding="none">
						{#snippet header()}
							<Inline justify="between" align="center">
								<Heading level={3} size="md">Positions</Heading>
								<Badge tone="success" dot>Live</Badge>
							</Inline>
						{/snippet}
						<Table
							{columns}
							rows={positions}
							rowKey={(r) => r.id}
							bind:sort
							caption="Open positions"
						/>
					</Card>
					<Stack gap="4">
						<Card>
							{#snippet header()}<Heading level={3} size="md">Working orders</Heading>{/snippet}
							<Stack gap="3">
								{#each [['Buy 20 NVDA', 'LMT 895.00', 'accent'], ['Sell 40 AAPL', 'STP 185.00', 'warning'], ['Buy 5 ASML', 'LMT 860.00', 'accent']] as [what, how, tone] (what)}
									<Inline justify="between" align="center">
										<Stack gap="0-5">
											<Text size="sm" weight="medium">{what}</Text>
											<Text size="xs" tone="muted" numeric>{how}</Text>
										</Stack>
										<Badge tone={tone as 'accent' | 'warning'} variant="soft">working</Badge>
									</Inline>
								{/each}
							</Stack>
						</Card>
						<Card variant="filled">
							<Stack gap="2">
								<Text size="sm" weight="semibold">Risk check</Text>
								<Text size="sm" tone="muted"
									>Concentration in semis is 47% of equity. Consider trimming NVDA or TSM before the
									print.</Text
								>
								<div>
									<Button size="sm" variant="outline" tone="neutral">Review exposure</Button>
								</div>
							</Stack>
						</Card>
					</Stack>
				</Grid>
			</Stack>
		</AppShell>
	</div>
</Demo>

<h2>Notes</h2>
<p>
	The Stat row and the table + side cards both use <code>Grid min</code>, so they reflow from three
	(or two) columns to one without breakpoints. The table lives in a <code>Card padding="none"</code>
	so its own border becomes the card edge. Deltas inside the table use
	<code>arrow={'{false}'}</code> to keep the column quiet; the tiles keep their pills.
</p>

<style>
	.frame {
		--db-app-shell-min-height: 44rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	.mark {
		display: inline-grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-size: var(--text-sm);
	}
</style>
