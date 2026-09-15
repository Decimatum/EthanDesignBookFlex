<script lang="ts">
	import { Input, Field, Stack, Grid } from '$lib/index.js';
	import { Search, Mail, Lock } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let q = $state('');
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
		{ name: 'disabled / required / id', type: 'native', default: 'from Field' }
	]}
/>
