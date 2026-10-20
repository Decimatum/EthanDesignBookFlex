<script lang="ts">
	import {
		Stepper,
		PageTransition,
		Card,
		Field,
		Input,
		Select,
		Checkbox,
		RadioGroup,
		Radio,
		Button,
		Heading,
		Text,
		Stack,
		Inline,
		Grid,
		Divider,
		Alert,
		Badge,
		Link,
		NumberInput,
		toast
	} from '$lib/index.js';
	import { X, LockKeyhole, Tag as TagIcon, PackageCheck } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';

	// ---- Cart -----------------------------------------------------------------
	interface Item {
		id: string;
		name: string;
		variant: string;
		price: number;
		qty: number;
	}
	let items = $state<Item[]>([
		{ id: 'kb', name: 'Keyboard, 65%', variant: 'Graphite · Tactile', price: 189, qty: 1 },
		{ id: 'cable', name: 'Coiled cable', variant: 'USB-C · 1.5 m', price: 29, qty: 2 },
		{ id: 'caps', name: 'Keycap set', variant: 'PBT · Ink', price: 79, qty: 1 }
	]);
	let promo = $state('');
	let promoApplied = $state<string | null>(null);
	let promoError = $state('');
	let shipping = $state<'standard' | 'express'>('standard');
	const subtotal = $derived(items.reduce((s, i) => s + i.price * i.qty, 0));
	const discount = $derived(promoApplied ? Math.round(subtotal * 0.1) : 0);
	const shippingCost = $derived(shipping === 'express' ? 18 : subtotal - discount >= 150 ? 0 : 8);
	const tax = $derived(Math.round((subtotal - discount) * 0.08));
	const total = $derived(subtotal - discount + shippingCost + tax);
	const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	function setQty(id: string, qty: number) {
		items = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(9, qty)) } : i));
	}
	function remove(id: string) {
		items = items.filter((i) => i.id !== id);
	}
	function applyPromo() {
		const code = promo.trim().toUpperCase();
		if (code === 'BOOK10') {
			promoApplied = code;
			promoError = '';
			promo = '';
		} else promoError = code ? `“${code}” isn't a valid code.` : 'Enter a code.';
	}

	// ---- Steps ----------------------------------------------------------------
	const steps = [
		{ id: 'contact', label: 'Contact' },
		{ id: 'shipping', label: 'Shipping' },
		{ id: 'payment', label: 'Payment' }
	];
	let current = $state('contact');
	const index = $derived(steps.findIndex((s) => s.id === current));

	let email = $state('');
	let phone = $state('');
	let name = $state('');
	let address = $state('');
	let city = $state('');
	let postcode = $state('');
	let country = $state('sg');
	let method = $state<'card' | 'bank'>('card');
	let cardNumber = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let sameBilling = $state(true);
	let errors = $state<Record<string, string>>({});
	let placing = $state(false);
	let orderNumber = $state('');

	const countries = [
		{ value: 'sg', label: 'Singapore' },
		{ value: 'us', label: 'United States' },
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'jp', label: 'Japan' },
		{ value: 'au', label: 'Australia' }
	];

	/** Group digits in fours and cap at 19 digits; runs on every keystroke. */
	function formatCard(e: Event) {
		const digits = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '').slice(0, 19);
		cardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
	}
	function formatExpiry(e: Event) {
		const d = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
		expiry = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
	}
	const brand = $derived(
		cardNumber.startsWith('4')
			? 'Visa'
			: /^5[1-5]/.test(cardNumber)
				? 'Mastercard'
				: /^3[47]/.test(cardNumber)
					? 'Amex'
					: ''
	);

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (current === 'contact') {
			if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email address.';
		} else if (current === 'shipping') {
			if (!name.trim()) e.name = 'Required.';
			if (!address.trim()) e.address = 'Required.';
			if (!city.trim()) e.city = 'Required.';
			if (!postcode.trim()) e.postcode = 'Required.';
		} else if (method === 'card') {
			if (cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Enter the full card number.';
			if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = 'MM/YY';
			if (!/^\d{3,4}$/.test(cvc)) e.cvc = '3–4 digits';
		}
		errors = e;
		return Object.keys(e).length === 0;
	}
	async function next(event?: SubmitEvent) {
		event?.preventDefault();
		if (!validate()) return;
		if (index < steps.length - 1) {
			current = steps[index + 1].id;
			return;
		}
		placing = true;
		await new Promise((r) => setTimeout(r, 1000));
		placing = false;
		orderNumber = `#A-${Math.floor(10000 + Math.random() * 90000)}`;
		toast.success('Order placed', { description: `${orderNumber} · ${money.format(total)}` });
	}
	function back() {
		errors = {};
		if (index > 0) current = steps[index - 1].id;
	}
	function reset() {
		orderNumber = '';
		current = 'contact';
		errors = {};
	}
</script>

<h1>Checkout</h1>
<p class="lead">
	A three-step checkout with a live order summary: Stepper for orientation, one form per step inside
	PageTransition, and a summary card that recalculates as quantities, promo code and shipping method
	change. Card fields format as you type.
</p>

<Demo
	title="Live pattern"
	stack
	code={`<Grid columns="minmax(0, 3fr) minmax(18rem, 2fr)" gap="6">
	<form onsubmit={next} novalidate>
		<Stepper {steps} bind:current size="sm" />
		<PageTransition key={current} kind="slide"> …fields for the current step… </PageTransition>
		<Inline justify="between"><Button variant="ghost" onclick={back}>Back</Button><Button type="submit">Continue</Button></Inline>
	</form>
	<Card> …line items, promo code, totals… </Card>
</Grid>`}
>
	<div class="checkout">
		{#if orderNumber}
			<Card padding="lg" class="done">
				<Stack gap="4" align="center">
					<span class="done__icon"><PackageCheck aria-hidden="true" /></span>
					<Heading level={2} size="lg" align="center">Thanks — order {orderNumber} is in.</Heading>
					<Text tone="muted" align="center">
						A receipt is on its way to <strong>{email}</strong>. {shipping === 'express'
							? 'Express shipping: arrives in 1–2 business days.'
							: 'Standard shipping: arrives in 4–6 business days.'}
					</Text>
					<Inline gap="2">
						<Button variant="outline" tone="neutral" onclick={reset}>Place another order</Button>
						<Button href="/patterns/dashboard/">Track it</Button>
					</Inline>
				</Stack>
			</Card>
		{:else}
			<Grid columns="minmax(0, 3fr) minmax(18rem, 2fr)" gap="6" class="checkout__grid">
				<form onsubmit={next} novalidate class="checkout__form">
					<Stack gap="5">
						<Stepper
							{steps}
							bind:current
							size="sm"
							onStepClick={(id) => {
								errors = {};
								current = id;
							}}
						/>
						<PageTransition key={current} kind="slide">
							<Stack gap="4">
								{#if current === 'contact'}
									<Heading level={2} size="md">Contact</Heading>
									<Field
										label="Email"
										required
										error={errors.email}
										hint="For the receipt and updates."
									>
										<Input
											type="email"
											bind:value={email}
											autocomplete="email"
											inputmode="email"
											placeholder="you@example.com"
										/>
									</Field>
									<Field label="Phone" hint="Optional — only for the courier.">
										<Input type="tel" bind:value={phone} autocomplete="tel" inputmode="tel" />
									</Field>
								{:else if current === 'shipping'}
									<Heading level={2} size="md">Shipping address</Heading>
									<Field label="Full name" required error={errors.name}>
										<Input bind:value={name} autocomplete="name" />
									</Field>
									<Field label="Address" required error={errors.address}>
										<Input bind:value={address} autocomplete="street-address" />
									</Field>
									<Grid columns="minmax(0, 2fr) minmax(0, 1fr)" gap="3">
										<Field label="City" required error={errors.city}>
											<Input bind:value={city} autocomplete="address-level2" />
										</Field>
										<Field label="Postcode" required error={errors.postcode}>
											<Input bind:value={postcode} autocomplete="postal-code" numeric />
										</Field>
									</Grid>
									<Field label="Country" required>
										<Select items={countries} bind:value={country} />
									</Field>
									<RadioGroup label="Shipping method" bind:value={shipping}>
										<Radio
											value="standard"
											description="4–6 business days · {subtotal - discount >= 150
												? 'free over $150'
												: '$8'}">Standard</Radio
										>
										<Radio value="express" description="1–2 business days · $18">Express</Radio>
									</RadioGroup>
								{:else}
									<Heading level={2} size="md">Payment</Heading>
									<RadioGroup label="Pay with" bind:value={method} orientation="horizontal">
										<Radio value="card">Card</Radio>
										<Radio value="bank">Bank transfer</Radio>
									</RadioGroup>
									{#if method === 'card'}
										<Field label="Card number" required error={errors.cardNumber}>
											<Input
												value={cardNumber}
												oninput={formatCard}
												autocomplete="cc-number"
												inputmode="numeric"
												placeholder="1234 5678 9012 3456"
												numeric
											>
												{#snippet trailing()}{brand}{/snippet}
											</Input>
										</Field>
										<Grid columns={2} gap="3">
											<Field label="Expiry" required error={errors.expiry}>
												<Input
													value={expiry}
													oninput={formatExpiry}
													autocomplete="cc-exp"
													inputmode="numeric"
													placeholder="MM/YY"
													numeric
												/>
											</Field>
											<Field label="CVC" required error={errors.cvc}>
												<Input
													bind:value={cvc}
													autocomplete="cc-csc"
													inputmode="numeric"
													maxlength={4}
													placeholder="123"
													numeric
												/>
											</Field>
										</Grid>
										<Checkbox bind:checked={sameBilling}
											>Billing address is the same as shipping</Checkbox
										>
									{:else}
										<Alert tone="info" title="Pay by bank transfer">
											We'll show the account details after you place the order. Your items ship once
											the transfer clears, usually within one business day.
										</Alert>
									{/if}
								{/if}
							</Stack>
						</PageTransition>
						<Inline justify="between">
							<Button variant="ghost" tone="neutral" onclick={back} disabled={index === 0}
								>Back</Button
							>
							{#if index === steps.length - 1}
								<Button type="submit" loading={placing}>
									{#snippet leading()}<LockKeyhole />{/snippet}
									Pay {money.format(total)}
								</Button>
							{:else}
								<Button type="submit">Continue</Button>
							{/if}
						</Inline>
					</Stack>
				</form>

				<aside class="summary" aria-label="Order summary">
					<Card>
						{#snippet header()}
							<Inline justify="between" align="center">
								<Heading level={2} size="md">Order summary</Heading>
								<Badge size="sm">{items.reduce((n, i) => n + i.qty, 0)} items</Badge>
							</Inline>
						{/snippet}
						<Stack gap="4">
							{#if items.length === 0}
								<Text size="sm" tone="muted">Your cart is empty.</Text>
							{/if}
							<Stack as="ul" gap="3" class="lines">
								{#each items as item (item.id)}
									<li class="line">
										<div class="line__thumb" aria-hidden="true"></div>
										<Stack gap="0-5" class="line__body">
											<Text size="sm" weight="medium" truncate>{item.name}</Text>
											<Text size="xs" tone="muted">{item.variant}</Text>
											<div class="qty">
												<NumberInput
													value={item.qty}
													min={1}
													max={9}
													size="sm"
													controls="split"
													aria-label="Quantity for {item.name}"
													onValueChange={(v) => setQty(item.id, v ?? 1)}
												/>
											</div>
										</Stack>
										<Stack gap="1" align="end">
											<Text size="sm" numeric>{money.format(item.price * item.qty)}</Text>
											<button
												type="button"
												class="line__remove"
												aria-label="Remove {item.name}"
												onclick={() => remove(item.id)}><X /></button
											>
										</Stack>
									</li>
								{/each}
							</Stack>

							<Divider />

							{#if promoApplied}
								<Inline justify="between" align="center">
									<Inline gap="2">
										<TagIcon aria-hidden="true" class="icon" />
										<Text size="sm">Code <strong>{promoApplied}</strong> applied</Text>
									</Inline>
									<Button size="sm" variant="link" onclick={() => (promoApplied = null)}
										>Remove</Button
									>
								</Inline>
							{:else}
								<Field label="Promo code" error={promoError} hint="Try BOOK10.">
									<Input
										bind:value={promo}
										autocomplete="off"
										spellcheck={false}
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												applyPromo();
											}
										}}
									>
										{#snippet action()}
											<button type="button" onclick={applyPromo}>Apply</button>
										{/snippet}
									</Input>
								</Field>
							{/if}

							<Divider />

							<dl class="totals">
								<dt>Subtotal</dt>
								<dd>{money.format(subtotal)}</dd>
								{#if discount}
									<dt>Discount</dt>
									<dd class="totals__good">−{money.format(discount)}</dd>
								{/if}
								<dt>Shipping</dt>
								<dd>{shippingCost === 0 ? 'Free' : money.format(shippingCost)}</dd>
								<dt>Tax (8%)</dt>
								<dd>{money.format(tax)}</dd>
								<dt class="totals__total">Total</dt>
								<dd class="totals__total">{money.format(total)}</dd>
							</dl>
							<Text size="xs" tone="subtle">
								Encrypted checkout. By paying you agree to the
								<Link href="/patterns/checkout/" tone="inherit">terms of sale</Link>.
							</Text>
						</Stack>
					</Card>
				</aside>
			</Grid>
		{/if}
	</div>
</Demo>

<h2>Notes</h2>
<p>
	The summary is the source of truth: the pay button reads <code>total</code> from the same derived
	values the card shows, so the two can never disagree. Card number and expiry are formatted in an
	<code>oninput</code>
	handler rather than a bound value so the caret stays put. Quantities are
	<code>NumberInput</code>s in <code>controls="split"</code> form, so − / + and the arrow keys both work
	and the value can never leave 1–9.
</p>

<style>
	.checkout {
		max-width: 60rem;
	}
	@media (max-width: 48rem) {
		.checkout :global(.checkout__grid) {
			grid-template-columns: 1fr;
		}
		.summary {
			order: -1;
		}
	}
	.checkout :global(.done) {
		max-width: 32rem;
		margin-inline: auto;
	}
	.done__icon {
		display: inline-grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-full);
		background: var(--color-success-subtle);
		color: var(--color-success-text);
	}
	.done__icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}
	.summary {
		position: sticky;
		top: var(--space-4);
		align-self: start;
	}
	.checkout :global(.lines) {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.line {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--space-3);
		align-items: start;
	}
	.line__thumb {
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--color-component), var(--color-component-active));
		border: 1px solid var(--color-border);
	}
	.checkout :global(.line__body) {
		min-width: 0;
	}
	.qty {
		width: 7rem;
		margin-block-start: var(--space-1);
	}
	.line__remove {
		display: inline-grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		border-radius: var(--radius-xs);
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.line__remove:hover {
		color: var(--color-text);
		background: var(--color-component-hover);
	}
	.line__remove:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.line__remove :global(svg) {
		width: 0.9rem;
		height: 0.9rem;
	}
	.checkout :global(.icon) {
		width: 1em;
		height: 1em;
		color: var(--color-success-text);
	}
	.totals {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--space-1-5) var(--space-4);
		margin: 0;
		font-size: var(--text-sm);
	}
	.totals dt {
		color: var(--color-text-muted);
	}
	.totals dd {
		margin: 0;
		text-align: end;
		font-variant-numeric: var(--font-numeric);
	}
	.totals__good {
		color: var(--color-success-text);
	}
	.totals dt.totals__total,
	.totals dd.totals__total {
		margin-block-start: var(--space-1);
		padding-block-start: var(--space-2);
		border-block-start: 1px solid var(--color-border);
		color: var(--color-text);
		font-weight: var(--weight-semibold);
		font-size: var(--text-md);
	}
</style>
