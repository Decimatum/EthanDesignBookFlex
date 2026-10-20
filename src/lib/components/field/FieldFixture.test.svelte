<!-- Test fixture: Field wrapping an Input, so the context wiring can be asserted. -->
<script lang="ts">
	import Field from './Field.svelte';
	import Input from '../input/Input.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';
	let {
		error,
		hint,
		disabled = false,
		required = false,
		control = 'input'
	}: {
		error?: string;
		hint?: string;
		disabled?: boolean;
		required?: boolean;
		control?: 'input' | 'checkbox' | 'fieldset';
	} = $props();
</script>

{#if control === 'checkbox'}
	<Field label="Email" {hint} {error} {disabled} {required}>
		<Checkbox>Subscribe</Checkbox>
	</Field>
{:else if control === 'fieldset'}
	<Field as="fieldset" label="Alerts" {hint} {error} {disabled} {required}>
		<Checkbox>Fills</Checkbox>
		<Checkbox>Price</Checkbox>
	</Field>
{:else}
	<Field label="Email" {hint} {error} {disabled} {required}>
		<Input placeholder="you@example.com" />
	</Field>
{/if}
