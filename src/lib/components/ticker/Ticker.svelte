<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TickerItem {
		id: string;
		/** Symbol or short name. */
		label: string;
		/** Price or figure. Numbers are formatted with `digits`; strings are shown as-is. */
		value: number | string;
		/** Signed change, rendered as a Delta. */
		change?: number;
		/** How `change` is rendered. */
		changeFormat?: 'percent' | 'number' | 'currency';
		href?: string;
	}

	export interface TickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		items: TickerItem[];
		/** Scroll speed in CSS pixels per second. */
		speed?: number;
		direction?: 'left' | 'right';
		/** Stop while the pointer is over the ticker (or focus is inside it). */
		pauseOnHover?: boolean;
		/** Bindable. `true` stops the animation; the pause button toggles it. */
		paused?: boolean;
		/** Show the pause / play button. Keep it unless you provide your own pause control. */
		controls?: boolean;
		/** Accessible name for the region. */
		label?: string;
		size?: 'sm' | 'md';
		/** Decimals for numeric values. */
		digits?: number;
		locale?: string;
		currency?: string;
		/** Briefly tint an item when its value changes (up = positive, down = negative). */
		flash?: boolean;
		onItemClick?: (item: TickerItem) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Pause, Play } from '@lucide/svelte';
	import Delta from '../delta/Delta.svelte';

	let {
		items,
		speed = 40,
		direction = 'left',
		pauseOnHover = true,
		paused = $bindable(false),
		controls = true,
		label = 'Ticker',
		size = 'md',
		digits = 2,
		locale,
		currency = 'USD',
		flash = true,
		onItemClick,
		class: className,
		...rest
	}: TickerProps = $props();

	const formatter = $derived(
		new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
	);
	const text = (v: number | string) => (typeof v === 'number' ? formatter.format(v) : v);

	// --- Motion -----------------------------------------------------------------
	// Reduced motion: no animation at all; the strip becomes an ordinary scrollable row.
	let reduced = $state(false);
	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => (reduced = mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});

	// Enough copies of the group to cover the viewport plus one, so the loop never shows a gap.
	let viewport = $state<HTMLDivElement | null>(null);
	let group = $state<HTMLUListElement | null>(null);
	let groupWidth = $state(0);
	let viewportWidth = $state(0);
	$effect(() => {
		if (!viewport || !group || typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(() => {
			groupWidth = group!.getBoundingClientRect().width;
			viewportWidth = viewport!.clientWidth;
		});
		ro.observe(viewport);
		ro.observe(group);
		return () => ro.disconnect();
	});
	const copies = $derived(
		reduced || groupWidth === 0 ? 1 : Math.max(2, Math.ceil(viewportWidth / groupWidth) + 1)
	);
	const duration = $derived(groupWidth > 0 ? groupWidth / Math.max(1, speed) : 0);
	const running = $derived(!reduced && !paused && duration > 0);

	// --- Flash on change ----------------------------------------------------------
	let flashes = $state<Record<string, 'up' | 'down'>>({});
	// Bookkeeping only — deliberately not reactive, so the effect below doesn't re-run itself.
	let previous = new Map<string, number | string>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const timers = new Map<string, ReturnType<typeof setTimeout>>();
	$effect(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const next = new Map<string, number | string>();
		for (const item of items) {
			next.set(item.id, item.value);
			const before = previous.get(item.id);
			if (
				flash &&
				before !== undefined &&
				before !== item.value &&
				typeof before === 'number' &&
				typeof item.value === 'number'
			) {
				const dir = item.value > before ? 'up' : 'down';
				flashes = { ...untrack(() => flashes), [item.id]: dir };
				clearTimeout(timers.get(item.id));
				timers.set(
					item.id,
					setTimeout(() => {
						const next = { ...flashes };
						delete next[item.id];
						flashes = next;
					}, 800)
				);
			}
		}
		previous = next;
	});
	$effect(() => () => timers.forEach((t) => clearTimeout(t)));
</script>

{#snippet entry(item: TickerItem, hidden: boolean)}
	<li class="db-ticker__item" data-flash={flashes[item.id]}>
		{#if item.href}
			<a
				class="db-ticker__link"
				href={item.href}
				tabindex={hidden ? -1 : undefined}
				onclick={() => onItemClick?.(item)}
			>
				{@render body(item)}
			</a>
		{:else if onItemClick}
			<button
				type="button"
				class="db-ticker__link"
				tabindex={hidden ? -1 : undefined}
				onclick={() => onItemClick(item)}
			>
				{@render body(item)}
			</button>
		{:else}
			<span class="db-ticker__link">{@render body(item)}</span>
		{/if}
	</li>
{/snippet}

{#snippet body(item: TickerItem)}
	<span class="db-ticker__label">{item.label}</span>
	<span class="db-ticker__value">{text(item.value)}</span>
	{#if item.change !== undefined}
		<Delta
			value={item.change}
			format={item.changeFormat ?? 'percent'}
			{currency}
			{locale}
			digits={item.changeFormat === 'number' || item.changeFormat === 'currency' ? digits : 2}
			size="sm"
			arrow={false}
		/>
	{/if}
{/snippet}

<div
	{...rest}
	class={['db-ticker', className]}
	role="marquee"
	aria-label={label}
	data-size={size}
	data-direction={direction}
	data-paused={!running || undefined}
	data-reduced={reduced || undefined}
	data-pause-on-hover={pauseOnHover || undefined}
>
	<!-- Under reduced motion the viewport scrolls instead of animating, so it must be focusable. -->
	<div class="db-ticker__viewport" bind:this={viewport} tabindex={reduced ? 0 : undefined}>
		<div
			class="db-ticker__track"
			style:--_duration="{duration}s"
			style:--_group-w={groupWidth ? `${groupWidth}px` : undefined}
		>
			<ul class="db-ticker__group" bind:this={group}>
				{#each items as item (item.id)}{@render entry(item, false)}{/each}
			</ul>
			{#each { length: copies - 1 }, i (i)}
				<ul class="db-ticker__group" aria-hidden="true">
					{#each items as item (item.id)}{@render entry(item, true)}{/each}
				</ul>
			{/each}
		</div>
	</div>
	{#if controls && !reduced}
		<button
			type="button"
			class="db-ticker__control"
			aria-label={paused ? 'Play ticker' : 'Pause ticker'}
			aria-pressed={paused}
			onclick={() => (paused = !paused)}
		>
			{#if paused}<Play />{:else}<Pause />{/if}
		</button>
	{/if}
</div>

<style>
	.db-ticker {
		--_gap: var(--space-6);
		--_h: var(--control-h-md);

		display: flex;
		align-items: stretch;
		width: 100%;
		min-width: 0;
		height: var(--_h);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: var(--text-sm);
		overflow: hidden;
	}
	.db-ticker[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_gap: var(--space-5);
		font-size: var(--text-xs);
	}
	.db-ticker__viewport {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		/* The track is max-content wide; without this it would still count towards the intrinsic
		   width of every auto-sized ancestor and stretch the page. */
		contain: inline-size;
		/* Fade the edges so items appear to slide in from outside. */
		mask-image: linear-gradient(
			to right,
			transparent,
			black var(--space-4),
			black calc(100% - var(--space-4)),
			transparent
		);
	}
	.db-ticker[data-reduced] .db-ticker__viewport {
		overflow-x: auto;
		mask-image: none;
		scrollbar-width: thin;
	}
	.db-ticker__viewport:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring-inset);
	}
	.db-ticker__track {
		display: flex;
		width: max-content;
		height: 100%;
		animation: db-ticker-scroll var(--_duration, 30s) linear infinite;
	}
	.db-ticker[data-direction='right'] .db-ticker__track {
		animation-direction: reverse;
	}
	.db-ticker[data-paused] .db-ticker__track {
		animation-play-state: paused;
	}
	.db-ticker[data-reduced] .db-ticker__track {
		animation: none;
	}
	.db-ticker[data-pause-on-hover]:hover .db-ticker__track,
	.db-ticker[data-pause-on-hover]:focus-within .db-ticker__track {
		animation-play-state: paused;
	}
	@keyframes db-ticker-scroll {
		to {
			transform: translateX(calc(-1 * var(--_group-w, 50%)));
		}
	}
	.db-ticker__group {
		display: flex;
		align-items: center;
		flex: none;
		gap: var(--_gap);
		margin: 0;
		padding: 0 calc(var(--_gap) / 2);
		list-style: none;
		height: 100%;
	}
	.db-ticker__item {
		display: flex;
		align-items: center;
		flex: none;
		height: 100%;
		white-space: nowrap;
	}
	.db-ticker__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		height: calc(100% - var(--space-2));
		padding-inline: var(--space-2);
		margin-inline: calc(var(--space-2) * -1);
		border: none;
		border-radius: var(--radius-sm);
		background: none;
		color: inherit;
		font: inherit;
		text-decoration: none;
		transition: var(--transition-colors);
	}
	a.db-ticker__link,
	button.db-ticker__link {
		cursor: pointer;
	}
	a.db-ticker__link:hover,
	button.db-ticker__link:hover {
		background: var(--color-component-hover);
	}
	.db-ticker__link:focus-visible {
		box-shadow: var(--focus-ring-inset);
		outline: none;
	}
	.db-ticker__label {
		font-weight: var(--weight-semibold);
		font-family: var(--font-mono);
		letter-spacing: 0.02em;
	}
	.db-ticker__value {
		font-variant-numeric: var(--font-numeric);
		color: var(--color-text-muted);
	}
	/* Flash: tint the item briefly, then let the colour transition fade it back. */
	.db-ticker__item[data-flash] .db-ticker__link {
		transition: none;
	}
	.db-ticker__item[data-flash='up'] .db-ticker__link {
		background: var(--color-success-subtle);
	}
	.db-ticker__item[data-flash='down'] .db-ticker__link {
		background: var(--color-danger-subtle);
	}
	.db-ticker__control {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: var(--_h);
		border: none;
		border-inline-start: 1px solid var(--color-border);
		background: var(--color-bg-subtle);
		color: var(--color-text-muted);
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.db-ticker__control:hover {
		color: var(--color-text);
		background: var(--color-component-hover);
	}
	.db-ticker__control:focus-visible {
		box-shadow: var(--focus-ring-inset);
		outline: none;
	}
	.db-ticker__control :global(svg) {
		width: 1em;
		height: 1em;
	}
</style>
