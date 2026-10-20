<script lang="ts">
	import { EmptyState, Button, Card } from '$lib/index.js';
	import { Inbox, SearchX } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Empty state</h1>
<p class="lead">What a list, table or page shows when there is nothing in it yet.</p>

<Demo
	title="With icon and actions"
	stack
	code={`<EmptyState title="No open orders" description="Orders you place will appear here until they fill.">
	{#snippet icon()}<Inbox />{/snippet}
	{#snippet actions()}
		<Button>New order</Button>
		<Button variant="ghost" tone="neutral">Import</Button>
	{/snippet}
</EmptyState>`}
>
	<EmptyState
		title="No open orders"
		description="Orders you place will appear here until they fill."
	>
		{#snippet icon()}<Inbox />{/snippet}
		{#snippet actions()}
			<Button>New order</Button>
			<Button variant="ghost" tone="neutral">Import</Button>
		{/snippet}
	</EmptyState>
</Demo>

<Demo
	title="Small, inside a card"
	stack
	code={`<EmptyState size="sm" title="No results" description="…" />`}
>
	<Card>
		<EmptyState size="sm" title="No results for “tsla calls”" description="Try a wider date range.">
			{#snippet icon()}<SearchX />{/snippet}
		</EmptyState>
	</Card>
</Demo>

<PropsTable
	rows={[
		{ name: 'title', type: 'string', description: 'Required.' },
		{ name: 'description', type: 'string' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'icon', type: 'Snippet', description: 'Decorative.' },
		{ name: 'actions', type: 'Snippet' }
	]}
/>
