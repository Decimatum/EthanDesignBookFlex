<script lang="ts">
	const spaces = ['1', '2', '3', '4', '6', '8', '12', '16', '24'];
	const radii = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
	const shadows = ['xs', 'sm', 'md', 'lg'];
</script>

<h1>Spacing & density</h1>
<p class="lead">
	Spacing is a multiple of <code>--space-unit</code>. The density axis changes that unit and the
	control heights, so switching to <em>compact</em> tightens every component at once.
</p>

<h2>Spacing scale</h2>
<div class="rows">
	{#each spaces as s (s)}
		<div class="row">
			<code>--space-{s}</code>
			<span class="bar" style="width: var(--space-{s})"></span>
		</div>
	{/each}
</div>

<h2>Control heights</h2>
<div class="controls">
	{#each ['sm', 'md', 'lg'] as size (size)}
		<div class="control" style="height: var(--control-h-{size})">
			<code>--control-h-{size}</code>
		</div>
	{/each}
</div>

<h2>Radii</h2>
<div class="chips">
	{#each radii as r (r)}
		<div class="chip" style="border-radius: var(--radius-{r})"><code>{r}</code></div>
	{/each}
</div>

<h2>Elevation</h2>
<div class="chips">
	{#each shadows as s (s)}
		<div class="chip chip--shadow" style="box-shadow: var(--shadow-{s})"><code>{s}</code></div>
	{/each}
</div>

<style>
	.rows {
		display: grid;
		gap: var(--space-2);
	}
	.row {
		display: grid;
		grid-template-columns: 7rem 1fr;
		align-items: center;
		gap: var(--space-4);
		font-size: var(--text-sm);
	}
	.bar {
		height: var(--space-4);
		background: var(--color-accent);
		border-radius: var(--radius-xs);
	}
	.controls {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.control {
		display: inline-flex;
		align-items: center;
		padding-inline: var(--space-3);
		border: 1px dashed var(--color-border-strong);
		border-radius: var(--control-radius);
		font-size: var(--text-sm);
	}
	.chips {
		display: flex;
		gap: var(--space-4);
		flex-wrap: wrap;
	}
	.chip {
		display: grid;
		place-items: center;
		width: 5rem;
		height: 5rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		font-size: var(--text-sm);
	}
	.chip--shadow {
		border-radius: var(--radius-md);
		border-color: transparent;
	}
</style>
