<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
	export type ButtonTone = 'accent' | 'neutral' | 'danger';
	export type ButtonSize = 'sm' | 'md' | 'lg';

	/**
	 * `href` switches the root element to `<a>`; the remaining native attributes are
	 * forwarded to whichever element renders. Anchor-only attributes are listed explicitly.
	 */
	export interface ButtonProps extends Omit<HTMLButtonAttributes, 'type' | 'disabled'> {
		/** Visual style. */
		variant?: ButtonVariant;
		/** Colour intent. */
		tone?: ButtonTone;
		size?: ButtonSize;
		/** Native button type (ignored when `href` is set). */
		type?: 'button' | 'submit' | 'reset';
		/** Renders an `<a>` instead of a `<button>`. */
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		rel?: HTMLAnchorAttributes['rel'];
		download?: HTMLAnchorAttributes['download'];
		disabled?: boolean;
		/** Shows a spinner in place of the leading icon and disables interaction. */
		loading?: boolean;
		/** Stretch to the container width. */
		block?: boolean;
		/** Square button for a lone icon. Requires `aria-label`. */
		iconOnly?: boolean;
		/** Icon or element before the label. */
		leading?: Snippet;
		/** Icon or element after the label. */
		trailing?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import Spinner from '../spinner/Spinner.svelte';

	let {
		variant = 'solid',
		tone = 'accent',
		size = 'md',
		type = 'button',
		href,
		target,
		rel,
		download,
		disabled = false,
		loading = false,
		block = false,
		iconOnly = false,
		leading,
		trailing,
		children,
		class: className,
		...rest
	}: ButtonProps = $props();

	const inert = $derived(disabled || loading);
</script>

{#snippet content()}
	{#if loading}
		<Spinner label={null} class="db-button__spinner" />
	{:else if leading}
		<span class="db-button__icon" aria-hidden="true">{@render leading()}</span>
	{/if}
	{#if children}
		<span class="db-button__label">{@render children()}</span>
	{/if}
	{#if trailing}
		<span class="db-button__icon" aria-hidden="true">{@render trailing()}</span>
	{/if}
{/snippet}

{#if href !== undefined}
	<a
		{...rest as HTMLAnchorAttributes}
		class={['db-button', className]}
		href={inert ? undefined : href}
		{target}
		{rel}
		{download}
		role={inert ? 'link' : undefined}
		aria-disabled={inert ? 'true' : undefined}
		aria-busy={loading ? 'true' : undefined}
		tabindex={inert ? -1 : undefined}
		data-variant={variant}
		data-tone={tone}
		data-size={size}
		data-block={block || undefined}
		data-icon-only={iconOnly || undefined}
		data-loading={loading || undefined}
	>
		{@render content()}
	</a>
{:else}
	<button
		{...rest}
		class={['db-button', className]}
		{type}
		disabled={inert}
		aria-busy={loading ? 'true' : undefined}
		data-variant={variant}
		data-tone={tone}
		data-size={size}
		data-block={block || undefined}
		data-icon-only={iconOnly || undefined}
		data-loading={loading || undefined}
	>
		{@render content()}
	</button>
{/if}

<style>
	/* ---------- base ---------- */
	.db-button {
		--_bg: transparent;
		--_bg-hover: transparent;
		--_bg-active: transparent;
		--_fg: var(--color-text);
		--_border: transparent;

		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--control-gap);
		height: var(--_h);
		padding-inline: var(--_px);
		font-family: var(--font-body);
		font-size: var(--_fs);
		font-weight: var(--weight-medium);
		line-height: 1;
		white-space: nowrap;
		text-decoration: none;
		color: var(--_fg);
		background: var(--_bg);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition: var(--transition-colors), var(--transition-transform);
	}

	.db-button:hover {
		background: var(--_bg-hover);
	}
	.db-button:active {
		background: var(--_bg-active);
		transform: translateY(0.5px);
	}
	.db-button:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	.db-button:disabled,
	.db-button[aria-disabled='true'] {
		opacity: 0.55;
		cursor: not-allowed;
		pointer-events: none;
		transform: none;
	}

	/* ---------- sizes ---------- */
	.db-button[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	.db-button[data-size='md'] {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
	}
	.db-button[data-size='lg'] {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}

	/* ---------- tones: define the palette each variant draws from ---------- */
	.db-button[data-tone='accent'] {
		--_solid: var(--color-accent);
		--_solid-hover: var(--color-accent-hover);
		--_solid-active: var(--color-accent-active);
		--_solid-fg: var(--color-accent-fg);
		--_subtle: var(--color-accent-subtle);
		--_subtle-hover: var(--color-accent-subtle-hover);
		--_subtle-active: var(--color-accent-subtle-active);
		--_text: var(--color-accent-text);
		--_outline: var(--color-accent-border);
	}
	.db-button[data-tone='neutral'] {
		--_solid: var(--color-neutral);
		--_solid-hover: var(--color-neutral-hover);
		--_solid-active: var(--color-neutral-hover);
		--_solid-fg: var(--color-neutral-fg);
		--_subtle: var(--color-component);
		--_subtle-hover: var(--color-component-hover);
		--_subtle-active: var(--color-component-active);
		--_text: var(--color-text);
		--_outline: var(--color-border-strong);
	}
	.db-button[data-tone='danger'] {
		--_solid: var(--color-danger);
		--_solid-hover: var(--color-danger-hover);
		--_solid-active: var(--color-danger-hover);
		--_solid-fg: var(--color-danger-fg);
		--_subtle: var(--color-danger-subtle);
		--_subtle-hover: var(--color-danger-border);
		--_subtle-active: var(--color-danger-border);
		--_text: var(--color-danger-text);
		--_outline: var(--color-danger-border);
	}

	/* ---------- variants ---------- */
	.db-button[data-variant='solid'] {
		--_bg: var(--_solid);
		--_bg-hover: var(--_solid-hover);
		--_bg-active: var(--_solid-active);
		--_fg: var(--_solid-fg);
	}
	.db-button[data-variant='soft'] {
		--_bg: var(--_subtle);
		--_bg-hover: var(--_subtle-hover);
		--_bg-active: var(--_subtle-active);
		--_fg: var(--_text);
	}
	.db-button[data-variant='outline'] {
		--_bg-hover: var(--_subtle);
		--_bg-active: var(--_subtle-hover);
		--_fg: var(--_text);
		--_border: var(--_outline);
	}
	.db-button[data-variant='ghost'] {
		--_bg-hover: var(--_subtle);
		--_bg-active: var(--_subtle-hover);
		--_fg: var(--_text);
	}
	.db-button[data-variant='link'] {
		--_fg: var(--_text);
		height: auto;
		padding: 0;
		border-radius: var(--radius-xs);
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 0.2em;
	}
	.db-button[data-variant='link']:hover {
		text-decoration-color: currentColor;
	}
	.db-button[data-variant='link']:active {
		transform: none;
	}

	/* ---------- modifiers ---------- */
	.db-button[data-block] {
		display: flex;
		width: 100%;
	}
	.db-button[data-icon-only] {
		width: var(--_h);
		padding-inline: 0;
	}

	/* ---------- inner parts ---------- */
	.db-button__icon,
	.db-button :global(.db-button__spinner) {
		display: inline-flex;
		flex: none;
		width: 1.15em;
		height: 1.15em;
	}
	.db-button__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-button__label {
		display: inline-block;
	}
</style>
