<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/theme/theme.svelte.js';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
	let fonts = $state({ display: '', body: '', mono: '' });

	function readFonts() {
		const s = getComputedStyle(document.documentElement);
		fonts = {
			display: s.getPropertyValue('--font-display').split(',')[0].trim(),
			body: s.getPropertyValue('--font-body').split(',')[0].trim(),
			mono: s.getPropertyValue('--font-mono').split(',')[0].trim()
		};
	}
	onMount(readFonts);
	$effect(() => {
		void theme.current.theme;
		readFonts();
	});
</script>

<h1>Typography</h1>
<p class="lead">
	Each theme sets three families and a base size. Headings use <code>--font-display</code>,
	everything else <code>--font-body</code>, and numbers or code <code>--font-mono</code>.
</p>

<table>
	<thead><tr><th>Role</th><th>Token</th><th>Current theme</th></tr></thead>
	<tbody>
		<tr><td>Display</td><td><code>--font-display</code></td><td>{fonts.display}</td></tr>
		<tr><td>Body</td><td><code>--font-body</code></td><td>{fonts.body}</td></tr>
		<tr><td>Mono</td><td><code>--font-mono</code></td><td>{fonts.mono}</td></tr>
	</tbody>
</table>

<h2>Headings</h2>
<div class="specimen">
	<h1>The quick brown fox jumps over the lazy dog</h1>
	<h2 class="no-rule">Portfolio rebalanced at 09:30 — 14 positions closed</h2>
	<h3>Settings, preferences and account security</h3>
	<h4>Notifications</h4>
	<h5>Weekly digest</h5>
	<h6>Sent every Monday</h6>
</div>

<h2>Scale</h2>
<div class="scale">
	{#each sizes as size (size)}
		<div class="scale__row">
			<code class="scale__label">--text-{size}</code>
			<span style="font-size: var(--text-{size})">Sphinx of black quartz, judge my vow</span>
		</div>
	{/each}
</div>

<h2>Numerals</h2>
<p>
	Tabular figures line up in columns. Apply <code>class="numeric"</code> or
	<code>data-numeric</code>; Table, Stat and Delta do this automatically.
</p>
<div class="numerals">
	<div>
		<div class="numerals__title">Proportional</div>
		<div class="numerals__col">
			<span>1,234.56</span><span>987.10</span><span>11,111.11</span><span>−42.00</span>
		</div>
	</div>
	<div>
		<div class="numerals__title">Tabular (mono)</div>
		<div class="numerals__col numeric mono">
			<span>1,234.56</span><span>987.10</span><span>11,111.11</span><span>−42.00</span>
		</div>
	</div>
</div>

<style>
	.specimen {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}
	.specimen :global(h2) {
		margin: 0;
		padding: 0;
		border: none;
	}
	.scale__row {
		display: grid;
		grid-template-columns: 7rem 1fr;
		align-items: baseline;
		gap: var(--space-4);
		padding-block: var(--space-2);
		border-bottom: 1px solid var(--color-border);
		white-space: nowrap;
		overflow: hidden;
	}
	.scale__label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}
	.numerals {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--space-6);
	}
	.numerals__title {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-block-end: var(--space-2);
	}
	.numerals__col {
		display: grid;
		justify-items: end;
		width: max-content;
		font-size: var(--text-lg);
	}
	.mono {
		font-family: var(--font-mono);
	}
</style>
