<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface NavItemProps extends Omit<HTMLAnchorAttributes, 'href'> {
		/** Renders a link. Omit for a button-like item with `onclick`. */
		href?: string;
		/** Force the active state; otherwise derived from the Nav's `current` path. */
		active?: boolean;
		/** Match `current` exactly rather than by path prefix. */
		exact?: boolean;
		/** Count or status after the label. */
		badge?: string | number;
		badgeTone?: 'neutral' | 'accent' | 'danger';
		disabled?: boolean;
		icon?: Snippet;
		children: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { getNavContext } from './context.js';
	import { getAppShellContext } from '../app-shell/context.js';

	let {
		href,
		active: activeProp,
		exact = false,
		badge,
		badgeTone = 'neutral',
		disabled = false,
		icon,
		children,
		class: className,
		...rest
	}: NavItemProps = $props();

	const nav = getNavContext();
	const shell = getAppShellContext();
	const horizontal = $derived(nav?.orientation === 'horizontal');
	// Only a vertical sidebar collapses to a rail.
	const collapsed = $derived(!horizontal && (shell?.collapsed ?? false));

	const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
	const active = $derived.by(() => {
		if (activeProp !== undefined) return activeProp;
		const cur = nav?.current;
		if (!cur || !href) return false;
		const a = trim(new URL(href, 'http://x').pathname);
		const b = trim(cur);
		if (a === b) return true;
		if (exact || a === '/') return false;
		return b.startsWith(a + '/');
	});

	let el = $state<HTMLElement | null>(null);
	let label = $state('');
	$effect(() => {
		if (!active) return;
		nav?.setActiveElement(el);
		return () => nav?.setActiveElement(null);
	});
	// Collapsed rail: the label text becomes a native tooltip.
	$effect(() => {
		if (el) label = el.querySelector('.db-nav-item__label')?.textContent?.trim() ?? '';
	});

	const isLink = $derived(Boolean(href) && !disabled);
</script>

<svelte:element
	this={isLink ? 'a' : 'button'}
	{...rest}
	bind:this={el}
	class={['db-nav-item', className]}
	href={isLink ? href : undefined}
	type={isLink ? undefined : 'button'}
	disabled={!isLink && disabled ? true : undefined}
	aria-current={active ? 'page' : undefined}
	data-active={active || undefined}
	data-collapsed={collapsed || undefined}
	data-orientation={horizontal ? 'horizontal' : 'vertical'}
	title={collapsed ? label : undefined}
>
	{#if icon}
		<span class="db-nav-item__icon" aria-hidden="true">{@render icon()}</span>
	{:else if collapsed}
		<!-- No icon: a monogram keeps the rail scannable. -->
		<span class="db-nav-item__icon db-nav-item__monogram" aria-hidden="true"
			>{label.slice(0, 1)}</span
		>
	{/if}
	<span class="db-nav-item__label">{@render children()}</span>
	{#if badge !== undefined && badge !== ''}
		<span class="db-nav-item__badge" data-tone={badgeTone}>{badge}</span>
	{/if}
</svelte:element>

<style>
	.db-nav-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-2-5);
		width: 100%;
		min-height: var(--control-h-md);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--shell-nav-radius);
		color: var(--shell-nav-fg);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		line-height: 1.2;
		text-align: start;
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
		transition:
			var(--transition-colors),
			padding var(--duration-slow) var(--ease-standard);
	}
	.db-nav-item:hover:not(:disabled) {
		background: var(--shell-nav-hover-bg);
		color: var(--color-text);
	}
	.db-nav-item:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.db-nav-item[data-active] {
		background: var(--shell-nav-active-bg);
		color: var(--shell-nav-active-fg);
	}
	.db-nav-item:disabled {
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-nav-item__icon {
		display: inline-flex;
		flex: none;
		width: 1.15rem;
		height: 1.15rem;
		color: var(--color-text-subtle);
		transition: var(--transition-colors);
	}
	.db-nav-item[data-active] .db-nav-item__icon,
	.db-nav-item:hover .db-nav-item__icon {
		color: currentColor;
	}
	.db-nav-item__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-nav-item__monogram {
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--color-component);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		line-height: 1;
		color: var(--color-text-muted);
	}
	.db-nav-item[data-active] .db-nav-item__monogram {
		background: var(--shell-nav-indicator);
		color: var(--color-accent-fg);
	}
	.db-nav-item__label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.db-nav-item__badge {
		flex: none;
		min-width: 1.25rem;
		padding: 0 var(--space-1-5);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		font-variant-numeric: var(--font-numeric);
		line-height: 1.25rem;
		text-align: center;
		background: var(--color-component);
		color: var(--color-text-muted);
	}
	.db-nav-item__badge[data-tone='accent'] {
		background: var(--color-accent-subtle);
		color: var(--color-accent-text);
	}
	.db-nav-item__badge[data-tone='danger'] {
		background: var(--color-danger);
		color: var(--color-danger-fg);
	}

	/* Horizontal bar: compact pills, no full width; the active pill is subtler because the underline carries state. */
	.db-nav-item[data-orientation='horizontal'] {
		width: auto;
		min-height: var(--control-h-sm);
		padding: var(--space-1) var(--space-2-5);
		gap: var(--space-2);
	}
	.db-nav-item[data-orientation='horizontal'] .db-nav-item__label {
		flex: none;
	}
	.db-nav-item[data-orientation='horizontal'][data-active] {
		background: var(--shell-nav-active-bg-h, var(--shell-nav-active-bg));
	}

	/* Collapsed rail: icon only, centred; the badge becomes a dot. */
	.db-nav-item[data-collapsed] {
		justify-content: center;
		padding-inline: 0;
	}
	.db-nav-item[data-collapsed] .db-nav-item__label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.db-nav-item[data-collapsed] .db-nav-item__badge {
		position: absolute;
		top: var(--space-1);
		inset-inline-end: var(--space-1);
		min-width: 0.5rem;
		width: 0.5rem;
		height: 0.5rem;
		padding: 0;
		font-size: 0;
		line-height: 0;
		background: var(--shell-nav-indicator);
	}
</style>
