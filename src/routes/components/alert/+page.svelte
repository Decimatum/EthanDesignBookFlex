<script lang="ts">
	import { Alert, Button, Stack, type AlertTone } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const tones: AlertTone[] = ['info', 'success', 'warning', 'danger', 'neutral'];
</script>

<h1>Alert</h1>
<p class="lead">An inline message that stays in the page.</p>

<Demo
	title="Tones"
	stack
	code={`<Alert tone="warning" title="Market closed">Orders will queue until the open.</Alert>`}
>
	<Stack gap="3">
		<Alert tone="info" title="Heads up">Your session will expire in 5 minutes.</Alert>
		<Alert tone="success" title="Order filled">100 AAPL at 189.20, settled T+1.</Alert>
		<Alert tone="warning" title="Market closed">Orders placed now will queue until the open.</Alert>
		<Alert tone="danger" title="Connection lost">Reconnecting automatically…</Alert>
		<Alert tone="neutral">A neutral note without a title.</Alert>
	</Stack>
</Demo>

<Demo
	title="Actions and dismiss"
	stack
	code={`<Alert tone="danger" title="Connection lost" dismissible>
	Reconnecting…
	{#snippet actions()}<Button size="sm" tone="danger" variant="soft">Retry now</Button>{/snippet}
</Alert>`}
>
	<Alert tone="danger" title="Connection lost" dismissible>
		Reconnecting automatically. If this keeps happening, check your network.
		{#snippet actions()}
			<Button size="sm" tone="danger" variant="soft">Retry now</Button>
			<Button size="sm" tone="neutral" variant="ghost">Details</Button>
		{/snippet}
	</Alert>
</Demo>

<Demo title="Without icon" stack code={`<Alert icon={null}>…</Alert>`}>
	<Alert icon={null} tone="success"
		>Changes saved. Icons are optional when the text is enough.</Alert
	>
</Demo>

<PropsTable
	rows={[
		{ name: 'tone', type: tones.map((t) => `'${t}'`).join(' | '), default: "'info'" },
		{ name: 'title', type: 'string' },
		{ name: 'dismissible', type: 'boolean', default: 'false' },
		{ name: 'onDismiss', type: '() => void' },
		{
			name: 'icon',
			type: 'Snippet | null',
			default: 'by tone',
			description: 'null hides the icon.'
		}
	]}
/>
<p>Snippets: <code>children</code>, <code>actions</code>.</p>
