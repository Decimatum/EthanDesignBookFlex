<script lang="ts">
	const steps = Array.from({ length: 12 }, (_, i) => i + 1);
	const ramps = [
		{ name: 'Neutral', prefix: 'n' },
		{ name: 'Accent', prefix: 'a' }
	];
	const statusSteps = [3, 6, 9, 10, 11];
	const statuses = ['success', 'warning', 'danger', 'info'];

	const semantic = [
		{
			group: 'Surfaces',
			tokens: [
				'bg',
				'bg-subtle',
				'surface',
				'surface-raised',
				'component',
				'component-hover',
				'component-active'
			]
		},
		{ group: 'Borders', tokens: ['border', 'border-hover', 'border-strong', 'focus'] },
		{ group: 'Text', tokens: ['text', 'text-muted', 'text-subtle', 'text-disabled'] },
		{
			group: 'Accent',
			tokens: [
				'accent',
				'accent-hover',
				'accent-active',
				'accent-subtle',
				'accent-border',
				'accent-text'
			]
		},
		{
			group: 'Status',
			tokens: [
				'success',
				'success-subtle',
				'success-text',
				'warning',
				'warning-subtle',
				'warning-text',
				'danger',
				'danger-subtle',
				'danger-text',
				'info',
				'info-subtle',
				'info-text',
				'positive',
				'negative'
			]
		}
	];
</script>

<h1>Colors</h1>
<p class="lead">
	Every colour comes from a 12-step ramp. Themes supply the ramps; <code>semantic.css</code> maps them
	to meaning once, so light and dark never need separate component styles.
</p>

<h2>Ramps</h2>
<p>
	1–2 backgrounds · 3–5 component fills · 6–8 borders · 9–10 solid fills · 11–12 text. Change the
	theme or scheme in the header to see the ramps swap.
</p>
{#each ramps as ramp (ramp.prefix)}
	<h3 class="ramp-title">{ramp.name}</h3>
	<div class="ramp">
		{#each steps as step (step)}
			<div class="swatch">
				<div class="swatch__chip" style="background: var(--{ramp.prefix}-{step})"></div>
				<span class="swatch__label">{step}</span>
			</div>
		{/each}
	</div>
{/each}

{#each statuses as status (status)}
	<h3 class="ramp-title">{status}</h3>
	<div class="ramp ramp--short">
		{#each statusSteps as step (step)}
			<div class="swatch">
				<div class="swatch__chip" style="background: var(--{status}-{step})"></div>
				<span class="swatch__label">{step}</span>
			</div>
		{/each}
	</div>
{/each}

<h2>Semantic tokens</h2>
<p>These are the only colour tokens components may use.</p>
{#each semantic as group (group.group)}
	<h3 class="ramp-title">{group.group}</h3>
	<div class="tokens">
		{#each group.tokens as token (token)}
			<div class="token">
				<span class="token__chip" style="background: var(--color-{token})"></span>
				<code>--color-{token}</code>
			</div>
		{/each}
	</div>
{/each}

<style>
	.ramp-title {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		letter-spacing: 0;
		color: var(--color-text-muted);
		margin-block: var(--space-4) var(--space-2);
		text-transform: capitalize;
	}
	.ramp {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: var(--space-1);
	}
	.ramp--short {
		grid-template-columns: repeat(12, 1fr);
	}
	.swatch {
		display: grid;
		gap: var(--space-1);
		justify-items: center;
	}
	.swatch__chip {
		width: 100%;
		aspect-ratio: 1;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}
	.swatch__label {
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		color: var(--color-text-muted);
	}
	.tokens {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--space-2);
	}
	.token {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}
	.token__chip {
		width: 1.5rem;
		height: 1.5rem;
		flex: none;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}
</style>
