<script lang="ts">
	import {
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Card,
		Field,
		Input,
		Textarea,
		Select,
		Switch,
		RadioGroup,
		Radio,
		Avatar,
		Badge,
		Button,
		Dialog,
		Table,
		Progress,
		Heading,
		Text,
		Stack,
		Inline,
		Link,
		toast,
		type TableColumn
	} from '$lib/index.js';
	import { theme, type Theme, type Density } from '$lib/theme/theme.svelte.js';
	import { User, Bell, Palette, CreditCard, TriangleAlert, Download } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Demo from '$docs/Demo.svelte';

	interface Settings {
		name: string;
		handle: string;
		bio: string;
		timezone: string;
		notify: { fills: boolean; alerts: boolean; digest: boolean; news: boolean };
		delivery: 'email' | 'push' | 'both';
		theme: Theme;
		density: Density;
	}

	// `saved` is what the server has; `draft` is what the form edits. Dirty = they differ.
	const initial: Settings = {
		name: 'Ada Lovelace',
		handle: 'ada',
		bio: 'Systematic trader. Mostly semis and rates.',
		timezone: 'Asia/Singapore',
		notify: { fills: true, alerts: true, digest: false, news: false },
		delivery: 'both',
		theme: 'slate',
		density: 'comfortable'
	};
	let saved = $state<Settings>(structuredClone(initial));
	let draft = $state<Settings>(structuredClone(initial));
	const dirty = $derived(JSON.stringify(draft) !== JSON.stringify(saved));
	let saving = $state(false);
	let section = $state('profile');

	// The "server" copy of the appearance settings is whatever this site is currently using.
	onMount(() => {
		const { theme: t, density } = theme.current;
		saved = { ...saved, theme: t, density };
		draft = { ...draft, theme: t, density };
	});
	let errors = $state<{ name?: string; handle?: string }>({});

	const timezones = [
		{ value: 'America/New_York', label: 'New York (ET)' },
		{ value: 'Europe/London', label: 'London (GMT)' },
		{ value: 'Asia/Singapore', label: 'Singapore (SGT)' },
		{ value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
		{ value: 'Australia/Sydney', label: 'Sydney (AEST)' }
	];

	function validate(): boolean {
		const e: typeof errors = {};
		if (!draft.name.trim()) e.name = 'Name is required.';
		if (!/^[a-z0-9_]{3,20}$/.test(draft.handle))
			e.handle = 'Use 3–20 lowercase letters, numbers or underscores.';
		errors = e;
		if (Object.keys(e).length) section = 'profile';
		return Object.keys(e).length === 0;
	}
	async function save() {
		if (!validate()) return;
		saving = true;
		await new Promise((r) => setTimeout(r, 700));
		saved = structuredClone($state.snapshot(draft));
		// Appearance is the one section with a side effect: apply it on save, not on change.
		theme.set({ theme: saved.theme, density: saved.density });
		saving = false;
		toast.success('Settings saved');
	}
	function discard() {
		draft = structuredClone($state.snapshot(saved));
		errors = {};
	}

	// Billing
	interface Invoice {
		id: string;
		date: string;
		amount: number;
		status: 'paid' | 'open' | 'failed';
	}
	const invoices: Invoice[] = [
		{ id: 'INV-0142', date: '2026-09-01', amount: 49, status: 'paid' },
		{ id: 'INV-0131', date: '2026-08-01', amount: 49, status: 'paid' },
		{ id: 'INV-0120', date: '2026-07-01', amount: 49, status: 'paid' },
		{ id: 'INV-0109', date: '2026-06-01', amount: 29, status: 'failed' }
	];
	const invoiceColumns: TableColumn<Invoice>[] = [
		{ key: 'id', header: 'Invoice', cell: invoiceId },
		{ key: 'date', header: 'Date' },
		{ key: 'amount', header: 'Amount', numeric: true, cell: amount },
		{ key: 'status', header: 'Status', cell: status, width: '7rem' }
	];
	const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
	const statusTone = { paid: 'success', open: 'warning', failed: 'danger' } as const;

	// Danger zone
	let deleteOpen = $state(false);
	let confirmText = $state('');
	const canDelete = $derived(confirmText === draft.handle);

	const themeBlurb: Record<Theme, string> = {
		slate: 'Quiet and precise. Inter, hairlines, 6px radii.',
		folio: 'Warm and editorial. Fraunces display, soft shadows.',
		terminal: 'Dense and data-first. IBM Plex, borders, slashed zeros.'
	};
</script>

{#snippet invoiceId(row: Invoice)}<Text as="span" size="sm" mono>{row.id}</Text>{/snippet}
{#snippet amount(row: Invoice)}{money.format(row.amount)}{/snippet}
{#snippet status(row: Invoice)}
	<Badge tone={statusTone[row.status]} dot size="sm">{row.status}</Badge>
{/snippet}

<h1>Settings</h1>
<p class="lead">
	A sectioned settings screen: vertical Tabs on the left, one Card per section, and a save bar that
	slides in only while there are unsaved changes. Validation errors jump back to the section that
	owns them.
</p>

<Demo
	title="Live pattern"
	stack
	code={`let saved = $state(initial);
let draft = $state(structuredClone($state.snapshot(saved)));
const dirty = $derived(JSON.stringify(draft) !== JSON.stringify(saved));

<Tabs bind:value={section} orientation="vertical">
	<TabList label="Settings sections"> <Tab value="profile">Profile</Tab> … </TabList>
	<TabPanel value="profile"> <Card> <Field label="Name" error={errors.name}> <Input bind:value={draft.name} /> … </TabPanel>
</Tabs>
{#if dirty}<div class="save-bar" transition:fly={{ y: 16 }}> Unsaved changes <Button onclick={discard}>Discard</Button> <Button onclick={save} loading={saving}>Save</Button> </div>{/if}`}
>
	<div class="settings">
		<Tabs bind:value={section} orientation="vertical" class="settings__tabs">
			<TabList label="Settings sections">
				<Tab value="profile">{#snippet leading()}<User />{/snippet}Profile</Tab>
				<Tab value="notifications">{#snippet leading()}<Bell />{/snippet}Notifications</Tab>
				<Tab value="appearance">{#snippet leading()}<Palette />{/snippet}Appearance</Tab>
				<Tab value="billing" badge="Pro">{#snippet leading()}<CreditCard />{/snippet}Billing</Tab>
				<Tab value="danger">{#snippet leading()}<TriangleAlert />{/snippet}Danger zone</Tab>
			</TabList>

			<TabPanel value="profile">
				<Card>
					{#snippet header()}
						<Stack gap="0-5">
							<Heading level={3} size="md">Profile</Heading>
							<Text size="sm" tone="muted">How you appear to other members.</Text>
						</Stack>
					{/snippet}
					<Stack gap="5">
						<Inline gap="4">
							<Avatar name={draft.name} size="lg" />
							<Stack gap="1">
								<Inline gap="2">
									<Button size="sm" variant="outline" tone="neutral">Change photo</Button>
									<Button size="sm" variant="ghost" tone="neutral">Remove</Button>
								</Inline>
								<Text size="xs" tone="muted">PNG or JPG, up to 2 MB.</Text>
							</Stack>
						</Inline>
						<Field label="Name" required error={errors.name}>
							<Input bind:value={draft.name} autocomplete="name" />
						</Field>
						<Field label="Handle" required error={errors.handle} hint="acme.trade/@{draft.handle}">
							<Input bind:value={draft.handle} autocomplete="username" spellcheck={false}>
								{#snippet leading()}@{/snippet}
							</Input>
						</Field>
						<Field label="Bio" hint="{draft.bio.length}/160">
							<Textarea bind:value={draft.bio} autoResize rows={2} maxlength={160} />
						</Field>
						<Field label="Time zone" hint="Used for statements and market-hours reminders.">
							<Select items={timezones} bind:value={draft.timezone} />
						</Field>
					</Stack>
				</Card>
			</TabPanel>

			<TabPanel value="notifications">
				<Card>
					{#snippet header()}
						<Stack gap="0-5">
							<Heading level={3} size="md">Notifications</Heading>
							<Text size="sm" tone="muted">Choose what we send and where.</Text>
						</Stack>
					{/snippet}
					<Stack gap="5">
						<Stack gap="3" as="ul" class="switch-list">
							<li>
								<Switch
									bind:checked={draft.notify.fills}
									description="The moment an order executes.">Order fills</Switch
								>
							</li>
							<li>
								<Switch
									bind:checked={draft.notify.alerts}
									description="Price and volatility alerts you've set up.">Price alerts</Switch
								>
							</li>
							<li>
								<Switch
									bind:checked={draft.notify.digest}
									description="Performance summary every Monday morning.">Weekly digest</Switch
								>
							</li>
							<li>
								<Switch
									bind:checked={draft.notify.news}
									description="New features and tips, monthly.">Product news</Switch
								>
							</li>
						</Stack>
						<RadioGroup label="Delivery" bind:value={draft.delivery} orientation="horizontal">
							<Radio value="email">Email</Radio>
							<Radio value="push">Push</Radio>
							<Radio value="both">Both</Radio>
						</RadioGroup>
					</Stack>
				</Card>
			</TabPanel>

			<TabPanel value="appearance">
				<Card>
					{#snippet header()}
						<Stack gap="0-5">
							<Heading level={3} size="md">Appearance</Heading>
							<Text size="sm" tone="muted">Applies to this site when you save.</Text>
						</Stack>
					{/snippet}
					<Stack gap="5">
						<RadioGroup label="Theme" bind:value={draft.theme}>
							{#each ['slate', 'folio', 'terminal'] as const as t (t)}
								<Radio value={t} description={themeBlurb[t]}
									>{t[0].toUpperCase() + t.slice(1)}</Radio
								>
							{/each}
						</RadioGroup>
						<RadioGroup label="Density" bind:value={draft.density} orientation="horizontal">
							<Radio value="comfortable">Comfortable</Radio>
							<Radio value="compact">Compact</Radio>
						</RadioGroup>
					</Stack>
				</Card>
			</TabPanel>

			<TabPanel value="billing">
				<Stack gap="4">
					<Card>
						{#snippet header()}
							<Inline justify="between" align="center">
								<Heading level={3} size="md">Plan</Heading>
								<Badge tone="accent">Pro · $49/mo</Badge>
							</Inline>
						{/snippet}
						<Stack gap="4">
							<Progress value={68} label="API calls this cycle" showValue size="sm" tone="accent" />
							<Text size="sm" tone="muted">
								Renews on 1 Oct 2026. Card ending in 4242.
								<Link href="/patterns/settings/" subtle>Update payment method</Link>
							</Text>
							<Inline gap="2">
								<Button size="sm" variant="outline" tone="neutral">Change plan</Button>
								<Button size="sm" variant="ghost" tone="neutral">Cancel subscription</Button>
							</Inline>
						</Stack>
					</Card>
					<Card padding="none">
						{#snippet header()}<Heading level={3} size="md">Invoices</Heading>{/snippet}
						<Table
							columns={invoiceColumns}
							rows={invoices}
							rowKey={(r) => r.id}
							caption="Invoices"
						/>
						{#snippet footer()}
							<Button size="sm" variant="ghost" tone="neutral">
								{#snippet leading()}<Download />{/snippet}Download all
							</Button>
						{/snippet}
					</Card>
				</Stack>
			</TabPanel>

			<TabPanel value="danger">
				<Card class="danger">
					{#snippet header()}
						<Stack gap="0-5">
							<Heading level={3} size="md">Danger zone</Heading>
							<Text size="sm" tone="muted">These actions are permanent.</Text>
						</Stack>
					{/snippet}
					<Inline justify="between" align="center" gap="4">
						<Stack gap="0-5">
							<Text size="sm" weight="medium">Delete account</Text>
							<Text size="sm" tone="muted">
								Closes every position, cancels open orders and erases your data after 30 days.
							</Text>
						</Stack>
						<Dialog
							bind:open={deleteOpen}
							title="Delete your account?"
							description="This cannot be undone."
							size="sm"
							onOpenChange={(o) => {
								if (!o) confirmText = '';
							}}
						>
							{#snippet trigger(props)}
								<Button {...props} tone="danger" variant="outline" size="sm">Delete account…</Button
								>
							{/snippet}
							<Field label="Type your handle to confirm" hint="Your handle is @{draft.handle}">
								<Input bind:value={confirmText} autocomplete="off" spellcheck={false}>
									{#snippet leading()}@{/snippet}
								</Input>
							</Field>
							{#snippet footer({ close })}
								<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
								<Button
									tone="danger"
									disabled={!canDelete}
									onclick={() => {
										close();
										toast.danger('Account scheduled for deletion', {
											description: 'You have 30 days to change your mind.'
										});
									}}>Delete account</Button
								>
							{/snippet}
						</Dialog>
					</Inline>
				</Card>
			</TabPanel>
		</Tabs>

		{#if dirty}
			<div class="save-bar" transition:fly={{ y: 16, duration: 200 }} role="status">
				<Text size="sm" weight="medium">Unsaved changes</Text>
				<Inline gap="2">
					<Button variant="ghost" tone="neutral" size="sm" onclick={discard} disabled={saving}>
						Discard
					</Button>
					<Button size="sm" onclick={save} loading={saving}>Save changes</Button>
				</Inline>
			</div>
		{/if}
	</div>
</Demo>

<h2>Notes</h2>
<p>
	The form edits a <code>draft</code> and compares it with <code>saved</code> by value, so the save
	bar needs no per-field bookkeeping and <em>Discard</em> is a one-liner. The Appearance section really
	does switch this site's theme — but only on save, which is the rule for any setting with a side effect.
	The danger-zone dialog gates its destructive button on a typed confirmation and resets the field whenever
	it closes.
</p>

<style>
	.settings {
		position: relative;
		max-width: 56rem;
	}
	.settings :global(.settings__tabs) {
		align-items: start;
	}
	.settings :global(.db-tab-list) {
		min-width: 12rem;
		position: sticky;
		top: var(--space-4);
	}
	.settings :global(.db-tab-panel) {
		flex: 1;
		min-width: 0;
	}
	@media (max-width: 40rem) {
		.settings :global(.settings__tabs) {
			flex-direction: column;
		}
	}
	.settings :global(.switch-list) {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.settings :global(.danger) {
		border-color: var(--color-danger-border);
	}
	.save-bar {
		position: sticky;
		bottom: var(--space-4);
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-block-start: var(--space-4);
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface-raised);
		box-shadow: var(--shadow-lg);
	}
</style>
