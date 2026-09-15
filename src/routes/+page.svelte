<script lang="ts">
	import { Button } from '$lib/index.js';
	import { theme, THEMES } from '$lib/theme/theme.svelte.js';
	import { nav } from '$docs/nav.js';

	const descriptions: Record<string, string> = {
		slate: 'Minimal & precise — cool neutrals, one blue accent, hairline borders.',
		folio: 'Warm & editorial — cream neutrals, terracotta accent, serif display type.',
		terminal: 'Dense & data-rich — deep blue-blacks, mint accent, monospace numerals.'
	};
</script>

<h1>Design Book</h1>
<p class="lead">
	A themeable Svelte 5 component library. One set of components, three themes, light and dark, two
	densities — switch any of them from the header and every page re-renders live.
</p>

<h2>Themes</h2>
<div class="themes">
	{#each THEMES as t (t)}
		<button
			type="button"
			class="theme-card"
			data-theme={t}
			aria-pressed={theme.current.theme === t}
			onclick={() => theme.set({ theme: t })}
		>
			<span class="theme-card__swatches" aria-hidden="true">
				<i style="background: var(--color-accent)"></i>
				<i style="background: var(--color-component)"></i>
				<i style="background: var(--color-border-strong)"></i>
				<i style="background: var(--color-text)"></i>
			</span>
			<span class="theme-card__name">{t}</span>
			<span class="theme-card__desc">{descriptions[t]}</span>
		</button>
	{/each}
</div>

<h2>Start here</h2>
<div class="links">
	{#each nav as section (section.title)}
		{#each section.items as item (item.href)}
			<Button href={item.href} variant="soft" tone="neutral">{item.title}</Button>
		{/each}
	{/each}
</div>

<h2>Usage</h2>
<pre class="code"><code
		>npm install @ethan/designbook

// src/routes/+layout.svelte
import '@ethan/designbook/styles';
import '@ethan/designbook/fonts';   // optional, self-hosted fonts

// anywhere
import &#123; Button, theme &#125; from '@ethan/designbook';
theme.set(&#123; theme: 'terminal', scheme: 'dark', density: 'compact' &#125;);</code
	></pre>

<style>
	.themes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--space-4);
	}
	.theme-card {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-4);
		text-align: left;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg);
		color: var(--color-text);
		font-family: var(--font-body);
		transition: var(--transition-colors);
	}
	.theme-card:hover {
		border-color: var(--color-border-hover);
	}
	.theme-card[aria-pressed='true'] {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 1px var(--color-accent);
	}
	.theme-card:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.theme-card__swatches {
		display: flex;
		gap: var(--space-1);
	}
	.theme-card__swatches i {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-sm);
	}
	.theme-card__name {
		font-family: var(--font-display);
		font-variation-settings: var(--font-display-variation);
		font-weight: var(--font-display-weight);
		font-size: var(--text-xl);
		text-transform: capitalize;
	}
	.theme-card__desc {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.code {
		padding: var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg-subtle);
		font-size: var(--text-sm);
		overflow-x: auto;
	}
</style>
