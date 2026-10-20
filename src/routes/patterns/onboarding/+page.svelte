<script lang="ts">
	import {
		Stepper,
		PageTransition,
		Card,
		Field,
		Input,
		Select,
		Combobox,
		Checkbox,
		RadioGroup,
		Radio,
		Slider,
		Button,
		Heading,
		Text,
		Stack,
		Inline,
		Alert,
		Progress
	} from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';

	const steps = [
		{ id: 'account', label: 'Account', description: 'Who you are' },
		{ id: 'profile', label: 'Investor profile', description: 'Goals and risk' },
		{ id: 'funding', label: 'Funding', description: 'Link a bank' },
		{ id: 'review', label: 'Review', description: 'Confirm and open' }
	];
	let current = $state('account');
	const index = $derived(steps.findIndex((s) => s.id === current));
	const progress = $derived(Math.round((index / (steps.length - 1)) * 100));

	// Form state lives outside the steps so going back keeps answers.
	let name = $state('');
	let email = $state('');
	let country = $state('');
	let horizon = $state('long');
	let risk = $state(2);
	let interests = $state<string[]>([]);
	let bank = $state('');
	let agreed = $state(false);
	let error = $state('');

	const countries = [
		{ value: 'us', label: 'United States' },
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'sg', label: 'Singapore' },
		{ value: 'hk', label: 'Hong Kong' },
		{ value: 'au', label: 'Australia' }
	];
	const sectors = [
		{ value: 'tech', label: 'Technology', keywords: 'semis software' },
		{ value: 'fin', label: 'Financials' },
		{ value: 'energy', label: 'Energy' },
		{ value: 'health', label: 'Healthcare' },
		{ value: 'crypto', label: 'Digital assets' }
	];
	const banks = [
		{ value: 'chase', label: 'Chase' },
		{ value: 'boa', label: 'Bank of America' },
		{ value: 'wf', label: 'Wells Fargo' },
		{ value: 'dbs', label: 'DBS' }
	];

	function validate(): string {
		if (current === 'account') {
			if (!name.trim()) return 'Enter your full name.';
			if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid email address.';
			if (!country) return 'Choose your country of residence.';
		}
		if (current === 'funding' && !bank) return 'Pick a bank to link.';
		if (current === 'review' && !agreed)
			return 'You need to accept the agreement to open the account.';
		return '';
	}
	function next() {
		error = validate();
		if (error) return;
		if (index < steps.length - 1) current = steps[index + 1].id;
		else done = true;
	}
	function back() {
		error = '';
		if (index > 0) current = steps[index - 1].id;
	}
	let done = $state(false);
</script>

<h1>Onboarding</h1>
<p class="lead">
	A four-step account-opening wizard: Stepper for orientation, PageTransition between steps, and
	form state that survives going back. Validation happens per step, not per keystroke.
</p>

<Demo
	title="Live pattern"
	stack
	code={`<Stepper {steps} bind:current onStepClick={(id) => (current = id)} />
<PageTransition key={current} kind="slide">
	{#if current === 'account'} <AccountStep /> {:else if …}
</PageTransition>
<Inline justify="between"><Button variant="ghost" onclick={back}>Back</Button><Button onclick={next}>Continue</Button></Inline>`}
>
	<div class="wizard">
		{#if done}
			<Card>
				<Stack gap="3" align="center">
					<Progress value={100} tone="success" aria-label="Complete" size="sm" />
					<Heading level={2} size="lg">You're in, {name.split(' ')[0] || 'trader'}.</Heading>
					<Text tone="muted" align="center">
						Your account is open and {banks.find((b) => b.value === bank)?.label} is linked. Funds usually
						arrive in 1–2 business days.
					</Text>
					<Button
						onclick={() => {
							done = false;
							current = 'account';
						}}>Start over</Button
					>
				</Stack>
			</Card>
		{:else}
			<Stack gap="5">
				<Stepper
					{steps}
					bind:current
					onStepClick={(id) => {
						error = '';
						current = id;
					}}
				/>
				<Progress value={progress} size="sm" aria-label="Onboarding progress" />

				{#if error}<Alert tone="danger" title="Fix this to continue">{error}</Alert>{/if}

				<PageTransition key={current} kind="slide">
					<Card>
						<Stack gap="4">
							<Stack gap="1">
								<Heading level={2} size="md">{steps[index].label}</Heading>
								<Text size="sm" tone="muted">{steps[index].description}</Text>
							</Stack>

							{#if current === 'account'}
								<Field label="Full name" required>
									<Input bind:value={name} placeholder="Ada Lovelace" autocomplete="name" />
								</Field>
								<Field label="Email" required hint="We'll send statements here.">
									<Input
										type="email"
										bind:value={email}
										placeholder="ada@example.com"
										autocomplete="email"
									/>
								</Field>
								<Field label="Country of residence" required>
									<Select items={countries} bind:value={country} placeholder="Choose a country" />
								</Field>
							{:else if current === 'profile'}
								<RadioGroup
									label="Investment horizon"
									bind:value={horizon}
									orientation="horizontal"
								>
									<Radio value="short">Under a year</Radio>
									<Radio value="mid">1–5 years</Radio>
									<Radio value="long">5+ years</Radio>
								</RadioGroup>
								<Field
									label="Risk tolerance"
									hint="1 is capital preservation, 5 is aggressive growth."
								>
									<Slider bind:value={risk} min={1} max={5} step={1} ticks={5} showValue />
								</Field>
								<Field label="Sectors you follow" hint="Optional — used for the watchlist starter.">
									<Combobox
										items={sectors}
										bind:value={interests}
										multiple
										placeholder="Add sectors…"
									/>
								</Field>
							{:else if current === 'funding'}
								<Field label="Bank" required hint="Instant verification for most US banks.">
									<Combobox items={banks} bind:value={bank} placeholder="Search your bank" />
								</Field>
								<Alert tone="info" title="Nothing moves yet">
									Linking only verifies the account. You choose how much to deposit after opening.
								</Alert>
							{:else}
								<dl class="summary">
									<dt>Name</dt>
									<dd>{name || '—'}</dd>
									<dt>Email</dt>
									<dd>{email || '—'}</dd>
									<dt>Country</dt>
									<dd>{countries.find((c) => c.value === country)?.label ?? '—'}</dd>
									<dt>Horizon</dt>
									<dd>{{ short: 'Under a year', mid: '1–5 years', long: '5+ years' }[horizon]}</dd>
									<dt>Risk</dt>
									<dd>{risk} / 5</dd>
									<dt>Sectors</dt>
									<dd>
										{interests.map((i) => sectors.find((s) => s.value === i)?.label).join(', ') ||
											'None'}
									</dd>
									<dt>Bank</dt>
									<dd>{banks.find((b) => b.value === bank)?.label ?? '—'}</dd>
								</dl>
								<Checkbox bind:checked={agreed}
									>I agree to the customer agreement and risk disclosures.</Checkbox
								>
							{/if}
						</Stack>
					</Card>
				</PageTransition>

				<Inline justify="between">
					<Button variant="ghost" tone="neutral" onclick={back} disabled={index === 0}>Back</Button>
					<Button onclick={next}>{index === steps.length - 1 ? 'Open account' : 'Continue'}</Button>
				</Inline>
			</Stack>
		{/if}
	</div>
</Demo>

<h2>Notes</h2>
<p>
	State is declared once at the page level, so the Stepper can jump back to any completed step and
	the answers are still there. Each step validates on <em>Continue</em>; the error is an inline
	Alert above the card, and the Stepper marks the step complete only when the user has moved past
	it.
</p>

<style>
	.wizard {
		max-width: 40rem;
	}
	.summary {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: var(--space-1-5) var(--space-4);
		margin: 0;
		font-size: var(--text-sm);
	}
	.summary dt {
		color: var(--color-text-muted);
	}
	.summary dd {
		margin: 0;
		color: var(--color-text);
	}
</style>
