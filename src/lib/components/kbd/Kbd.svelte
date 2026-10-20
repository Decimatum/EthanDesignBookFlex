<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface KbdProps extends HTMLAttributes<HTMLElement> {
		/** Shortcut string such as `"mod+shift+k"`; keys are split on `+` and rendered separately. */
		keys?: string;
		size?: 'sm' | 'md';
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let { keys, size = 'md', children, class: className, ...rest }: KbdProps = $props();

	// Decided after mount so server and client render the same markup first.
	let isMac = $derived(false);
	$effect(() => {
		isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
	});

	const glyphs = $derived<Record<string, string>>({
		mod: isMac ? '⌘' : 'Ctrl',
		cmd: '⌘',
		meta: '⌘',
		ctrl: 'Ctrl',
		control: 'Ctrl',
		alt: isMac ? '⌥' : 'Alt',
		option: '⌥',
		shift: '⇧',
		enter: '↵',
		return: '↵',
		backspace: '⌫',
		delete: '⌦',
		tab: '⇥',
		esc: 'Esc',
		escape: 'Esc',
		space: 'Space',
		up: '↑',
		down: '↓',
		left: '←',
		right: '→'
	});

	const parts = $derived(
		keys
			? keys
					.split('+')
					.map((k) => k.trim())
					.filter(Boolean)
					.map((k) => glyphs[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k))
			: []
	);
</script>

{#if parts.length}
	<span {...rest} class={['db-kbd-group', className]} data-size={size}>
		{#each parts as part, i (i)}
			<kbd class="db-kbd">{part}</kbd>
		{/each}
	</span>
{:else}
	<kbd {...rest} class={['db-kbd', className]} data-size={size}>
		{#if children}{@render children()}{/if}
	</kbd>
{/if}

<style>
	.db-kbd-group {
		display: inline-flex;
		gap: 0.25em;
		vertical-align: middle;
	}
	.db-kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5em;
		height: 1.5em;
		padding-inline: 0.4em;
		border: 1px solid var(--color-border-strong);
		border-bottom-width: 2px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-subtle);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		line-height: 1;
		vertical-align: middle;
		white-space: nowrap;
	}
	.db-kbd[data-size='sm'],
	.db-kbd-group[data-size='sm'] .db-kbd {
		font-size: 0.6875rem;
		height: 1.4em;
	}
</style>
