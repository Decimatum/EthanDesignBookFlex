<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type BannerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

	export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		tone?: BannerTone;
		/** Bold lead-in before the message. */
		title?: string;
		/** Show a close button; the banner removes itself and calls `onDismiss`. */
		dismissible?: boolean;
		/** Bindable visibility. */
		open?: boolean;
		onDismiss?: () => void;
		/** Replace the tone icon, or `null` to hide it. */
		icon?: Snippet | null;
		/** Buttons or links at the end of the line (they wrap under the message on narrow screens). */
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Info, CircleCheck, TriangleAlert, CircleX, Sparkles, X } from '@lucide/svelte';

	let {
		tone = 'info',
		title,
		dismissible = false,
		open = $bindable(true),
		onDismiss,
		icon,
		actions,
		children,
		class: className,
		role: roleProp,
		...rest
	}: BannerProps = $props();

	function dismiss() {
		open = false;
		onDismiss?.();
	}

	const icons = {
		info: Info,
		success: CircleCheck,
		warning: TriangleAlert,
		danger: CircleX,
		neutral: Info,
		accent: Sparkles
	};
	const DefaultIcon = $derived(icons[tone]);
	const role = $derived(roleProp ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status'));
</script>

{#if open}
	<div {...rest} class={['db-banner', className]} data-tone={tone} {role}>
		{#if icon !== null}
			<span class="db-banner__icon" aria-hidden="true">
				{#if icon}{@render icon()}{:else}<DefaultIcon />{/if}
			</span>
		{/if}
		<div class="db-banner__body">
			{#if title}<strong class="db-banner__title">{title}</strong>{/if}
			{#if children}<span class="db-banner__message">{@render children()}</span>{/if}
		</div>
		{#if actions}<div class="db-banner__actions">{@render actions()}</div>{/if}
		{#if dismissible}
			<button type="button" class="db-banner__close" aria-label="Dismiss" onclick={dismiss}
				><X /></button
			>
		{/if}
	</div>
{/if}

<style>
	.db-banner {
		--_bg: var(--color-info-subtle);
		--_fg: var(--color-info-text);
		--_line: var(--color-info-border);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-3);
		width: 100%;
		min-height: var(--control-h-md);
		padding: var(--space-2) var(--space-4);
		box-sizing: border-box;
		background: var(--_bg);
		color: var(--_fg);
		border-block: 1px solid var(--_line);
		font-size: var(--text-sm);
		line-height: 1.4;
	}
	.db-banner[data-tone='success'] {
		--_bg: var(--color-success-subtle);
		--_fg: var(--color-success-text);
		--_line: var(--color-success-border);
	}
	.db-banner[data-tone='warning'] {
		--_bg: var(--color-warning-subtle);
		--_fg: var(--color-warning-text);
		--_line: var(--color-warning-border);
	}
	.db-banner[data-tone='danger'] {
		--_bg: var(--color-danger-subtle);
		--_fg: var(--color-danger-text);
		--_line: var(--color-danger-border);
	}
	.db-banner[data-tone='neutral'] {
		--_bg: var(--color-bg-subtle);
		--_fg: var(--color-text);
		--_line: var(--color-border);
	}
	.db-banner[data-tone='accent'] {
		--_bg: var(--color-accent-subtle);
		--_fg: var(--color-accent-text);
		--_line: var(--color-accent-border);
	}
	.db-banner__icon {
		display: inline-flex;
		flex: none;
	}
	.db-banner__icon :global(svg) {
		width: 1.15em;
		height: 1.15em;
	}
	.db-banner__body {
		flex: 1 1 16rem;
		min-width: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--space-2);
	}
	.db-banner__title {
		font-weight: 600;
	}
	.db-banner__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-inline-start: auto;
	}
	.db-banner__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		margin-inline-start: var(--space-1);
		border: 0;
		border-radius: var(--control-radius);
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	.db-banner__close :global(svg) {
		width: 1em;
		height: 1em;
	}
	.db-banner__close:hover {
		background: var(--color-component-hover);
	}
	.db-banner__close:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
</style>
