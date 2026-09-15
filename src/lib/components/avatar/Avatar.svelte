<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
		/** Image URL. Falls back to initials while loading or on error. */
		src?: string;
		/** Person or entity name — used for initials and the accessible label. */
		name?: string;
		size?: AvatarSize;
		shape?: 'circle' | 'square';
		class?: string;
	}

	/** First letters of the first two words, e.g. "Ada Lovelace" → "AL". */
	export function initials(name: string | undefined): string {
		if (!name) return '';
		return name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('');
	}
</script>

<script lang="ts">
	let {
		src,
		name,
		size = 'md',
		shape = 'circle',
		class: className,
		...rest
	}: AvatarProps = $props();

	let failed = $state(false);
	// A new src deserves a fresh attempt.
	$effect(() => {
		void src;
		failed = false;
	});
	const showImage = $derived(Boolean(src) && !failed);
	// Deterministic hue from the name so the same person always gets the same colour.
	const hue = $derived.by(() => {
		let h = 0;
		for (const ch of name ?? '') h = (h * 31 + ch.charCodeAt(0)) % 360;
		return h;
	});
</script>

<span
	{...rest}
	class={['db-avatar', className]}
	data-size={size}
	data-shape={shape}
	role="img"
	aria-label={name ?? 'Avatar'}
	style:--_hue={hue}
>
	{#if showImage}
		<img class="db-avatar__img" {src} alt="" onerror={() => (failed = true)} />
	{:else}
		<span class="db-avatar__initials" aria-hidden="true">{initials(name)}</span>
	{/if}
</span>

<style>
	.db-avatar {
		--_size: 2.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--_size);
		height: var(--_size);
		overflow: hidden;
		border-radius: var(--radius-full);
		background: oklch(from var(--color-accent-subtle) l c var(--_hue));
		color: oklch(from var(--color-accent-text) l c var(--_hue));
		font-family: var(--font-body);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--_size) * 0.4);
		letter-spacing: 0.02em;
		user-select: none;
		vertical-align: middle;
	}
	.db-avatar[data-shape='square'] {
		border-radius: var(--radius-md);
	}
	.db-avatar[data-size='xs'] {
		--_size: 1.5rem;
	}
	.db-avatar[data-size='sm'] {
		--_size: 2rem;
	}
	.db-avatar[data-size='lg'] {
		--_size: 3.5rem;
	}
	.db-avatar[data-size='xl'] {
		--_size: 5rem;
	}
	.db-avatar__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
