<script lang="ts">
	import { Field, Input, Textarea, Checkbox, Stack, Button } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let email = $state('');
	let submitted = $state(false);
	const emailError = $derived(
		submitted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address' : undefined
	);
</script>

<h1>Field</h1>
<p class="lead">Label, hint and error for any control, with the aria wiring done for you.</p>

<Demo
	title="Label, hint, error"
	stack
	code={`<Field label="Email" hint="We never share it." required error={emailError}>
	<Input type="email" bind:value={email} />
</Field>`}
>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			submitted = true;
		}}
	>
		<Stack gap="4" align="start">
			<Field label="Email" hint="We never share it." required error={emailError}>
				<Input type="email" bind:value={email} placeholder="you@example.com" />
			</Field>
			<Button type="submit" size="sm">Validate</Button>
		</Stack>
	</form>
</Demo>

<Demo
	title="States"
	stack
	code={`<Field label="Disabled" disabled><Input value="Read only" /></Field>`}
>
	<Stack gap="4">
		<Field label="Disabled" disabled hint="Cannot be edited">
			<Input value="Locked value" />
		</Field>
		<Field label="Invalid" error="This value is already taken">
			<Input value="ada" />
		</Field>
		<Field label="Bio" hint="Markdown supported">
			<Textarea rows={2} placeholder="Tell us about yourself" />
		</Field>
	</Stack>
</Demo>

<Demo
	title="Group of controls"
	stack
	code={`<Field as="fieldset" label="Notifications" hint="Choose any">
	<Checkbox>Email</Checkbox>
	<Checkbox>Push</Checkbox>
</Field>`}
>
	<Field as="fieldset" label="Notifications" hint="Choose any">
		<Checkbox checked>Email</Checkbox>
		<Checkbox>Push</Checkbox>
		<Checkbox>SMS</Checkbox>
	</Field>
</Demo>

<PropsTable
	rows={[
		{ name: 'label', type: 'string' },
		{ name: 'hint', type: 'string', description: 'Hidden while error is set.' },
		{ name: 'error', type: 'string', description: 'Marks invalid; announced via role=alert.' },
		{ name: 'required', type: 'boolean', default: 'false' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'as', type: "'div' | 'fieldset'", default: "'div'" },
		{ name: 'id', type: 'string', default: 'generated' }
	]}
/>
