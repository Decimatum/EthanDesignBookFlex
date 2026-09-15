<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

	export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		tone?: AlertTone;
		/** Bold first line. */
		title?: string;
		/** Show a close button; the alert removes itself and calls `onDismiss`. */
		dismissible?: boolean;
		onDismiss?: () => void;
		/** Replace the default tone icon. Pass `null` to hide it. */
		icon?: Snippet | null;
		/** Buttons or links under the message. */
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Info, CircleCheck, TriangleAlert, CircleX, X } from '@lucide/svelte';

	let {
		tone = 'info',
		title,
		dismissible = false,
		onDismiss,
		icon,
		actions,
		children,
		class: className,
		...rest
	}: AlertProps = $props();

	let open = $state(true);
	function dismiss() {
		open = false;
		onDismiss?.();
	}

	const icons = {
		info: Info,
		success: CircleCheck,
		warning: TriangleAlert,
		danger: CircleX,
		neutral: Info
	};
	const DefaultIcon = $derived(icons[tone]);
	// Danger and warning interrupt; the rest are polite status updates.
	const role = $derived(tone === 'danger' || tone === 'warning' ? 'alert' : 'status');
</script>

{#if open}
	<div {...rest} class={['db-alert', className]} data-tone={tone} {role}>
		{#if icon !== null}
			<span class="db-alert__icon" aria-hidden="true">
				{#if icon}{@render icon()}{:else}<DefaultIcon />{/if}
			</span>
		{/if}
		<div class="db-alert__content">
			{#if title}<p class="db-alert__title">{title}</p>{/if}
			{#if children}<div class="db-alert__body">{@render children()}</div>{/if}
			{#if actions}<div class="db-alert__actions">{@render actions()}</div>{/if}
		</div>
		{#if dismissible}
			<button type="button" class="db-alert__close" aria-label="Dismiss" onclick={dismiss}>
				<X aria-hidden="true" />
			</button>
		{/if}
	</div>
{/if}

<style>
	.db-alert {
		--_bg: var(--color-info-subtle);
		--_border: var(--color-info-border);
		--_icon: var(--color-info-text);
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--_bg);
		border: 1px solid var(--_border);
		border-radius: var(--radius-lg);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}
	.db-alert[data-tone='success'] {
		--_bg: var(--color-success-subtle);
		--_border: var(--color-success-border);
		--_icon: var(--color-success-text);
	}
	.db-alert[data-tone='warning'] {
		--_bg: var(--color-warning-subtle);
		--_border: var(--color-warning-border);
		--_icon: var(--color-warning-text);
	}
	.db-alert[data-tone='danger'] {
		--_bg: var(--color-danger-subtle);
		--_border: var(--color-danger-border);
		--_icon: var(--color-danger-text);
	}
	.db-alert[data-tone='neutral'] {
		--_bg: var(--color-bg-subtle);
		--_border: var(--color-border);
		--_icon: var(--color-text-muted);
	}
	.db-alert__icon {
		display: inline-flex;
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.1em;
		color: var(--_icon);
	}
	.db-alert__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-alert__content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.db-alert__title {
		margin: 0;
		font-weight: var(--weight-semibold);
		color: var(--color-text);
	}
	.db-alert__body {
		color: var(--color-text-muted);
	}
	.db-alert__body :global(p) {
		margin: 0;
	}
	.db-alert__actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}
	.db-alert__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		margin: calc(var(--space-1) * -1) calc(var(--space-2) * -1) calc(var(--space-1) * -1) 0;
		border-radius: var(--control-radius);
		color: var(--color-text-muted);
		transition: var(--transition-colors);
	}
	.db-alert__close:hover {
		background: oklch(0% 0 0 / 0.06);
		color: var(--color-text);
	}
	.db-alert__close:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.db-alert__close :global(svg) {
		width: 1rem;
		height: 1rem;
	}
</style>
