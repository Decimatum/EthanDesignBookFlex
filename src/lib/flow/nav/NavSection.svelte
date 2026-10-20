<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface NavSectionProps {
		/** Small uppercase heading; becomes a hairline when the shell is collapsed. */
		title?: string;
		/** Let the user fold the section; `open` is then bindable. */
		collapsible?: boolean;
		open?: boolean;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { getAppShellContext } from '../app-shell/context.js';
	import { getNavContext } from './context.js';

	let {
		title,
		collapsible = false,
		open = $bindable(true),
		children,
		class: className
	}: NavSectionProps = $props();

	const shell = getAppShellContext();
	const nav = getNavContext();
	const collapsed = $derived(shell?.collapsed ?? false);
	const horizontal = $derived(nav?.orientation === 'horizontal');
	const own = $props.id();
	const bodyId = `db-nav-section-${own}`;
</script>

<div
	class={['db-nav-section', className]}
	data-collapsed={collapsed || undefined}
	data-orientation={horizontal ? 'horizontal' : 'vertical'}
	role={horizontal && title ? 'group' : undefined}
	aria-label={horizontal ? title : undefined}
>
	{#if title && !horizontal}
		{#if collapsible}
			<button
				type="button"
				class="db-nav-section__title db-nav-section__toggle"
				aria-expanded={open}
				aria-controls={bodyId}
				onclick={() => (open = !open)}
			>
				<span class="db-nav-section__text">{title}</span>
				<ChevronDown class="db-nav-section__chevron" aria-hidden="true" />
			</button>
		{:else}
			<div class="db-nav-section__title"><span class="db-nav-section__text">{title}</span></div>
		{/if}
	{/if}
	{#if !collapsible || open}
		<div class="db-nav-section__body" id={bodyId}>{@render children()}</div>
	{/if}
</div>

<style>
	.db-nav-section:not(:first-child) {
		margin-block-start: var(--space-4);
	}
	/* Horizontal: sections are inline groups separated by a hairline; the title becomes the group's aria-label. */
	.db-nav-section[data-orientation='horizontal'] {
		display: contents;
	}
	.db-nav-section[data-orientation='horizontal'] .db-nav-section__body {
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
	.db-nav-section[data-orientation='horizontal']:not(:first-child) .db-nav-section__body::before {
		content: '';
		align-self: stretch;
		width: 1px;
		margin-inline: var(--space-1) var(--space-2);
		margin-block: var(--space-2);
		background: var(--color-border);
	}
	.db-nav-section__title {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		width: 100%;
		height: var(--control-h-sm);
		padding-inline: var(--space-2-5);
		margin-block-end: var(--space-1);
		border-radius: var(--shell-nav-radius);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-muted);
		text-align: start;
		overflow: hidden;
		white-space: nowrap;
	}
	.db-nav-section__toggle {
		cursor: pointer;
		transition: var(--transition-colors);
	}
	.db-nav-section__toggle:hover {
		color: var(--color-text);
		background: var(--shell-nav-hover-bg);
	}
	.db-nav-section__toggle:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-nav-section__toggle :global(.db-nav-section__chevron) {
		width: 0.9rem;
		height: 0.9rem;
		margin-inline-start: auto;
		transition: transform var(--duration-base) var(--ease-standard);
	}
	.db-nav-section__toggle[aria-expanded='false'] :global(.db-nav-section__chevron) {
		transform: rotate(-90deg);
	}
	.db-nav-section__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	/* Collapsed rail: the heading becomes a hairline so groups still read as groups. */
	.db-nav-section[data-collapsed] .db-nav-section__title {
		height: auto;
		padding: 0;
		margin-block: var(--space-2);
		border-top: 1px solid var(--color-border);
		color: transparent;
		pointer-events: none;
	}
	.db-nav-section[data-collapsed] .db-nav-section__text,
	.db-nav-section[data-collapsed] :global(.db-nav-section__chevron) {
		display: none;
	}
</style>
