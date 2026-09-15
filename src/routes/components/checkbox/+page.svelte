<script lang="ts">
	import { Checkbox, Stack, Field } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let items = $state([true, false, true]);
	const all = $derived(items.every(Boolean));
	const some = $derived(items.some(Boolean) && !all);
</script>

<h1>Checkbox</h1>
<p class="lead">Native checkbox with a custom box, descriptions and an indeterminate state.</p>

<Demo title="Basic" stack code={`<Checkbox bind:checked={agreed}>I agree to the terms</Checkbox>`}>
	<Stack gap="2">
		<Checkbox>Unchecked</Checkbox>
		<Checkbox checked>Checked</Checkbox>
		<Checkbox description="Get a summary every Monday morning.">Weekly digest</Checkbox>
		<Checkbox size="sm">Small</Checkbox>
	</Stack>
</Demo>

<Demo
	title="Select all (indeterminate)"
	stack
	code={`<Checkbox checked={all} indeterminate={some} onchange={(e) => items = items.map(() => e.currentTarget.checked)}>
	Select all
</Checkbox>`}
>
	<Stack gap="2">
		<Checkbox
			checked={all}
			indeterminate={some}
			onchange={(e) => (items = items.map(() => e.currentTarget.checked))}
		>
			Select all
		</Checkbox>
		<div style="padding-inline-start: var(--space-6)">
			<Stack gap="2">
				{#each items.keys() as i (i)}
					<Checkbox bind:checked={items[i]}>Item {i + 1}</Checkbox>
				{/each}
			</Stack>
		</div>
	</Stack>
</Demo>

<Demo
	title="States"
	stack
	code={`<Checkbox disabled>Disabled</Checkbox>\n<Checkbox invalid>Invalid</Checkbox>`}
>
	<Stack gap="2">
		<Checkbox disabled>Disabled</Checkbox>
		<Checkbox disabled checked>Disabled checked</Checkbox>
		<Field as="fieldset" error="You must accept the terms">
			<Checkbox>I accept the terms</Checkbox>
		</Field>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'checked', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'indeterminate', type: 'boolean', default: 'false' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'invalid', type: 'boolean', default: 'from Field' },
		{ name: 'description', type: 'string' },
		{ name: 'disabled / name / value / id', type: 'native', default: 'from Field' }
	]}
/>
