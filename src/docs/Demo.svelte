<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		/** Source shown under the preview. Keep it to what the reader would paste. */
		code?: string;
		/** Lay the preview out as a column instead of a wrapping row. */
		stack?: boolean;
		children: Snippet;
	}
	let { title, code, stack = false, children }: Props = $props();
	let open = $state(false);
</script>

<section class="demo">
	{#if title}<h2 class="demo__title">{title}</h2>{/if}
	<div class="demo__preview" class:demo__preview--stack={stack}>
		{@render children()}
	</div>
	{#if code}
		<button class="demo__toggle" type="button" aria-expanded={open} onclick={() => (open = !open)}>
			{open ? 'Hide code' : 'Show code'}
		</button>
		{#if open}
			<pre class="demo__code"><code>{code.trim()}</code></pre>
		{/if}
	{/if}
</section>

<style>
	.demo {
		margin-block: var(--space-6);
	}
	/* Demo titles are h2 for document outline but styled as small labels;
	   the layout's global h2 rule is overridden here. */
	.demo :global(h2.demo__title) {
		font-size: var(--text-md);
		font-family: var(--font-body);
		font-variation-settings: normal;
		font-weight: var(--weight-semibold);
		letter-spacing: 0;
		margin: 0 0 var(--space-3);
		padding: 0;
		border: none;
	}
	.demo__preview {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
		background-size: 16px 16px;
	}
	.demo__preview--stack {
		flex-direction: column;
		align-items: stretch;
	}
	.demo__toggle {
		margin-block-start: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.demo__toggle:focus-visible {
		box-shadow: var(--focus-ring);
		border-radius: var(--radius-xs);
	}
	.demo__code {
		margin-block-start: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		overflow-x: auto;
	}
</style>
