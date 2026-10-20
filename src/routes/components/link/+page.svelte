<script lang="ts">
	import { Link, Text, Stack } from '$lib/index.js';
	import { FileText } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Link</h1>
<p class="lead">Inline text links for prose and tables.</p>

<Demo
	title="In prose"
	stack
	code={`<p>Read the <Link href="/docs">order guide</Link> before trading.</p>
<Link href="https://www.sec.gov" external>SEC filings</Link>`}
>
	<Text>
		Read the <Link href="/components/link/">order guide</Link> before placing your first trade, and check
		the <Link href="https://www.sec.gov" external>SEC filings</Link> for anything unusual.
	</Text>
</Demo>

<Demo
	title="Tones"
	stack
	code={`<Link href="/x" tone="inherit">Inherit</Link>
<Link href="/x" tone="muted" subtle>Muted, subtle</Link>`}
>
	<Stack gap="2">
		<Text>Accent (default): <Link href="/components/link/">positions</Link></Text>
		<Text>Inherit: <Link href="/components/link/" tone="inherit">positions</Link></Text>
		<Text tone="muted"
			>Muted, subtle: <Link href="/components/link/" tone="muted" subtle>positions</Link></Text
		>
		<Text>
			With a trailing icon: <Link href="/components/link/">
				statement
				{#snippet trailing()}<FileText />{/snippet}
			</Link>
		</Text>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'href', type: 'string', description: 'Required.' },
		{ name: 'tone', type: "'accent' | 'inherit' | 'muted'", default: "'accent'" },
		{ name: 'subtle', type: 'boolean', default: 'false', description: 'Underline on hover only.' },
		{
			name: 'external',
			type: 'boolean',
			default: 'false',
			description: 'New tab, safe rel, icon.'
		},
		{ name: 'trailing', type: 'Snippet', description: 'Icon after the label.' }
	]}
/>
