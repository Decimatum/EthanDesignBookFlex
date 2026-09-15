<script lang="ts" module>
	export type ToasterPosition =
		'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

	export interface ToasterProps {
		position?: ToasterPosition;
		class?: string;
	}
</script>

<script lang="ts">
	import { Info, CircleCheck, TriangleAlert, CircleX, X } from '@lucide/svelte';
	import { toasts } from './toast.svelte.js';

	let { position = 'bottom-right', class: className }: ToasterProps = $props();

	const icons = {
		neutral: null,
		info: Info,
		success: CircleCheck,
		warning: TriangleAlert,
		danger: CircleX
	};

	// One timer per toast; paused while the region is hovered or focused.
	let paused = $state(false);
	// Timer bookkeeping is deliberately non-reactive: it is read inside effects but must not
	// trigger them, so a plain Map (not SvelteMap) is correct here.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const timers = new Map<
		string,
		{ seq: number; remaining: number; started: number; handle?: number }
	>();

	function start(id: string) {
		const t = timers.get(id);
		if (!t || t.handle !== undefined || t.remaining <= 0) return;
		t.started = Date.now();
		t.handle = window.setTimeout(() => {
			timers.delete(id);
			toasts.dismiss(id);
		}, t.remaining);
	}
	function stop(id: string) {
		const t = timers.get(id);
		if (!t || t.handle === undefined) return;
		window.clearTimeout(t.handle);
		t.handle = undefined;
		t.remaining = Math.max(0, t.remaining - (Date.now() - t.started));
	}

	// Track additions, removals and in-place updates (same id, new seq).
	$effect(() => {
		const current = toasts.items.map((t) => ({ id: t.id, seq: t.seq, duration: t.duration }));
		const ids = new Set(current.map((c) => c.id));
		for (const id of [...timers.keys()]) {
			if (!ids.has(id)) {
				stop(id);
				timers.delete(id);
			}
		}
		for (const c of current) {
			const existing = timers.get(c.id);
			if (existing && existing.seq === c.seq) continue;
			if (existing) stop(c.id);
			timers.set(c.id, { seq: c.seq, remaining: c.duration, started: 0 });
			if (!paused) start(c.id);
		}
	});

	$effect(() => {
		if (paused) for (const id of timers.keys()) stop(id);
		else for (const id of timers.keys()) start(id);
	});
</script>

<div
	class={['db-toaster', className]}
	data-position={position}
	role="region"
	aria-label="Notifications"
	onpointerenter={() => (paused = true)}
	onpointerleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={(e) => {
		if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) paused = false;
	}}
>
	<!-- Live region announces new toasts without moving focus -->
	<div class="sr-only" aria-live="polite" aria-atomic="false">
		{#each toasts.items as t (t.id)}<p>
				{t.title}{t.description ? `. ${t.description}` : ''}
			</p>{/each}
	</div>
	{#each toasts.items as item (item.id)}
		{@const Icon = icons[item.tone]}
		<div class="db-toast" data-tone={item.tone} role={item.tone === 'danger' ? 'alert' : 'status'}>
			{#if item.icon || Icon}
				<span class="db-toast__icon" aria-hidden="true">
					{#if item.icon}{@render item.icon()}{:else if Icon}<Icon />{/if}
				</span>
			{/if}
			<div class="db-toast__content">
				<p class="db-toast__title">{item.title}</p>
				{#if item.description}<p class="db-toast__description">{item.description}</p>{/if}
			</div>
			{#if item.action}
				<button
					type="button"
					class="db-toast__action"
					onclick={() => {
						item.action?.onClick();
						toasts.dismiss(item.id);
					}}
				>
					{item.action.label}
				</button>
			{/if}
			{#if item.dismissible}
				<button
					type="button"
					class="db-toast__close"
					aria-label="Dismiss"
					onclick={() => toasts.dismiss(item.id)}
				>
					<X aria-hidden="true" />
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.db-toaster {
		position: fixed;
		z-index: var(--z-toast);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		width: min(24rem, calc(100vw - var(--space-8)));
		padding: var(--space-4);
		pointer-events: none;
	}
	.db-toaster[data-position^='top'] {
		top: 0;
	}
	.db-toaster[data-position^='bottom'] {
		bottom: 0;
		flex-direction: column-reverse;
	}
	.db-toaster[data-position$='left'] {
		left: 0;
	}
	.db-toaster[data-position$='right'] {
		right: 0;
	}
	.db-toaster[data-position$='center'] {
		left: 50%;
		transform: translateX(-50%);
	}

	.db-toast {
		--_icon: var(--color-text-muted);
		pointer-events: auto;
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	.db-toast[data-tone='info'] {
		--_icon: var(--color-info-text);
	}
	.db-toast[data-tone='success'] {
		--_icon: var(--color-success-text);
	}
	.db-toast[data-tone='warning'] {
		--_icon: var(--color-warning-text);
	}
	.db-toast[data-tone='danger'] {
		--_icon: var(--color-danger-text);
	}
	.db-toast__icon {
		display: inline-flex;
		flex: none;
		width: 1.15rem;
		height: 1.15rem;
		margin-top: 0.05em;
		color: var(--_icon);
	}
	.db-toast__icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-toast__content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	.db-toast__title {
		margin: 0;
		font-weight: var(--weight-medium);
	}
	.db-toast__description {
		margin: 0;
		color: var(--color-text-muted);
	}
	.db-toast__action {
		flex: none;
		height: var(--control-h-sm);
		padding-inline: var(--space-2-5);
		border-radius: var(--control-radius);
		background: var(--color-component);
		color: var(--color-text);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		transition: var(--transition-colors);
	}
	.db-toast__action:hover {
		background: var(--color-component-hover);
	}
	.db-toast__action:focus-visible,
	.db-toast__close:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.db-toast__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		margin: calc(var(--space-1) * -1) calc(var(--space-1) * -1) calc(var(--space-1) * -1) 0;
		border-radius: var(--control-radius);
		color: var(--color-text-subtle);
		transition: var(--transition-colors);
	}
	.db-toast__close:hover {
		background: var(--color-component);
		color: var(--color-text);
	}
	.db-toast__close :global(svg) {
		width: 1rem;
		height: 1rem;
	}
</style>
