<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface SelectItem {
		value: string;
		label: string;
		disabled?: boolean;
		/** Optional group heading; items sharing a group are rendered together. */
		group?: string;
	}

	export interface SelectProps {
		items: SelectItem[];
		/** Bindable selected value. */
		value?: string;
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		disabled?: boolean;
		required?: boolean;
		/** Form field name; a hidden input is rendered for native form submission. */
		name?: string;
		id?: string;
		/** Let the user clear the selection by re-selecting the chosen item. */
		allowDeselect?: boolean;
		onValueChange?: (value: string) => void;
		/** Accessible name when not inside a Field. */
		'aria-label'?: string;
		/** Icon before the value. */
		leading?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { Select as Bits } from 'bits-ui';
	import { ChevronDown, Check } from '@lucide/svelte';
	import { cn } from '../../utils/index.js';
	import { getFieldContext } from '../field/context.js';

	let {
		items,
		value = $bindable(),
		placeholder = 'Select…',
		size = 'md',
		invalid,
		disabled,
		required,
		name,
		id: idProp,
		allowDeselect = false,
		onValueChange,
		'aria-label': ariaLabel,
		leading,
		class: className
	}: SelectProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-select-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);

	const selected = $derived(items.find((i) => i.value === value));
	/** Items in source order, bucketed by group (a plain array keeps the derived value inert). */
	const groups = $derived.by(() => {
		const out: Array<[string | undefined, SelectItem[]]> = [];
		for (const item of items) {
			const bucket = out.find(([g]) => g === item.group);
			if (bucket) bucket[1].push(item);
			else out.push([item.group, [item]]);
		}
		return out;
	});
</script>

<Bits.Root
	type="single"
	bind:value
	{onValueChange}
	{items}
	{name}
	disabled={isDisabled}
	required={isRequired}
	{allowDeselect}
>
	<Bits.Trigger
		{id}
		class={cn('db-select', className)}
		data-size={size}
		data-invalid={isInvalid || undefined}
		data-placeholder={selected ? undefined : true}
		aria-label={ariaLabel}
		aria-invalid={isInvalid || undefined}
		aria-describedby={field?.describedBy}
	>
		{#if leading}<span class="db-select__adornment" aria-hidden="true">{@render leading()}</span
			>{/if}
		<span class="db-select__value">{selected?.label ?? placeholder}</span>
		<ChevronDown class="db-select__chevron" aria-hidden="true" />
	</Bits.Trigger>
	<Bits.Portal>
		<Bits.Content class="db-select__content" sideOffset={6} collisionPadding={8}>
			<Bits.Viewport class="db-select__viewport">
				{#each groups as [group, groupItems] (group ?? '')}
					{#if group}
						<Bits.Group>
							<Bits.GroupHeading class="db-select__group-label">{group}</Bits.GroupHeading>
							{#each groupItems as item (item.value)}
								<Bits.Item
									class="db-select__item"
									value={item.value}
									label={item.label}
									disabled={item.disabled}
								>
									{#snippet children({ selected: isSelected })}
										<span class="db-select__item-label">{item.label}</span>
										{#if isSelected}<Check class="db-select__item-check" aria-hidden="true" />{/if}
									{/snippet}
								</Bits.Item>
							{/each}
						</Bits.Group>
					{:else}
						{#each groupItems as item (item.value)}
							<Bits.Item
								class="db-select__item"
								value={item.value}
								label={item.label}
								disabled={item.disabled}
							>
								{#snippet children({ selected: isSelected })}
									<span class="db-select__item-label">{item.label}</span>
									{#if isSelected}<Check class="db-select__item-check" aria-hidden="true" />{/if}
								{/snippet}
							</Bits.Item>
						{/each}
					{/if}
				{/each}
			</Bits.Viewport>
		</Bits.Content>
	</Bits.Portal>
</Bits.Root>

<style>
	:global(.db-select) {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
		--_border: var(--color-border-strong);

		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		height: var(--_h);
		padding-inline: var(--_px);
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--_fs);
		text-align: left;
		cursor: pointer;
		transition: var(--transition-colors);
	}
	:global(.db-select:hover:not(:disabled)) {
		--_border: var(--color-text-subtle);
	}
	:global(.db-select:focus-visible) {
		--_border: var(--color-focus);
		outline: none;
		box-shadow: var(--focus-ring);
	}
	:global(.db-select[data-invalid]) {
		--_border: var(--color-danger);
	}
	:global(.db-select:disabled) {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	:global(.db-select[data-placeholder] .db-select__value) {
		color: var(--color-text-subtle);
	}
	:global(.db-select[data-size='sm']) {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	:global(.db-select[data-size='lg']) {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}
	:global(.db-select__value) {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	:global(.db-select__adornment) {
		display: inline-flex;
		flex: none;
		color: var(--color-text-subtle);
	}
	:global(.db-select__adornment svg),
	:global(.db-select__chevron) {
		width: 1.1em;
		height: 1.1em;
		flex: none;
		color: var(--color-text-subtle);
	}

	:global(.db-select__content) {
		z-index: var(--z-popover);
		width: var(--bits-select-anchor-width);
		min-width: max(var(--bits-select-anchor-width), 10rem);
		max-height: var(--bits-select-content-available-height);
		padding: var(--space-1);
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		outline: none;
	}
	:global(.db-select__content[data-state='open']) {
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-select__content[data-state='closed']) {
		animation: db-pop-out var(--duration-fast) var(--ease-accelerate);
	}
	:global(.db-select__viewport) {
		max-height: 18rem;
		overflow-y: auto;
	}
	:global(.db-select__group-label) {
		padding: var(--space-2) var(--space-2-5) var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}
	:global(.db-select__item) {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: var(--control-h-sm);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		cursor: default;
		user-select: none;
		outline: none;
	}
	:global(.db-select__item[data-highlighted]) {
		background: var(--color-component);
	}
	:global(.db-select__item[data-selected]) {
		color: var(--color-accent-text);
		font-weight: var(--weight-medium);
	}
	:global(.db-select__item[data-disabled]) {
		color: var(--color-text-disabled);
		pointer-events: none;
	}
	:global(.db-select__item-label) {
		flex: 1;
		min-width: 0;
	}
	:global(.db-select__item-check) {
		width: 1em;
		height: 1em;
		flex: none;
	}
</style>
