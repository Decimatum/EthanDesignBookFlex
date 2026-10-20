<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
		/** 0–100. Omit for an indeterminate bar. */
		value?: number;
		/** Visible label; also the accessible name. */
		label?: string;
		/** Show the percentage next to the label. */
		showValue?: boolean;
		size?: 'sm' | 'md' | 'lg';
		tone?: 'accent' | 'success' | 'warning' | 'danger';
		class?: string;
	}
</script>

<script lang="ts">
	let {
		value,
		label,
		showValue = false,
		size = 'md',
		tone = 'accent',
		class: className,
		'aria-label': ariaLabel,
		...rest
	}: ProgressProps = $props();

	const clamped = $derived(value === undefined ? undefined : Math.min(100, Math.max(0, value)));
	const id = $props.id();
</script>

<div {...rest} class={['db-progress', className]} data-size={size} data-tone={tone}>
	{#if label || showValue}
		<div class="db-progress__meta">
			{#if label}<span class="db-progress__label" id="db-progress-{id}">{label}</span>{/if}
			{#if showValue && clamped !== undefined}
				<span class="db-progress__value">{Math.round(clamped)}%</span>
			{/if}
		</div>
	{/if}
	<div
		class="db-progress__track"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={clamped}
		aria-labelledby={label ? `db-progress-${id}` : undefined}
		aria-label={label ? undefined : (ariaLabel ?? 'Progress')}
		data-indeterminate={clamped === undefined || undefined}
	>
		<div
			class="db-progress__bar"
			style:width={clamped === undefined ? undefined : `${clamped}%`}
		></div>
	</div>
</div>

<style>
	.db-progress {
		--_h: 0.5rem;
		--_fill: var(--color-accent);
		display: flex;
		flex-direction: column;
		gap: var(--space-1-5);
		width: 100%;
		font-family: var(--font-body);
	}
	.db-progress[data-size='sm'] {
		--_h: 0.25rem;
	}
	.db-progress[data-size='lg'] {
		--_h: 0.75rem;
	}
	.db-progress[data-tone='success'] {
		--_fill: var(--color-success);
	}
	.db-progress[data-tone='warning'] {
		--_fill: var(--color-warning);
	}
	.db-progress[data-tone='danger'] {
		--_fill: var(--color-danger);
	}
	.db-progress__meta {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		font-size: var(--text-sm);
	}
	.db-progress__label {
		color: var(--color-text);
		font-weight: var(--weight-medium);
	}
	.db-progress__value {
		color: var(--color-text-muted);
		font-variant-numeric: var(--font-numeric);
	}
	.db-progress__track {
		position: relative;
		height: var(--_h);
		overflow: hidden;
		border-radius: var(--radius-full);
		background: var(--color-component);
	}
	.db-progress__bar {
		height: 100%;
		border-radius: inherit;
		background: var(--_fill);
		transition: width var(--duration-slow) var(--ease-standard);
	}
	.db-progress__track[data-indeterminate] .db-progress__bar {
		position: absolute;
		width: 40%;
		animation: db-progress-slide 1.4s var(--ease-in-out) infinite;
	}
	@keyframes db-progress-slide {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(250%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.db-progress__track[data-indeterminate] .db-progress__bar {
			animation-duration: 3s;
		}
	}
</style>
