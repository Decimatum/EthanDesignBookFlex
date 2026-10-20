<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
		/** Signed change. Sign decides the colour and arrow; `0` is neutral. */
		value: number;
		/** How to render the number. `percent` appends %, `currency` uses `currency`. */
		format?: 'number' | 'percent' | 'currency';
		currency?: string;
		locale?: string;
		/** Decimal places. */
		digits?: number;
		/** Flip the meaning: a positive number is bad (costs, latency, risk). */
		invert?: boolean;
		/** Show the arrow glyph. */
		arrow?: boolean;
		/** Filled pill instead of plain coloured text. */
		variant?: 'text' | 'pill';
		size?: 'sm' | 'md';
		class?: string;
	}
</script>

<script lang="ts">
	import { ArrowUpRight, ArrowDownRight, Minus } from '@lucide/svelte';

	let {
		value,
		format = 'number',
		currency = 'USD',
		locale,
		digits = 2,
		invert = false,
		arrow = true,
		variant = 'text',
		size = 'md',
		class: className,
		...rest
	}: DeltaProps = $props();

	const direction = $derived(value > 0 ? 'up' : value < 0 ? 'down' : 'flat');
	// Tone is about good/bad, direction about up/down — `invert` decouples them.
	const tone = $derived(
		direction === 'flat' ? 'neutral' : (direction === 'up') !== invert ? 'positive' : 'negative'
	);
	const text = $derived.by(() => {
		const abs = Math.abs(value);
		const opts: Intl.NumberFormatOptions = {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		};
		if (format === 'currency') Object.assign(opts, { style: 'currency', currency });
		const n = new Intl.NumberFormat(locale, opts).format(format === 'percent' ? abs : abs);
		const body = format === 'percent' ? `${n}%` : n;
		return value > 0 ? `+${body}` : value < 0 ? `−${body}` : body;
	});
	const srDirection = $derived(
		direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'unchanged'
	);
</script>

<span
	{...rest}
	class={['db-delta', className]}
	data-tone={tone}
	data-direction={direction}
	data-variant={variant}
	data-size={size}
>
	{#if arrow}
		<span class="db-delta__arrow" aria-hidden="true">
			{#if direction === 'up'}<ArrowUpRight />{:else if direction === 'down'}<ArrowDownRight
				/>{:else}<Minus />{/if}
		</span>
	{/if}
	<span class="db-delta__value">{text}</span>
	<span class="sr-only">, {srDirection}</span>
</span>

<style>
	.db-delta {
		--_fg: var(--color-text-muted);
		--_bg: transparent;
		display: inline-flex;
		align-items: center;
		gap: 0.15em;
		color: var(--_fg);
		background: var(--_bg);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		font-variant-numeric: var(--font-numeric);
		line-height: 1;
		white-space: nowrap;
		vertical-align: middle;
	}
	.db-delta[data-size='sm'] {
		font-size: var(--text-xs);
	}
	.db-delta[data-tone='positive'] {
		--_fg: var(--color-positive-text);
		--_bg: var(--color-success-subtle);
	}
	.db-delta[data-tone='negative'] {
		--_fg: var(--color-negative-text);
		--_bg: var(--color-danger-subtle);
	}
	.db-delta[data-tone='neutral'] {
		--_bg: var(--color-component);
	}
	.db-delta[data-variant='text'] {
		background: none;
	}
	.db-delta[data-variant='pill'] {
		padding: 0.2em 0.5em 0.2em 0.35em;
		border-radius: var(--radius-full);
	}
	.db-delta__arrow {
		display: inline-flex;
		width: 1em;
		height: 1em;
	}
	.db-delta__arrow :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
