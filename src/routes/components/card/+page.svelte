<script lang="ts">
	import { Card, Grid, Heading, Text, Button, Badge, Inline } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Card</h1>
<p class="lead">A surface that groups related content.</p>

<Demo title="Variants" stack code={`<Card variant="elevated">…</Card>`}>
	<Grid min="12rem" gap="4">
		{#each ['outlined', 'elevated', 'filled'] as variant (variant)}
			<Card variant={variant as 'outlined'}>
				<Text weight="semibold">{variant}</Text>
				<Text size="sm" tone="muted">Card body text.</Text>
			</Card>
		{/each}
	</Grid>
</Demo>

<Demo
	title="Header and footer"
	stack
	code={`<Card>
	{#snippet header()}…{/snippet}
	Body
	{#snippet footer()}…{/snippet}
</Card>`}
>
	<Card>
		{#snippet header()}
			<Inline justify="between" wrap={false}>
				<Heading level={3} size="sm">Billing</Heading>
				<Badge tone="success" dot>Active</Badge>
			</Inline>
		{/snippet}
		<Text>Your plan renews on 1 October. Invoices are emailed monthly.</Text>
		{#snippet footer()}
			<Inline justify="end">
				<Button size="sm" variant="ghost" tone="neutral">Cancel</Button>
				<Button size="sm">Manage</Button>
			</Inline>
		{/snippet}
	</Card>
</Demo>

<Demo title="Interactive link cards" stack code={`<Card href="/orders/42">…</Card>`}>
	<Grid min="12rem" gap="4">
		{#each ['Orders', 'Customers', 'Reports'] as t (t)}
			<Card href="/" variant="elevated">
				<Text weight="semibold">{t}</Text>
				<Text size="sm" tone="muted">Open {t.toLowerCase()} →</Text>
			</Card>
		{/each}
	</Grid>
</Demo>

<PropsTable
	rows={[
		{ name: 'as', type: "'div' | 'section' | 'article' | 'li' | 'a'", default: "'div'" },
		{ name: 'variant', type: "'outlined' | 'elevated' | 'filled'", default: "'outlined'" },
		{ name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'interactive', type: 'boolean', default: 'false', description: 'Implied by href.' },
		{ name: 'href', type: 'string', description: 'Render as a link.' }
	]}
/>
