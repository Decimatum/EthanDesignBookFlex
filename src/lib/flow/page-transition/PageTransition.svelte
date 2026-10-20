<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface PageTransitionProps {
		/** Re-runs the transition whenever this changes — usually the route id or pathname. */
		key: unknown;
		kind?: 'fade' | 'slide' | 'slide-up';
		/** Duration in ms; defaults to the `--duration-slow` token. */
		duration?: number;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from '../../utils/index.js';

	let { key, kind = 'fade', duration, children, class: className }: PageTransitionProps = $props();

	function ms() {
		if (duration !== undefined) return duration;
		if (typeof getComputedStyle === 'undefined') return 250;
		const v = getComputedStyle(document.documentElement).getPropertyValue('--duration-slow').trim();
		return v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : 250;
	}
	// Reduced motion collapses to an instant swap (0ms), matching the global motion tokens.
	const dur = () => (prefersReducedMotion() ? 0 : ms());

	function enter(node: Element) {
		const d = dur();
		if (kind === 'slide') return fly(node, { x: 24, duration: d, easing: cubicOut });
		if (kind === 'slide-up') return fly(node, { y: 16, duration: d, easing: cubicOut });
		return fade(node, { duration: d });
	}
	function leave(node: Element) {
		const d = Math.round(dur() * 0.6);
		if (kind === 'slide') return fly(node, { x: -24, duration: d, easing: cubicOut });
		if (kind === 'slide-up') return fly(node, { y: -8, duration: d, easing: cubicOut });
		return fade(node, { duration: d });
	}
</script>

<div class={['db-page-transition', className]} data-kind={kind}>
	{#key key}
		<div class="db-page-transition__page" in:enter out:leave>
			{@render children()}
		</div>
	{/key}
</div>

<style>
	.db-page-transition {
		display: grid;
	}
	/* Old and new pages overlap during the swap instead of stacking. */
	.db-page-transition__page {
		grid-area: 1 / 1;
		min-width: 0;
	}
</style>
