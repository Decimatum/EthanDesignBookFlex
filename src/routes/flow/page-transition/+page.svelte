<script lang="ts">
	import { PageTransition, Button, ButtonGroup, Card, Text, Stack, Heading } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const pages = ['Summary', 'Positions', 'Activity'];
	let page = $state(0);
	let kind = $state<'fade' | 'slide' | 'slide-up'>('slide');
</script>

<h1>Page transition</h1>
<p class="lead">
	Animate between screens: the View Transitions API across routes, or a keyed Svelte transition
	inside a page.
</p>

<Demo
	title="Keyed transition"
	stack
	code={`<PageTransition key={page} kind="slide">
	{#if page === 0}<Summary />{:else if page === 1}<Positions />{:else}<Activity />{/if}
</PageTransition>`}
>
	<Stack gap="3">
		<div style="display:flex; gap: var(--space-3); flex-wrap: wrap; align-items:center">
			<ButtonGroup label="Page">
				{#each pages as p, i (p)}
					<Button
						size="sm"
						tone="neutral"
						variant={page === i ? 'solid' : 'outline'}
						onclick={() => (page = i)}>{p}</Button
					>
				{/each}
			</ButtonGroup>
			<ButtonGroup label="Kind">
				{#each ['fade', 'slide', 'slide-up'] as k (k)}
					<Button
						size="sm"
						tone="neutral"
						variant={kind === k ? 'solid' : 'outline'}
						onclick={() => (kind = k as typeof kind)}>{k}</Button
					>
				{/each}
			</ButtonGroup>
		</div>
		<PageTransition key={page} {kind}>
			<Card>
				<Stack gap="2">
					<Heading level={3} size="md">{pages[page]}</Heading>
					<Text tone="muted">
						{#if page === 0}Net liquidation, day P&L and buying power at a glance.
						{:else if page === 1}Twelve open positions across four accounts.
						{:else}Fills, transfers and corporate actions from the last 30 days.{/if}
					</Text>
				</Stack>
			</Card>
		</PageTransition>
	</Stack>
</Demo>

<Demo
	title="Across routes (View Transitions API)"
	stack
	code={`// +layout.svelte
import { onNavigate } from '$app/navigation';
import { viewTransition, slideByDepth } from '@ethan/designbook';
onNavigate(viewTransition({ pick: slideByDepth }));`}
>
	<Text size="sm" tone="muted">
		This docs site does exactly this — click any sidebar link and the page crossfades (slides when
		the route depth changes). Browsers without the API just swap; reduced motion disables it.
	</Text>
</Demo>

<PropsTable
	title="PageTransition props"
	rows={[
		{ name: 'key', type: 'unknown', description: 'Required; change to animate.' },
		{ name: 'kind', type: "'fade' | 'slide' | 'slide-up'", default: "'fade'" },
		{ name: 'duration', type: 'number', default: '--duration-slow', description: 'ms.' }
	]}
/>
<PropsTable
	title="viewTransition(options)"
	rows={[
		{ name: 'kind', type: "'fade' | 'slide' | 'none'", default: "'fade'" },
		{ name: 'pick', type: '(navigation) => kind', description: 'e.g. slideByDepth.' }
	]}
/>
