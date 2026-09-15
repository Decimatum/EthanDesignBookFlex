<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface SwitchProps extends Omit<HTMLInputAttributes, 'type' | 'size' | 'checked'> {
		checked?: boolean;
		size?: 'sm' | 'md';
		/** Put the label before the switch. */
		labelPosition?: 'start' | 'end';
		description?: string;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { getFieldContext } from '../field/context.js';

	let {
		checked = $bindable(false),
		size = 'md',
		labelPosition = 'end',
		description,
		disabled,
		id: idProp,
		children,
		class: className,
		...rest
	}: SwitchProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? `db-switch-${own}`);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
</script>

<label
	class={['db-switch', className]}
	for={id}
	data-size={size}
	data-label-position={labelPosition}
	data-disabled={isDisabled || undefined}
>
	<input
		{...rest}
		{id}
		type="checkbox"
		role="switch"
		class="db-switch__control sr-only"
		bind:checked
		disabled={isDisabled}
		aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
	/>
	<span class="db-switch__track" aria-hidden="true">
		<span class="db-switch__thumb"></span>
	</span>
	{#if children || description}
		<span class="db-switch__text">
			{#if children}<span class="db-switch__label">{@render children()}</span>{/if}
			{#if description}<span class="db-switch__description">{description}</span>{/if}
		</span>
	{/if}
</label>

<style>
	.db-switch {
		--_w: 2.25rem;
		--_h: 1.25rem;
		--_pad: 2px;
		display: inline-flex;
		align-items: flex-start;
		gap: var(--space-2-5);
		cursor: pointer;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		color: var(--color-text);
		user-select: none;
	}
	.db-switch[data-size='sm'] {
		--_w: 1.75rem;
		--_h: 1rem;
		font-size: var(--text-xs);
	}
	.db-switch[data-label-position='start'] {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}
	.db-switch[data-disabled] {
		cursor: not-allowed;
		color: var(--color-text-disabled);
	}
	.db-switch__track {
		position: relative;
		flex: none;
		width: var(--_w);
		height: var(--_h);
		margin-top: calc((1em * var(--leading-snug) - var(--_h)) / 2);
		border-radius: var(--radius-full);
		background: var(--color-border-strong);
		transition: var(--transition-colors);
	}
	.db-switch__thumb {
		position: absolute;
		top: var(--_pad);
		left: var(--_pad);
		width: calc(var(--_h) - var(--_pad) * 2);
		height: calc(var(--_h) - var(--_pad) * 2);
		border-radius: var(--radius-full);
		background: var(--white);
		box-shadow: var(--shadow-sm);
		transition: transform var(--duration-base) var(--ease-spring);
	}
	.db-switch:hover:not([data-disabled]) .db-switch__track {
		background: var(--color-text-subtle);
	}
	.db-switch__control:checked + .db-switch__track {
		background: var(--color-accent);
	}
	.db-switch__control:checked + .db-switch__track .db-switch__thumb {
		transform: translateX(calc(var(--_w) - var(--_h)));
	}
	.db-switch__control:focus-visible + .db-switch__track {
		box-shadow: var(--focus-ring);
	}
	.db-switch[data-disabled] .db-switch__track {
		opacity: 0.5;
	}
	.db-switch__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}
	.db-switch__description {
		color: var(--color-text-muted);
	}
	.db-switch[data-disabled] .db-switch__description {
		color: var(--color-text-disabled);
	}
</style>
