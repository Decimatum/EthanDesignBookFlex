<script lang="ts">
	import { Accordion, AccordionItem, Text } from '$lib/index.js';
	import { CreditCard, ShieldCheck, Bell } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let open = $state('fees');
	let many = $state<string[]>(['security']);
</script>

<h1>Accordion</h1>
<p class="lead">Stacked disclosure sections; one open at a time or as many as the reader likes.</p>

<Demo
	title="Single (default)"
	stack
	code={`<Accordion bind:value={open}>
	<AccordionItem value="fees" title="Fees" description="What you pay per trade">…</AccordionItem>
	<AccordionItem value="limits" title="Limits">…</AccordionItem>
	<AccordionItem value="closed" title="Closed" disabled>…</AccordionItem>
</Accordion>`}
>
	<Accordion bind:value={open}>
		<AccordionItem value="fees" title="Fees" description="What you pay per trade">
			<Text>Zero commission on stocks and ETFs. Options are $0.65 per contract.</Text>
		</AccordionItem>
		<AccordionItem value="limits" title="Limits" description="Daily and per-order caps">
			<Text>Withdrawals are capped at $50,000 per day; larger amounts need a wire.</Text>
		</AccordionItem>
		<AccordionItem value="closed" title="Tax documents" disabled>
			<Text>Available from February.</Text>
		</AccordionItem>
	</Accordion>
</Demo>

<Demo
	title="Multiple, divided, with icons"
	stack
	code={`<Accordion type="multiple" variant="divided" bind:value={many}>
	<AccordionItem value="billing" title="Billing">
		{#snippet leading()}<CreditCard />{/snippet}
		…
	</AccordionItem>
</Accordion>`}
>
	<Accordion type="multiple" variant="divided" bind:value={many}>
		<AccordionItem value="billing" title="Billing">
			{#snippet leading()}<CreditCard />{/snippet}
			<Text>Plan, invoices and payment method.</Text>
		</AccordionItem>
		<AccordionItem value="security" title="Security">
			{#snippet leading()}<ShieldCheck />{/snippet}
			<Text>Password, two-factor authentication and active sessions.</Text>
		</AccordionItem>
		<AccordionItem value="notifications" title="Notifications">
			{#snippet leading()}<Bell />{/snippet}
			<Text>Fills, price alerts and the weekly digest.</Text>
		</AccordionItem>
	</Accordion>
</Demo>

<PropsTable
	title="Accordion props"
	rows={[
		{ name: 'type', type: "'single' | 'multiple'", default: "'single'" },
		{ name: 'value', type: 'string | string[]', description: 'Bindable.' },
		{ name: 'variant', type: "'bordered' | 'divided'", default: "'bordered'" },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'onValueChange', type: '(value: string | string[]) => void' }
	]}
/>
<PropsTable
	title="AccordionItem props"
	rows={[
		{ name: 'value', type: 'string', description: 'Required.' },
		{ name: 'title', type: 'string', description: 'Required.' },
		{ name: 'description', type: 'string' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'leading', type: 'Snippet', description: 'Icon before the title.' }
	]}
/>
