<!-- Test fixture: Field wrapping an Input, so the context wiring can be asserted. -->
<script lang="ts">
	import Field from './Field.svelte';
	import Input from '../input/Input.svelte';
	let {
		error,
		hint,
		disabled = false,
		required = false
	}: { error?: string; hint?: string; disabled?: boolean; required?: boolean } = $props();
</script>

<Field label="Email" {hint} {error} {disabled} {required}>
	<Input placeholder="you@example.com" />
</Field>
