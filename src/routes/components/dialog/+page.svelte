<script lang="ts">
	import { Dialog, Button, Field, Input, Stack, Text, Inline } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let programmatic = $state(false);
</script>

<h1>Dialog</h1>
<p class="lead">A modal window with focus trapping, scroll lock and Escape/overlay dismissal.</p>

<Demo
	title="Confirmation"
	code={`<Dialog title="Delete file" description="This cannot be undone.">
	{#snippet trigger(props)}<Button {...props} tone="danger">Delete file</Button>{/snippet}
	<p>The file will be removed from every device.</p>
	{#snippet footer({ close })}
		<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
		<Button tone="danger" onclick={close}>Delete</Button>
	{/snippet}
</Dialog>`}
>
	<Dialog title="Delete file" description="This cannot be undone." size="sm">
		{#snippet trigger(props)}<Button {...props} tone="danger" variant="outline">Delete file</Button
			>{/snippet}
		<Text>The file will be removed from every device you're signed in on.</Text>
		{#snippet footer({ close })}
			<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
			<Button tone="danger" onclick={close}>Delete</Button>
		{/snippet}
	</Dialog>
</Demo>

<Demo
	title="Form in a dialog"
	code={`<Dialog title="Invite teammate">
	{#snippet trigger(props)}<Button {...props}>Invite</Button>{/snippet}
	<Field label="Email"><Input type="email" /></Field>
	{#snippet footer({ close })}…{/snippet}
</Dialog>`}
>
	<Dialog title="Invite teammate" description="They'll get an email with a link to join.">
		{#snippet trigger(props)}<Button {...props}>Invite</Button>{/snippet}
		<Stack gap="4">
			<Field label="Email" required>
				<Input type="email" placeholder="name@company.com" />
			</Field>
			<Field label="Message" hint="Optional">
				<Input placeholder="Come join the workspace" />
			</Field>
		</Stack>
		{#snippet footer({ close })}
			<Button variant="ghost" tone="neutral" onclick={close}>Cancel</Button>
			<Button onclick={close}>Send invite</Button>
		{/snippet}
	</Dialog>
</Demo>

<Demo
	title="Sizes and non-dismissible"
	code={`<Dialog title="…" size="lg">…</Dialog>
<Dialog title="…" dismissible={false}>…</Dialog>`}
>
	<Inline gap="2">
		{#each ['sm', 'md', 'lg', 'full'] as size (size)}
			<Dialog title="Size {size}" size={size as 'md'}>
				{#snippet trigger(props)}<Button {...props} variant="soft" tone="neutral">{size}</Button
					>{/snippet}
				<Text>This dialog uses <code>size="{size}"</code>.</Text>
				{#snippet footer({ close })}<Button onclick={close}>Done</Button>{/snippet}
			</Dialog>
		{/each}
		<Dialog title="Accept the terms" dismissible={false}>
			{#snippet trigger(props)}<Button {...props} variant="outline" tone="neutral"
					>Not dismissible</Button
				>{/snippet}
			<Text>Escape and clicking outside do nothing here; the user must choose.</Text>
			{#snippet footer({ close })}
				<Button variant="ghost" tone="neutral" onclick={close}>Decline</Button>
				<Button onclick={close}>Accept</Button>
			{/snippet}
		</Dialog>
	</Inline>
</Demo>

<Demo
	title="Programmatic"
	code={`let open = $state(false);
<Button onclick={() => (open = true)}>Open</Button>
<Dialog bind:open title="Opened from code">…</Dialog>`}
>
	<Button onclick={() => (programmatic = true)} variant="soft">Open from code</Button>
	<Dialog bind:open={programmatic} title="Opened from code">
		<Text>No trigger snippet; the parent owns <code>open</code>.</Text>
		{#snippet footer({ close })}<Button onclick={close}>Close</Button>{/snippet}
	</Dialog>
</Demo>

<PropsTable
	rows={[
		{ name: 'open', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'title', type: 'string', description: 'Required; the accessible name.' },
		{ name: 'description', type: 'string' },
		{ name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'" },
		{ name: 'dismissible', type: 'boolean', default: 'true' },
		{ name: 'hideClose', type: 'boolean', default: 'false' },
		{ name: 'onOpenChange', type: '(open: boolean) => void' }
	]}
/>
<p>
	Snippets: <code>trigger(props)</code>, <code>children({'{ close }'})</code>,
	<code>footer({'{ close }'})</code>.
</p>
