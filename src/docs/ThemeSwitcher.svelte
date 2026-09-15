<script lang="ts">
	import {
		theme,
		THEMES,
		SCHEMES,
		DENSITIES,
		type ThemeSettings
	} from '$lib/theme/theme.svelte.js';

	const groups = [
		{ key: 'theme', label: 'Theme', options: THEMES },
		{ key: 'scheme', label: 'Scheme', options: SCHEMES },
		{ key: 'density', label: 'Density', options: DENSITIES }
	] as const;
</script>

<div class="switcher">
	{#each groups as group (group.key)}
		<label class="group">
			<span class="group__label">{group.label}</span>
			<select
				class="group__select"
				value={theme.current[group.key]}
				onchange={(e) =>
					theme.set({ [group.key]: e.currentTarget.value } as Partial<ThemeSettings>)}
			>
				{#each group.options as option (option)}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
	{/each}
</div>

<style>
	.switcher {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
	.group {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.group__select {
		height: var(--control-h-sm);
		padding-inline: var(--space-2);
		border: 1px solid var(--color-border);
		border-radius: var(--control-radius);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--text-sm);
	}
	.group__select:focus-visible {
		box-shadow: var(--focus-ring);
	}
</style>
