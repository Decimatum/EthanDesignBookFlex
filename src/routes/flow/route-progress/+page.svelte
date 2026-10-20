<script lang="ts">
	import { RouteProgress, Button, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let active = $state(false);
	function simulate(ms: number) {
		active = true;
		setTimeout(() => (active = false), ms);
	}
</script>

<h1>Route progress</h1>
<p class="lead">A top-of-viewport loading bar for navigations and long requests.</p>

<Demo title="Try it" stack code={`<RouteProgress active={navigating.to !== null} />`}>
	<RouteProgress {active} />
	<div style="display:flex; gap: var(--space-2); flex-wrap: wrap">
		<Button size="sm" variant="outline" tone="neutral" onclick={() => simulate(1800)}>
			Slow navigation (1.8s)
		</Button>
		<Button size="sm" variant="outline" tone="neutral" onclick={() => simulate(80)}>
			Fast navigation (80ms — no bar)
		</Button>
	</div>
	<Text size="sm" tone="muted">
		The docs site wires the real thing in its root layout, so every page change shows it.
	</Text>
</Demo>

<PropsTable
	rows={[
		{ name: 'active', type: 'boolean', description: 'Required.' },
		{ name: 'delay', type: 'number', default: '150', description: 'ms before it shows.' },
		{ name: 'height', type: 'string', default: "'3px'" },
		{ name: 'label', type: 'string', default: "'Loading page'" }
	]}
/>
