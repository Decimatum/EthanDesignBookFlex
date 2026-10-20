<script lang="ts">
	import {
		Stepper,
		PageTransition,
		Button,
		Card,
		Stack,
		Text,
		Heading,
		Field,
		Input
	} from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const steps = [
		{ id: 'details', label: 'Details', description: 'Name and email' },
		{ id: 'funding', label: 'Funding', description: 'Link a bank' },
		{ id: 'review', label: 'Review' },
		{ id: 'done', label: 'Done' }
	];
	let current = $state('funding');
	const index = $derived(steps.findIndex((s) => s.id === current));
	const next = () => (current = steps[Math.min(steps.length - 1, index + 1)].id);
	const back = () => (current = steps[Math.max(0, index - 1)].id);
</script>

<h1>Stepper</h1>
<p class="lead">Progress through a multi-step flow, with a way back to completed steps.</p>

<Demo
	title="Wizard"
	stack
	code={`<Stepper {steps} bind:current onStepClick={(id) => (current = id)} />
<PageTransition key={current} kind="slide">…step body…</PageTransition>`}
>
	<Stack gap="5">
		<Stepper {steps} bind:current onStepClick={(id) => (current = id)} />
		<PageTransition key={current} kind="slide">
			<Card>
				<Stack gap="3">
					<Heading level={3} size="md">{steps[index].label}</Heading>
					{#if current === 'details'}
						<Field label="Full name"><Input placeholder="Ada Lovelace" /></Field>
					{:else if current === 'funding'}
						<Field label="Routing number"><Input placeholder="021000021" /></Field>
					{:else if current === 'review'}
						<Text tone="muted">Check everything, then confirm.</Text>
					{:else}
						<Text tone="muted">Your account is open.</Text>
					{/if}
					<div style="display:flex; gap: var(--space-2); justify-content:flex-end">
						<Button variant="ghost" tone="neutral" onclick={back} disabled={index === 0}
							>Back</Button
						>
						<Button onclick={next} disabled={index === steps.length - 1}>
							{index === steps.length - 2 ? 'Confirm' : 'Continue'}
						</Button>
					</div>
				</Stack>
			</Card>
		</PageTransition>
	</Stack>
</Demo>

<Demo
	title="Vertical, small, with an error"
	stack
	code={`<Stepper {steps} current="review" orientation="vertical" size="sm" />`}
>
	<Stepper
		steps={[
			{ id: 'a', label: 'Identity verified' },
			{ id: 'b', label: 'Funding', description: 'Bank link failed — retry', error: true },
			{ id: 'c', label: 'Review' },
			{ id: 'd', label: 'Done' }
		]}
		current="c"
		orientation="vertical"
		size="sm"
		label="Onboarding"
		onStepClick={() => {}}
	/>
</Demo>

<PropsTable
	rows={[
		{ name: 'steps', type: 'Step[]', description: 'Required: id, label, description?, error?.' },
		{ name: 'current', type: 'string', description: 'Bindable id.' },
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'onStepClick', type: '(id) => void', description: 'Makes steps clickable.' },
		{
			name: 'linear',
			type: 'boolean',
			default: 'true',
			description: 'Only completed steps clickable.'
		},
		{ name: 'label', type: 'string', default: "'Progress'" }
	]}
/>
