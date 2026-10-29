<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TabBarItem {
		href: string;
		label: string;
		/** Lucide icon component, or any component rendering an SVG. */
		icon?: Snippet;
		badge?: string | number;
		badgeTone?: 'neutral' | 'accent' | 'danger';
		/** Match `current` exactly rather than by path prefix. */
		exact?: boolean;
		/** Force the active state (demos, hash routing); otherwise derived from `current`. */
		active?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		items: TabBarItem[];
		/** Current pathname; items derive `active` from it. */
		current?: string;
		/** Accessible name of the `<nav>` landmark. */
		label?: string;
		/** Show at every width, not only below the sidebar breakpoint. */
		always?: boolean;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		items,
		current,
		label = 'Sections',
		always = false,
		class: className,
		...rest
	}: TabBarProps = $props();

	const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
	const isActive = (item: TabBarItem) => {
		if (item.active !== undefined) return item.active;
		if (!current) return false;
		const a = trim(new URL(item.href, 'http://x').pathname);
		const b = trim(current);
		if (a === b) return true;
		if (item.exact || a === '/') return false;
		return b.startsWith(a + '/');
	};
</script>

<nav
	{...rest}
	class={['db-tab-bar', className]}
	aria-label={label}
	data-always={always || undefined}
>
	<ul class="db-tab-bar__list">
		{#each items as item, i (i)}
			{@const active = isActive(item)}
			{@const hasBadge = item.badge !== undefined && item.badge !== ''}
			<li class="db-tab-bar__item">
				<a
					class="db-tab-bar__link"
					href={item.href}
					aria-current={active ? 'page' : undefined}
					aria-label={hasBadge ? `${item.label}, ${item.badge}` : undefined}
					data-active={active || undefined}
					onclick={item.onclick}
				>
					<span class="db-tab-bar__icon" aria-hidden="true">
						{#if item.icon}{@render item.icon()}{:else}{item.label.slice(0, 1)}{/if}
						{#if hasBadge}
							<span class="db-tab-bar__badge" data-tone={item.badgeTone ?? 'neutral'}
								>{item.badge}</span
							>
						{/if}
					</span>
					<span class="db-tab-bar__label">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.db-tab-bar {
		position: fixed;
		inset-inline: 0;
		bottom: 0;
		z-index: 30;
		background: var(--shell-header-bg);
		backdrop-filter: blur(var(--shell-header-blur));
		-webkit-backdrop-filter: blur(var(--shell-header-blur));
		border-top: 1px solid var(--color-border);
		padding-bottom: env(safe-area-inset-bottom, 0);
		font-family: var(--font-body);
	}
	@media (min-width: 64rem) {
		.db-tab-bar:not([data-always]) {
			display: none;
		}
	}
	.db-tab-bar__list {
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.db-tab-bar__item {
		flex: 1;
		min-width: 0;
	}
	.db-tab-bar__link {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--space-1-5) var(--space-1) var(--space-1);
		min-height: calc(var(--control-h-lg) + var(--space-1));
		color: var(--shell-nav-fg);
		text-decoration: none;
		font-size: var(--text-xs);
		line-height: 1.2;
		-webkit-tap-highlight-color: transparent;
		transition: color var(--duration-fast) var(--ease-standard);
	}
	.db-tab-bar__link[data-active] {
		color: var(--shell-nav-active-fg);
	}
	.db-tab-bar__link:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: -2px;
		border-radius: var(--radius-sm);
	}
	.db-tab-bar__icon {
		position: relative;
		display: grid;
		place-items: center;
		width: 3.25rem;
		height: 1.75rem;
		border-radius: var(--radius-full);
		font-weight: 600;
		transition: background var(--duration-fast) var(--ease-standard);
	}
	.db-tab-bar__link[data-active] .db-tab-bar__icon {
		background: var(--shell-nav-active-bg);
	}
	.db-tab-bar__icon :global(svg) {
		width: 1.35rem;
		height: 1.35rem;
	}
	.db-tab-bar__label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.db-tab-bar__badge {
		position: absolute;
		top: -3px;
		right: 6px;
		min-width: 1.1rem;
		height: 1.1rem;
		padding: 0 0.3rem;
		border-radius: var(--radius-full);
		font-size: 0.65rem;
		font-weight: 600;
		line-height: 1.1rem;
		text-align: center;
		background: var(--color-neutral);
		color: var(--color-neutral-fg);
	}
	.db-tab-bar__badge[data-tone='accent'] {
		background: var(--color-accent);
		color: var(--color-accent-fg);
	}
	.db-tab-bar__badge[data-tone='danger'] {
		background: var(--color-danger);
		color: var(--color-danger-fg);
	}
</style>
