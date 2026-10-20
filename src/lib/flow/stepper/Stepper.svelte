<script lang="ts" module>
	export interface Step {
		id: string;
		label: string;
		description?: string;
		/** Mark a completed step as needing attention. */
		error?: boolean;
	}

	export interface StepperProps {
		steps: Step[];
		/** Bindable: id of the current step. */
		current?: string;
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md';
		/** Let the user jump back to completed steps (and forward, when `linear` is false). */
		onStepClick?: (id: string) => void;
		/** Only completed steps are clickable. */
		linear?: boolean;
		/** Accessible name for the nav landmark. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { Check, AlertCircle } from '@lucide/svelte';

	let {
		steps,
		current = $bindable(),
		orientation = 'horizontal',
		size = 'md',
		onStepClick,
		linear = true,
		label = 'Progress',
		class: className
	}: StepperProps = $props();

	const currentIndex = $derived(
		Math.max(
			0,
			steps.findIndex((s) => s.id === (current ?? steps[0]?.id))
		)
	);

	function status(i: number): 'complete' | 'current' | 'upcoming' {
		return i < currentIndex ? 'complete' : i === currentIndex ? 'current' : 'upcoming';
	}
	function clickable(i: number) {
		if (!onStepClick) return false;
		return linear ? i < currentIndex : i !== currentIndex;
	}
	function go(i: number) {
		if (!clickable(i)) return;
		current = steps[i].id;
		onStepClick?.(steps[i].id);
	}
</script>

{#snippet inner(step: Step, i: number, state: 'complete' | 'current' | 'upcoming')}
	{@const error = Boolean(step.error && state === 'complete')}
	<span
		class="db-stepper__marker"
		data-state={state}
		data-error={error || undefined}
		aria-hidden="true"
	>
		{#if error}
			<AlertCircle />
		{:else if state === 'complete'}
			<Check />
		{:else}
			{i + 1}
		{/if}
	</span>
	<span class="db-stepper__text">
		<span class="db-stepper__label" data-state={state}>
			<span class="sr-only"
				>Step {i + 1} of {steps.length}{state === 'complete' ? ', completed' : ''}:</span
			>
			{step.label}
		</span>
		{#if step.description}<span class="db-stepper__description">{step.description}</span>{/if}
	</span>
{/snippet}

<nav
	class={['db-stepper', className]}
	aria-label={label}
	data-orientation={orientation}
	data-size={size}
>
	<ol class="db-stepper__list">
		{#each steps as step, i (step.id)}
			{@const state = status(i)}
			<li
				class="db-stepper__step"
				data-state={state}
				aria-current={state === 'current' ? 'step' : undefined}
			>
				{#if clickable(i)}
					<button type="button" class="db-stepper__item" onclick={() => go(i)}>
						{@render inner(step, i, state)}
					</button>
				{:else}
					<div class="db-stepper__item">{@render inner(step, i, state)}</div>
				{/if}
				{#if i < steps.length - 1}<span class="db-stepper__connector" aria-hidden="true"
					></span>{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.db-stepper {
		--_marker: 1.75rem;
		--_line: var(--color-border-strong);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text);
	}
	.db-stepper[data-size='sm'] {
		--_marker: 1.375rem;
		font-size: var(--text-xs);
	}
	.db-stepper__list {
		display: flex;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.db-stepper__step {
		position: relative;
		display: flex;
		align-items: flex-start;
		flex: 1;
		min-width: 0;
		gap: var(--space-2);
	}
	.db-stepper__step:last-child {
		flex: none;
	}
	.db-stepper__item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		min-width: 0;
		padding: 0;
		border-radius: var(--radius-sm);
		color: inherit;
		font: inherit;
		text-align: start;
	}
	button.db-stepper__item {
		cursor: pointer;
	}
	button.db-stepper__item:hover :global(.db-stepper__label) {
		color: var(--color-accent-text);
	}
	button.db-stepper__item:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-stepper__marker {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--_marker);
		height: var(--_marker);
		border-radius: var(--radius-full);
		border: 2px solid var(--_line);
		background: var(--color-surface);
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		font-variant-numeric: var(--font-numeric);
		transition: var(--transition-colors);
	}
	.db-stepper__marker :global(svg) {
		width: 60%;
		height: 60%;
	}
	.db-stepper__marker[data-state='current'] {
		border-color: var(--color-accent);
		color: var(--color-accent-text);
		box-shadow: 0 0 0 4px var(--color-accent-subtle);
	}
	.db-stepper__marker[data-state='complete'] {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-accent-fg);
	}
	.db-stepper__marker[data-error] {
		border-color: var(--color-danger);
		background: var(--color-danger);
		color: var(--color-danger-fg);
	}
	.db-stepper__text {
		display: grid;
		gap: var(--space-0-5);
		padding-block-start: calc((var(--_marker) - 1.25em) / 2);
		min-width: 0;
	}
	.db-stepper__label {
		font-weight: var(--weight-medium);
		line-height: 1.25;
		color: var(--color-text-muted);
	}
	.db-stepper__label[data-state='current'],
	.db-stepper__label[data-state='complete'] {
		color: var(--color-text);
	}
	.db-stepper__description {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
		line-height: var(--leading-snug);
	}
	.db-stepper__connector {
		flex: 1;
		height: 2px;
		margin-block-start: calc(var(--_marker) / 2 - 1px);
		background: var(--_line);
		border-radius: 1px;
	}
	.db-stepper__step[data-state='complete'] .db-stepper__connector {
		background: var(--color-accent);
	}

	/* vertical */
	.db-stepper[data-orientation='vertical'] .db-stepper__list {
		flex-direction: column;
		gap: 0;
	}
	.db-stepper[data-orientation='vertical'] .db-stepper__step {
		flex-direction: column;
		flex: none;
		gap: 0;
	}
	.db-stepper[data-orientation='vertical'] .db-stepper__connector {
		flex: none;
		width: 2px;
		min-height: var(--space-6);
		height: auto;
		margin: var(--space-1) 0 var(--space-1) calc(var(--_marker) / 2 - 1px);
	}
</style>
