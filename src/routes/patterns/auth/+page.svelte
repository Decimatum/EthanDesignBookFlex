<script lang="ts">
	import {
		PageTransition,
		Card,
		Field,
		Input,
		Checkbox,
		Button,
		Heading,
		Text,
		Stack,
		Inline,
		Alert,
		Divider,
		Progress,
		toast
	} from '$lib/index.js';
	import { Eye, EyeOff, KeyRound, Fingerprint, ShieldCheck, Zap, LineChart } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';

	type Mode = 'signin' | 'signup' | 'reset' | 'sent';
	let mode = $state<Mode>('signin');

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let remember = $state(true);
	let showPassword = $state(false);
	let busy = $state(false);
	let errors = $state<{ name?: string; email?: string; password?: string; form?: string }>({});

	const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

	/** Password strength, 0–4, for the sign-up meter. Length-weighted; variety adds a point each. */
	const strength = $derived.by(() => {
		if (!password) return 0;
		let s = 0;
		if (password.length >= 8) s++;
		if (password.length >= 12) s++;
		if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
		if (/\d/.test(password) || /[^\w\s]/.test(password)) s++;
		return s;
	});
	const strengthLabel = $derived(['', 'Weak', 'Fair', 'Good', 'Strong'][strength]);
	const strengthTone = $derived(
		(['danger', 'danger', 'warning', 'accent', 'success'] as const)[strength]
	);

	function go(next: Mode) {
		errors = {};
		showPassword = false;
		mode = next;
	}

	function validate(): boolean {
		const e: typeof errors = {};
		if (mode === 'signup' && !name.trim()) e.name = 'Enter your name.';
		if (!emailOk(email)) e.email = 'Enter a valid email address.';
		if (mode !== 'reset') {
			if (!password) e.password = 'Enter your password.';
			else if (mode === 'signup' && password.length < 8) e.password = 'Use at least 8 characters.';
		}
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!validate()) return;
		busy = true;
		// Stand-in for the network round trip.
		await new Promise((r) => setTimeout(r, 900));
		busy = false;
		if (mode === 'reset') {
			go('sent');
			return;
		}
		if (mode === 'signin' && password === 'wrong') {
			errors = { form: 'That email and password combination is not right.' };
			return;
		}
		toast.success(mode === 'signin' ? `Welcome back, ${email}` : 'Account created', {
			description:
				mode === 'signin' ? 'Redirecting to your dashboard…' : 'Check your inbox to verify.'
		});
	}

	const titles: Record<Mode, { heading: string; lead: string }> = {
		signin: { heading: 'Sign in', lead: 'Welcome back. Enter your details to continue.' },
		signup: { heading: 'Create your account', lead: 'Free to start. No card required.' },
		reset: {
			heading: 'Reset your password',
			lead: "We'll email you a link that expires in 15 minutes."
		},
		sent: { heading: 'Check your inbox', lead: '' }
	};
</script>

<h1>Auth</h1>
<p class="lead">
	Sign in, sign up and password reset in one screen: a brand panel beside a card whose body swaps
	between modes with PageTransition. Validation runs on submit and lands on the fields; server-side
	failures land in an Alert above the form.
</p>

<Demo
	title="Live pattern"
	stack
	code={`<form onsubmit={submit} novalidate>
	<Field label="Email" required error={errors.email}>
		<Input type="email" bind:value={email} autocomplete="email" />
	</Field>
	<Field label="Password" required error={errors.password}>
		<Input type={show ? 'text' : 'password'} bind:value={password} autocomplete="current-password">
			{#snippet action()}
				<button type="button" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onclick={() => (show = !show)}>
					{#if show}<EyeOff />{:else}<Eye />{/if}
				</button>
			{/snippet}
		</Input>
	</Field>
	<Button type="submit" block loading={busy}>Sign in</Button>
</form>`}
>
	<div class="auth">
		<aside class="auth__panel">
			<Stack gap="6" justify="between" class="auth__panel-inner">
				<Inline gap="2">
					<span class="mark" aria-hidden="true">A</span>
					<Text weight="semibold" tone="inherit">Acme Trading</Text>
				</Inline>
				<Stack gap="5">
					<Heading level={2} size="xl">Trade with the calm of a well-made tool.</Heading>
					<ul class="features">
						<li>
							<ShieldCheck aria-hidden="true" />
							<Text as="span" size="sm" tone="inherit">Hardware-key 2FA and passkeys built in</Text>
						</li>
						<li>
							<Zap aria-hidden="true" />
							<Text as="span" size="sm" tone="inherit">Sub-second order routing</Text>
						</li>
						<li>
							<LineChart aria-hidden="true" />
							<Text as="span" size="sm" tone="inherit">Real-time P&amp;L across every account</Text>
						</li>
					</ul>
				</Stack>
				<Text size="xs" tone="inherit" class="auth__fine">
					© Acme Trading · Member FINRA/SIPC (well, in this demo).
				</Text>
			</Stack>
		</aside>

		<div class="auth__form">
			<Card padding="lg" class="auth__card">
				<PageTransition key={mode} kind="fade">
					<Stack gap="5">
						<Stack gap="1">
							<Heading level={2} size="lg">{titles[mode].heading}</Heading>
							{#if titles[mode].lead}<Text size="sm" tone="muted">{titles[mode].lead}</Text>{/if}
						</Stack>

						{#if mode === 'sent'}
							<Alert tone="success" title="Reset link sent">
								If <strong>{email}</strong> has an account, a reset link is on its way. It expires in
								15 minutes.
							</Alert>
							<Text size="sm" tone="muted">
								Didn't get it? Check your spam folder, or
								<Button variant="link" size="sm" onclick={() => go('reset')}
									>try another email</Button
								>.
							</Text>
							<Button variant="outline" tone="neutral" block onclick={() => go('signin')}>
								Back to sign in
							</Button>
						{:else}
							{#if errors.form}
								<Alert tone="danger" title="Couldn't sign you in">{errors.form}</Alert>
							{/if}

							<form onsubmit={submit} novalidate>
								<Stack gap="4">
									{#if mode === 'signup'}
										<Field label="Full name" required error={errors.name}>
											<Input bind:value={name} autocomplete="name" placeholder="Ada Lovelace" />
										</Field>
									{/if}
									<Field label="Email" required error={errors.email}>
										<Input
											type="email"
											bind:value={email}
											autocomplete="email"
											placeholder="you@example.com"
											inputmode="email"
										/>
									</Field>
									{#if mode !== 'reset'}
										<Field
											label="Password"
											required
											error={errors.password}
											hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
										>
											<Input
												type={showPassword ? 'text' : 'password'}
												bind:value={password}
												autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
											>
												{#snippet action()}
													<button
														type="button"
														aria-label={showPassword ? 'Hide password' : 'Show password'}
														aria-pressed={showPassword}
														onclick={() => (showPassword = !showPassword)}
													>
														{#if showPassword}<EyeOff />{:else}<Eye />{/if}
													</button>
												{/snippet}
											</Input>
										</Field>
										{#if mode === 'signup' && password}
											<Progress
												value={strength * 25}
												size="sm"
												tone={strengthTone}
												label="Password strength: {strengthLabel}"
											/>
										{/if}
									{/if}

									{#if mode === 'signin'}
										<Inline justify="between" align="center">
											<Checkbox bind:checked={remember} size="sm">Remember me</Checkbox>
											<Button variant="link" size="sm" onclick={() => go('reset')}>
												Forgot password?
											</Button>
										</Inline>
									{/if}

									<Button type="submit" block loading={busy}>
										{mode === 'signin'
											? 'Sign in'
											: mode === 'signup'
												? 'Create account'
												: 'Send reset link'}
									</Button>
								</Stack>
							</form>

							{#if mode !== 'reset'}
								<div class="or">
									<Divider />
									<Text as="span" size="xs" tone="subtle">or</Text>
									<Divider />
								</div>
								<Stack gap="2">
									<Button variant="outline" tone="neutral" block>
										{#snippet leading()}<Fingerprint />{/snippet}
										Continue with a passkey
									</Button>
									<Button variant="outline" tone="neutral" block>
										{#snippet leading()}<KeyRound />{/snippet}
										Continue with SSO
									</Button>
								</Stack>
							{/if}

							<Text size="sm" tone="muted" align="center">
								{#if mode === 'signin'}
									New here?
									<Button variant="link" size="sm" onclick={() => go('signup')}
										>Create an account</Button
									>
								{:else}
									Already have an account?
									<Button variant="link" size="sm" onclick={() => go('signin')}>Sign in</Button>
								{/if}
							</Text>
						{/if}
					</Stack>
				</PageTransition>
			</Card>
		</div>
	</div>
</Demo>

<h2>Notes</h2>
<p>
	The three modes share one form and one set of field state, so switching from sign-in to sign-up
	keeps a typed email. The password toggle uses Input's <code>action</code> snippet, which — unlike
	the decorative <code>trailing</code> adornment — stays in the accessibility tree; it is a toggle
	button with <code>aria-pressed</code>. Try the password
	<code>wrong</code> to see the server-error path. Social buttons are deliberately brand-free (passkey
	and SSO) so the pattern ships without logo assets.
</p>

<style>
	.auth {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		min-height: 36rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--color-bg);
	}
	@media (max-width: 52rem) {
		.auth {
			grid-template-columns: 1fr;
		}
		.auth__panel {
			min-height: 0;
		}
	}
	.auth__panel {
		padding: var(--space-8);
		color: var(--color-accent-text);
		background:
			radial-gradient(60rem 30rem at 0% 0%, var(--color-accent-subtle), transparent 60%),
			linear-gradient(160deg, var(--color-accent-subtle), var(--color-bg-subtle));
		border-inline-end: 1px solid var(--color-border);
	}
	.auth__panel :global(.auth__panel-inner) {
		height: 100%;
	}
	.mark {
		display: inline-grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-sm);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-weight: var(--weight-bold);
		font-size: var(--text-sm);
	}
	.features {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-3);
	}
	.features li {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.features :global(svg) {
		width: 1.15em;
		height: 1.15em;
		flex: none;
		color: var(--color-accent);
	}
	.auth__panel :global(.auth__fine) {
		opacity: 0.75;
	}
	.auth__form {
		display: grid;
		place-items: center;
		padding: var(--space-8) var(--space-6);
	}
	.auth__form :global(.auth__card) {
		width: min(100%, 26rem);
	}
	.or {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.or :global(.db-divider) {
		flex: 1;
	}
</style>
