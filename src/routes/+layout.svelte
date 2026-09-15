<script lang="ts">
	import '$lib/styles/fonts.css';
	import '$lib/styles/index.css';
	import { page } from '$app/state';
	import { nav } from '$docs/nav.js';
	import ThemeSwitcher from '$docs/ThemeSwitcher.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Design Book</title>
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

<div class="shell">
	<header class="header">
		<a class="brand" href="/">Design Book</a>
		<ThemeSwitcher />
	</header>

	<nav class="sidebar" aria-label="Docs">
		{#each nav as section (section.title)}
			<div class="sidebar__section">
				<div class="sidebar__heading">{section.title}</div>
				<ul role="list">
					{#each section.items as item (item.href)}
						<li>
							<a
								class="sidebar__link"
								href={item.href}
								aria-current={page.url.pathname === item.href ? 'page' : undefined}
							>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<main class="main" id="main" tabindex="-1">
		{@render children()}
	</main>
</div>

<style>
	.skip-link {
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		z-index: var(--z-toast);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-accent-fg);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		text-decoration: none;
		transform: translateY(-200%);
	}
	.skip-link:focus-visible {
		transform: none;
	}
	.main:focus-visible {
		box-shadow: none;
	}
	.shell {
		display: grid;
		grid-template-columns: 15rem 1fr;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'header header'
			'sidebar main';
		min-height: 100dvh;
	}
	.header {
		grid-area: header;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		flex-wrap: wrap;
		padding: var(--space-3) var(--space-6);
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
	}
	.brand {
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		font-size: var(--text-lg);
		text-decoration: none;
	}
	.sidebar {
		grid-area: sidebar;
		padding: var(--space-6) var(--space-4);
		border-right: 1px solid var(--color-border);
		background: var(--color-bg-subtle);
	}
	.sidebar__section + .sidebar__section {
		margin-block-start: var(--space-6);
	}
	.sidebar__heading {
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-subtle);
		margin-block-end: var(--space-2);
		padding-inline: var(--space-2);
	}
	.sidebar__link {
		display: block;
		padding: var(--space-1-5) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		transition: var(--transition-colors);
	}
	.sidebar__link:hover {
		background: var(--color-component);
		color: var(--color-text);
	}
	.sidebar__link[aria-current='page'] {
		background: var(--color-accent-subtle);
		color: var(--color-accent-text);
		font-weight: var(--weight-medium);
	}
	.main {
		grid-area: main;
		padding: var(--space-8) var(--space-8) var(--space-16);
		max-width: var(--container-lg);
		width: 100%;
	}
	.main :global(h1) {
		margin-block-end: var(--space-2);
	}
	.main :global(h2) {
		margin-block: var(--space-10) var(--space-3);
		padding-block-end: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}
	.main :global(p) {
		max-width: 65ch;
		color: var(--color-text-muted);
	}
	.main :global(p + p) {
		margin-block-start: var(--space-3);
	}
	.main :global(.lead) {
		font-size: var(--text-lg);
	}
	.main :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
		margin-block: var(--space-4);
	}
	.main :global(th),
	.main :global(td) {
		text-align: left;
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		vertical-align: top;
	}
	.main :global(th) {
		color: var(--color-text-muted);
		font-weight: var(--weight-medium);
	}
	.main :global(code) {
		padding: 0.1em 0.35em;
		border-radius: var(--radius-xs);
		background: var(--color-component);
	}

	@media (max-width: 48rem) {
		.shell {
			grid-template-columns: 1fr;
			grid-template-areas:
				'header'
				'sidebar'
				'main';
		}
		.sidebar {
			border-right: none;
			border-bottom: 1px solid var(--color-border);
		}
		.main {
			padding: var(--space-6) var(--space-4) var(--space-12);
		}
	}
</style>
