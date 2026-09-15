<script lang="ts">
	const durations = ['fast', 'base', 'slow', 'slower'];
	const easings = ['standard', 'decelerate', 'accelerate', 'spring', 'in-out'];
	let play = $state(false);
</script>

<h1>Motion</h1>
<p class="lead">
	Every transition in the library reads its duration and easing from tokens, so
	<code>prefers-reduced-motion</code> is honoured everywhere by zeroing the durations in one place.
</p>

<h2>Durations</h2>
<table>
	<thead><tr><th>Token</th><th>Use</th></tr></thead>
	<tbody>
		<tr><td><code>--duration-fast</code></td><td>Colour and border changes on hover.</td></tr>
		<tr><td><code>--duration-base</code></td><td>Opacity, small movement, menus.</td></tr>
		<tr><td><code>--duration-slow</code></td><td>Dialogs, drawers, page transitions.</td></tr>
		<tr><td><code>--duration-slower</code></td><td>Spinners and long ambient loops.</td></tr>
	</tbody>
</table>

<h2>Easings</h2>
<button type="button" class="play" onclick={() => (play = !play)}>
	{play ? 'Reset' : 'Play'}
</button>
<div class="track-list">
	{#each easings as e (e)}
		{#each durations.slice(2, 3) as d (d)}
			<div class="track">
				<code>--ease-{e}</code>
				<div class="lane">
					<span
						class="ball"
						class:ball--moved={play}
						style="transition: transform var(--duration-{d}) var(--ease-{e})"
					></span>
				</div>
			</div>
		{/each}
	{/each}
</div>

<style>
	.play {
		height: var(--control-h-sm);
		padding-inline: var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--control-radius);
		font-size: var(--text-sm);
		margin-block-end: var(--space-3);
	}
	.play:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.track-list {
		display: grid;
		gap: var(--space-3);
	}
	.track {
		display: grid;
		grid-template-columns: 9rem 1fr;
		align-items: center;
		gap: var(--space-4);
		font-size: var(--text-sm);
	}
	.lane {
		height: 1.5rem;
		border-radius: var(--radius-full);
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		position: relative;
	}
	.ball {
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(1.5rem - 6px);
		height: calc(1.5rem - 6px);
		border-radius: var(--radius-full);
		background: var(--color-accent);
	}
	.ball--moved {
		transform: translateX(calc(100cqw - 100%));
	}
	.lane {
		container-type: inline-size;
	}
</style>
