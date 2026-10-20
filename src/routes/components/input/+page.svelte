<script lang="ts">
	import { Input, Field, Stack, Grid } from '$lib/index.js';
	import { Search, Mail, Lock, Eye, EyeOff, X } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let q = $state('');
	let secret = $state('hunter2');
	let show = $state(false);
	let query = $state('svelte runes');
</script>

<h1>Input</h1>
<p class="lead">Single-line text input with adornments, sizes and validation states.</p>

<Demo
	title="Basic"
	stack
	code={`<Input bind:value={q} placeholder="Search…" aria-label="Search" />`}
>
	<Input bind:value={q} placeholder="Search…" aria-label="Search" />
</Demo>

<Demo title="Sizes" stack code={`<Input size="sm" />`}>
	<Stack gap="3" align="start">
		<Input size="sm" placeholder="Small" aria-label="Small" />
		<Input size="md" placeholder="Medium" aria-label="Medium" />
		<Input size="lg" placeholder="Large" aria-label="Large" />
	</Stack>
</Demo>

<Demo
	title="Adornments"
	stack
	code={`<Input placeholder="Search" aria-label="Search">
	{#snippet leading()}<Search />{/snippet}
</Input>
<Input type="number" numeric aria-label="Amount">
	{#snippet leading()}\${/snippet}
	{#snippet trailing()}USD{/snippet}
</Input>`}
>
	<Grid min="14rem" gap="3">
		<Input placeholder="Search" aria-label="Search">
			{#snippet leading()}<Search />{/snippet}
		</Input>
		<Input type="email" placeholder="Email" aria-label="Email">
			{#snippet leading()}<Mail />{/snippet}
		</Input>
		<Input type="password" placeholder="Password" aria-label="Password">
			{#snippet leading()}<Lock />{/snippet}
		</Input>
		<Input type="number" numeric placeholder="0.00" aria-label="Amount" inputmode="decimal">
			{#snippet leading()}${/snippet}
			{#snippet trailing()}USD{/snippet}
		</Input>
	</Grid>
</Demo>

<Demo
	title="Action"
	stack
	code={`<Input type={show ? 'text' : 'password'} bind:value={secret} aria-label="Password">
	{#snippet action()}
		<button type="button" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onclick={() => (show = !show)}>
			{#if show}<EyeOff />{:else}<Eye />{/if}
		</button>
	{/snippet}
</Input>
<Input bind:value={query} aria-label="Search">
	{#snippet action()}
		{#if query}<button type="button" aria-label="Clear" onclick={() => (query = '')}><X /></button>{/if}
	{/snippet}
</Input>`}
>
	<Grid min="14rem" gap="3">
		<Input type={show ? 'text' : 'password'} bind:value={secret} aria-label="Password">
			{#snippet leading()}<Lock />{/snippet}
			{#snippet action()}
				<button
					type="button"
					aria-label={show ? 'Hide password' : 'Show password'}
					aria-pressed={show}
					onclick={() => (show = !show)}
				>
					{#if show}<EyeOff />{:else}<Eye />{/if}
				</button>
			{/snippet}
		</Input>
		<Input bind:value={query} placeholder="Search" aria-label="Search">
			{#snippet leading()}<Search />{/snippet}
			{#snippet action()}
				{#if query}<button type="button" aria-label="Clear search" onclick={() => (query = '')}
						><X /></button
					>{/if}
			{/snippet}
		</Input>
	</Grid>
</Demo>

<Demo
	title="States"
	stack
	code={`<Input invalid value="bad" />\n<Input disabled value="Locked" />`}
>
	<Grid min="14rem" gap="3">
		<Field label="Invalid" error="Already taken">
			<Input value="ada" />
		</Field>
		<Field label="Disabled" disabled>
			<Input value="Locked" />
		</Field>
		<Field label="Read only">
			<Input value="Read only" readonly />
		</Field>
	</Grid>
</Demo>

<PropsTable
	rows={[
		{ name: 'value', type: 'string | number | null', default: "''", description: 'Bindable.' },
		{ name: 'type', type: 'string', default: "'text'" },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
		{ name: 'invalid', type: 'boolean', default: 'from Field' },
		{ name: 'numeric', type: 'boolean', default: 'false', description: 'Tabular numerals.' },
		{ name: 'disabled / required / id', type: 'native', default: 'from Field' },
		{
			name: 'leading / trailing',
			type: 'Snippet',
			description: 'Decorative adornments (aria-hidden).'
		},
		{
			name: 'action',
			type: 'Snippet',
			description:
				'An interactive control after the value — clear, show/hide password. A plain <button> inside is styled; give it an aria-label.'
		}
	]}
/>
