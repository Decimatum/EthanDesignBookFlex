<script lang="ts">
	import { Switch, Stack } from '$lib/index.js';
	import { theme } from '$lib/theme/theme.svelte.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Switch</h1>
<p class="lead">An on/off toggle for settings that apply immediately.</p>

<Demo
	title="Live: dark mode"
	stack
	code={`<Switch checked={theme.resolvedScheme === 'dark'} onchange={() => theme.toggleScheme()}>
	Dark mode
</Switch>`}
>
	<Switch checked={theme.resolvedScheme === 'dark'} onchange={() => theme.toggleScheme()}>
		Dark mode
	</Switch>
</Demo>

<Demo
	title="Variants"
	stack
	code={`<Switch size="sm">Small</Switch>\n<Switch labelPosition="start">Label first</Switch>`}
>
	<Stack gap="3" align="start">
		<Switch>Default</Switch>
		<Switch checked>Checked</Switch>
		<Switch size="sm">Small</Switch>
		<Switch labelPosition="start" description="Sends a push notification">Alerts</Switch>
		<Switch disabled>Disabled</Switch>
		<Switch disabled checked>Disabled on</Switch>
	</Stack>
</Demo>

<PropsTable
	rows={[
		{ name: 'checked', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'labelPosition', type: "'start' | 'end'", default: "'end'" },
		{ name: 'description', type: 'string' },
		{ name: 'disabled / name / id', type: 'native', default: 'from Field' }
	]}
/>
