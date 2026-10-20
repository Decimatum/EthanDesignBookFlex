<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
		/** Joined buttons share borders; `separate` keeps a small gap. */
		attached?: boolean;
		orientation?: 'horizontal' | 'vertical';
		/** Accessible name for the group (`role="group"`). */
		label?: string;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		attached = true,
		orientation = 'horizontal',
		label,
		children,
		class: className,
		...rest
	}: ButtonGroupProps = $props();
</script>

<div
	{...rest}
	class={['db-button-group', className]}
	role="group"
	aria-label={label ?? rest['aria-label']}
	data-attached={attached || undefined}
	data-orientation={orientation}
>
	{@render children()}
</div>

<style>
	.db-button-group {
		display: inline-flex;
		gap: var(--space-2);
		vertical-align: middle;
	}
	.db-button-group[data-orientation='vertical'] {
		flex-direction: column;
		align-items: stretch;
	}
	.db-button-group[data-attached] {
		gap: 0;
	}
	/* Joined: collapse inner radii and overlap borders so outlines read as one bar. */
	.db-button-group[data-attached] > :global(.db-button:not(:first-child)) {
		border-start-start-radius: 0;
		border-end-start-radius: 0;
		margin-inline-start: calc(var(--control-border-width) * -1);
	}
	.db-button-group[data-attached] > :global(.db-button:not(:last-child)) {
		border-start-end-radius: 0;
		border-end-end-radius: 0;
	}
	.db-button-group[data-attached][data-orientation='vertical']
		> :global(.db-button:not(:first-child)) {
		border-radius: var(--control-radius);
		border-start-start-radius: 0;
		border-start-end-radius: 0;
		margin-inline-start: 0;
		margin-block-start: calc(var(--control-border-width) * -1);
	}
	.db-button-group[data-attached][data-orientation='vertical']
		> :global(.db-button:not(:last-child)) {
		border-end-start-radius: 0;
		border-end-end-radius: 0;
	}
	/* Keep the focused/hovered button's border on top of its neighbours. */
	.db-button-group[data-attached] > :global(.db-button:hover),
	.db-button-group[data-attached] > :global(.db-button:focus-visible) {
		z-index: 1;
	}
	/* Solid buttons have no visible border; a hairline separates them. */
	.db-button-group[data-attached] > :global(.db-button[data-variant='solid']:not(:first-child)) {
		box-shadow: inset 1px 0 0 color-mix(in srgb, var(--color-bg) 25%, transparent);
	}
	.db-button-group[data-attached][data-orientation='vertical']
		> :global(.db-button[data-variant='solid']:not(:first-child)) {
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-bg) 25%, transparent);
	}
	.db-button-group[data-attached] > :global(.db-button[data-variant='solid']:focus-visible) {
		box-shadow: var(--focus-ring);
	}
</style>
