<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface NavProps extends HTMLAttributes<HTMLDivElement> {
		/** Current pathname; items whose `href` matches become active. */
		current?: string;
		/** Vertical list (sidebar) or horizontal bar. Defaults to the AppShell placement it sits in. */
		orientation?: 'vertical' | 'horizontal';
		/** Animate one indicator between active items (the rail/underline the themes style). */
		indicator?: boolean;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { setNavContext } from './context.js';
	import { getAppShellContext } from '../app-shell/context.js';

	let {
		current,
		orientation: orientationProp,
		indicator = true,
		children,
		class: className,
		...rest
	}: NavProps = $props();

	const shell = getAppShellContext();
	const orientation = $derived(
		orientationProp ?? (shell?.placement === 'topbar' ? 'horizontal' : 'vertical')
	);
	const horizontal = $derived(orientation === 'horizontal');

	let root = $state<HTMLElement | null>(null);
	let activeEl = $state<HTMLElement | null>(null);
	let box = $state<{ x: number; y: number; w: number; h: number } | null>(null);
	let settled = $state(false); // the first placement is instant; later ones animate

	setNavContext({
		get current() {
			return current;
		},
		get orientation() {
			return orientation;
		},
		setActiveElement(el) {
			activeEl = el;
		}
	});

	function measure() {
		if (!root || !activeEl || !activeEl.isConnected) {
			box = null;
			return;
		}
		const r = root.getBoundingClientRect();
		const a = activeEl.getBoundingClientRect();
		box = {
			x: a.left - r.left + root.scrollLeft,
			y: a.top - r.top + root.scrollTop,
			w: a.width,
			h: a.height
		};
	}

	// Centre the active item in its scroll container once (deep links into a long nav). Only the
	// nearest scrollable ancestor moves — never the page.
	let revealed = false;
	$effect(() => {
		if (!activeEl || revealed) return;
		revealed = true;
		const axis = horizontal ? 'overflowX' : 'overflowY';
		let p: HTMLElement | null = activeEl.parentElement;
		while (p && p !== document.body) {
			const o = getComputedStyle(p)[axis];
			const overflowing = horizontal
				? p.scrollWidth > p.clientWidth
				: p.scrollHeight > p.clientHeight;
			if ((o === 'auto' || o === 'scroll') && overflowing) break;
			p = p.parentElement;
		}
		if (!p || p === document.body) return;
		if (horizontal) {
			const target = activeEl.getBoundingClientRect().left - p.getBoundingClientRect().left;
			p.scrollLeft += target - p.clientWidth / 2 + activeEl.offsetWidth / 2;
		} else {
			const target = activeEl.getBoundingClientRect().top - p.getBoundingClientRect().top;
			p.scrollTop += target - p.clientHeight / 2 + activeEl.offsetHeight / 2;
		}
	});

	$effect(() => {
		void activeEl;
		void orientation;
		measure();
		if (!root) return;
		const ro = new ResizeObserver(measure);
		ro.observe(root);
		if (activeEl) ro.observe(activeEl);
		const t = requestAnimationFrame(() => (settled = true));
		return () => {
			ro.disconnect();
			cancelAnimationFrame(t);
		};
	});
</script>

<div
	{...rest}
	class={['db-nav', className]}
	bind:this={root}
	data-orientation={orientation}
	data-indicator={indicator || undefined}
>
	{#if indicator && box}
		{#if horizontal}
			<span
				class="db-nav__indicator"
				aria-hidden="true"
				data-settled={settled || undefined}
				style:transform="translateX({box.x}px)"
				style:width="{box.w}px"
			></span>
		{:else}
			<span
				class="db-nav__indicator"
				aria-hidden="true"
				data-settled={settled || undefined}
				style:transform="translateY({box.y}px)"
				style:height="{box.h}px"
			></span>
		{/if}
	{/if}
	{@render children()}
</div>

<style>
	.db-nav {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.db-nav[data-orientation='horizontal'] {
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.db-nav[data-orientation='horizontal']::-webkit-scrollbar {
		display: none;
	}
	.db-nav__indicator {
		position: absolute;
		pointer-events: none;
		background: var(--shell-nav-indicator);
		will-change: transform;
	}
	/* vertical: a rail on the leading edge */
	.db-nav[data-orientation='vertical'] .db-nav__indicator {
		top: 0;
		inset-inline-start: 0;
		width: var(--shell-nav-indicator-w);
		border-radius: var(--radius-full);
	}
	/* horizontal: an underline */
	.db-nav[data-orientation='horizontal'] .db-nav__indicator {
		bottom: 0;
		inset-inline-start: 0;
		height: var(--shell-nav-underline-h);
		border-radius: var(--radius-full) var(--radius-full) 0 0;
	}
	.db-nav__indicator[data-settled] {
		transition:
			transform var(--duration-base) var(--ease-spring),
			width var(--duration-base) var(--ease-standard),
			height var(--duration-base) var(--ease-standard);
	}
</style>
