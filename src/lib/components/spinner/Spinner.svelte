<script lang="ts" module>
	import type { SVGAttributes } from 'svelte/elements';

	export interface SpinnerProps extends SVGAttributes<SVGSVGElement> {
		/** Diameter — any CSS length. Defaults to 1em so it scales with surrounding text. */
		size?: string;
		/** Accessible label. Pass `null` to hide from assistive tech (e.g. inside a button that already says "Loading"). */
		label?: string | null;
		class?: string;
	}
</script>

<script lang="ts">
	let { size = '1em', label = 'Loading', class: className, ...rest }: SpinnerProps = $props();
</script>

<svg
	class={['db-spinner', className]}
	style:--_size={size}
	viewBox="0 0 24 24"
	fill="none"
	role={label === null ? undefined : 'status'}
	aria-label={label ?? undefined}
	aria-hidden={label === null ? 'true' : undefined}
	{...rest}
>
	<circle class="db-spinner__track" cx="12" cy="12" r="9" stroke-width="2.5" />
	<circle
		class="db-spinner__head"
		cx="12"
		cy="12"
		r="9"
		stroke-width="2.5"
		stroke-linecap="round"
		pathLength="100"
	/>
</svg>

<style>
	.db-spinner {
		width: var(--_size);
		height: var(--_size);
		flex: none;
		animation: db-spin var(--duration-slower, 500ms) linear infinite;
		color: currentColor;
	}
	.db-spinner__track {
		stroke: currentColor;
		opacity: 0.2;
	}
	.db-spinner__head {
		stroke: currentColor;
		stroke-dasharray: 28 100;
	}
	@keyframes db-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.db-spinner {
			animation-duration: 1.5s;
		}
	}
</style>
