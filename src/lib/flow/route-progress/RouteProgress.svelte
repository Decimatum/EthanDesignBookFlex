<script lang="ts" module>
	export interface RouteProgressProps {
		/** True while a navigation (or any long task) is in flight. */
		active: boolean;
		/** Don't show for navigations shorter than this, so fast pages don't flash a bar. */
		delay?: number;
		/** Height of the bar (CSS length). */
		height?: string;
		/** Accessible name for the progressbar. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		active,
		delay = 150,
		height = '3px',
		label = 'Loading page',
		class: className
	}: RouteProgressProps = $props();

	// 0 = hidden, (0, 90] = trickling, 100 = finishing (then hidden).
	let progress = $state(0);
	let visible = $state(false);

	$effect(() => {
		if (!active) {
			if (!visible) return;
			// Finish: jump to 100, then hide after the bar has drawn.
			progress = 100;
			const t = setTimeout(() => {
				visible = false;
				progress = 0;
			}, 400);
			return () => clearTimeout(t);
		}
		let interval: ReturnType<typeof setInterval> | undefined;
		const start = setTimeout(() => {
			visible = true;
			progress = 15;
			// Trickle towards 90% with shrinking steps so it never stalls or completes on its own.
			interval = setInterval(() => {
				progress = Math.min(90, progress + Math.max(0.5, (90 - progress) / 8));
			}, 200);
		}, delay);
		return () => {
			clearTimeout(start);
			if (interval) clearInterval(interval);
		};
	});
</script>

{#if visible}
	<div
		class={['db-route-progress', className]}
		role="progressbar"
		aria-label={label}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(progress)}
		style:--_h={height}
		data-done={progress >= 100 || undefined}
	>
		<div class="db-route-progress__bar" style:width="{progress}%"></div>
	</div>
{/if}

<style>
	.db-route-progress {
		position: fixed;
		inset-inline: 0;
		top: 0;
		z-index: var(--z-toast);
		height: var(--_h);
		pointer-events: none;
		transition: opacity var(--duration-base) var(--ease-standard);
	}
	.db-route-progress[data-done] {
		opacity: 0;
		transition-delay: var(--duration-fast);
	}
	.db-route-progress__bar {
		height: 100%;
		background: var(--color-accent);
		box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 60%, transparent);
		transition: width var(--duration-slow) var(--ease-decelerate);
	}
</style>
