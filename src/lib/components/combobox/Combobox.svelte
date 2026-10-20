<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface ComboboxItem {
		value: string;
		label: string;
		disabled?: boolean;
		/** Optional group heading; items sharing a group are rendered together. */
		group?: string;
		/** Extra text searched alongside the label (ticker, email, keywords). */
		keywords?: string;
	}

	export interface ComboboxProps {
		items: ComboboxItem[];
		/** Bindable: a string, or string[] when `multiple`. */
		value?: string | string[];
		/** Pick several; chosen items show as removable chips. */
		multiple?: boolean;
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		disabled?: boolean;
		required?: boolean;
		/** Form field name; hidden inputs are rendered for native submission. */
		name?: string;
		id?: string;
		/** Text shown when the filter matches nothing. */
		emptyText?: string;
		/** Replace the default case-insensitive "label or keywords contains query" filter. */
		filter?: (item: ComboboxItem, query: string) => boolean;
		onValueChange?: (value: string | string[]) => void;
		/** Accessible name when not inside a Field. */
		'aria-label'?: string;
		/** Icon before the input (a search glass, say). */
		leading?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Combobox as Bits } from 'bits-ui';
	import { ChevronDown, Check, X } from '@lucide/svelte';
	import { cn } from '../../utils/index.js';
	import { getFieldContext } from '../field/context.js';

	let {
		items,
		value = $bindable(),
		multiple = false,
		placeholder = 'Search…',
		size = 'md',
		invalid,
		disabled,
		required,
		name,
		id: idProp,
		emptyText = 'No matches',
		filter,
		onValueChange,
		'aria-label': ariaLabel,
		leading,
		class: className
	}: ComboboxProps = $props();

	const field = getFieldContext();
	const own = $props.id();
	const id = $derived(idProp ?? field?.id ?? `db-combobox-${own}`);
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
	const isDisabled = $derived(disabled ?? field?.disabled ?? false);
	const isRequired = $derived(required ?? field?.required ?? false);

	const selectedValues = $derived(
		Array.isArray(value) ? value : value === undefined || value === '' ? [] : [value]
	);
	const selectedItems = $derived(
		selectedValues.map((v) => items.find((i) => i.value === v)).filter((i) => !!i)
	);
	const singleLabel = $derived(multiple ? '' : (selectedItems[0]?.label ?? ''));

	/** Text in the input; starts as the selected label so a preset value reads correctly. */
	let inputValue = $state(
		untrack(() => (multiple ? '' : (items.find((i) => i.value === value)?.label ?? '')))
	);
	let open = $state(false);

	const defaultFilter = (item: ComboboxItem, q: string) =>
		`${item.label} ${item.keywords ?? ''}`.toLowerCase().includes(q.toLowerCase());
	const match = $derived(filter ?? defaultFilter);

	// Filtering only applies to text the user typed, not the label we put there ourselves.
	const query = $derived(inputValue === singleLabel ? '' : inputValue.trim());
	const visible = $derived(query ? items.filter((i) => match(i, query)) : items);

	const groups = $derived.by(() => {
		const out: Array<[string | undefined, ComboboxItem[]]> = [];
		for (const item of visible) {
			const bucket = out.find(([g]) => g === item.group);
			if (bucket) bucket[1].push(item);
			else out.push([item.group, [item]]);
		}
		return out;
	});

	function onOpenChange(next: boolean) {
		open = next;
		// Closing restores the input to what is actually selected.
		if (!next) inputValue = singleLabel;
	}
	function handleValueChange(v: string | string[]) {
		onValueChange?.(v);
		// Bits mirrors the chosen label into the input for single; multiple clears for the next pick.
		if (multiple) inputValue = '';
		else inputValue = items.find((i) => i.value === v)?.label ?? '';
	}
	function remove(v: string) {
		if (!Array.isArray(value)) return;
		value = value.filter((x) => x !== v);
		onValueChange?.(value);
	}
</script>

{#snippet list()}
	{#each groups as [group, groupItems] (group ?? '')}
		{#if group}
			<Bits.Group>
				<Bits.GroupHeading class="db-combobox__group-label">{group}</Bits.GroupHeading>
				{#each groupItems as item (item.value)}
					{@render row(item)}
				{/each}
			</Bits.Group>
		{:else}
			{#each groupItems as item (item.value)}
				{@render row(item)}
			{/each}
		{/if}
	{:else}
		<div class="db-combobox__empty">{emptyText}</div>
	{/each}
{/snippet}

{#snippet row(item: ComboboxItem)}
	<Bits.Item
		class="db-combobox__item"
		value={item.value}
		label={item.label}
		disabled={item.disabled}
	>
		{#snippet children({ selected: isSelected })}
			<span class="db-combobox__item-label">{item.label}</span>
			{#if isSelected}<Check class="db-combobox__item-check" aria-hidden="true" />{/if}
		{/snippet}
	</Bits.Item>
{/snippet}

{#snippet control()}
	<div
		class={cn('db-combobox', className)}
		data-size={size}
		data-invalid={isInvalid || undefined}
		data-disabled={isDisabled || undefined}
		data-multiple={multiple || undefined}
		data-open={open || undefined}
	>
		{#if leading}<span class="db-combobox__adornment" aria-hidden="true">{@render leading()}</span
			>{/if}
		{#if multiple}
			{#each selectedItems as item (item.value)}
				<span class="db-combobox__chip">
					<span class="db-combobox__chip-label">{item.label}</span>
					<button
						type="button"
						class="db-combobox__chip-remove"
						aria-label="Remove {item.label}"
						disabled={isDisabled}
						tabindex={-1}
						onclick={() => remove(item.value)}
					>
						<X aria-hidden="true" />
					</button>
				</span>
			{/each}
		{/if}
		<Bits.Input
			{id}
			class="db-combobox__input"
			placeholder={multiple && selectedItems.length ? '' : placeholder}
			aria-label={ariaLabel}
			aria-invalid={isInvalid || undefined}
			aria-describedby={field?.describedBy}
			required={isRequired && selectedValues.length === 0}
			autocomplete="off"
			oninput={(e) => (inputValue = e.currentTarget.value)}
		/>
		<Bits.Trigger class="db-combobox__toggle" aria-label="Show options" tabindex={-1}>
			<ChevronDown aria-hidden="true" />
		</Bits.Trigger>
	</div>
	{#if name}
		{#if multiple}
			{#each selectedValues as v (v)}<input type="hidden" name="{name}[]" value={v} />{/each}
		{:else}
			<input type="hidden" {name} value={selectedValues[0] ?? ''} />
		{/if}
	{/if}
{/snippet}

{#snippet content()}
	<Bits.Portal>
		<Bits.Content class="db-combobox__content" sideOffset={6} collisionPadding={8}>
			<Bits.Viewport class="db-combobox__viewport">{@render list()}</Bits.Viewport>
		</Bits.Content>
	</Bits.Portal>
{/snippet}

{#if multiple}
	<Bits.Root
		type="multiple"
		bind:value={value as string[]}
		{inputValue}
		bind:open
		{onOpenChange}
		onValueChange={handleValueChange}
		disabled={isDisabled}
		{items}
	>
		{@render control()}
		{@render content()}
	</Bits.Root>
{:else}
	<Bits.Root
		type="single"
		bind:value={value as string}
		{inputValue}
		bind:open
		{onOpenChange}
		onValueChange={handleValueChange}
		disabled={isDisabled}
		allowDeselect={false}
		{items}
	>
		{@render control()}
		{@render content()}
	</Bits.Root>
{/if}

<style>
	.db-combobox {
		--_h: var(--control-h-md);
		--_px: var(--control-px-md);
		--_fs: var(--control-text-md);
		--_border: var(--color-border-strong);

		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-1);
		width: 100%;
		min-height: var(--_h);
		padding-inline: var(--_px) var(--space-1);
		background: var(--color-surface);
		border: var(--control-border-width) solid var(--_border);
		border-radius: var(--control-radius);
		color: var(--color-text);
		font-family: var(--font-body);
		font-size: var(--_fs);
		cursor: text;
		transition: var(--transition-colors);
	}
	.db-combobox:hover:not([data-disabled]) {
		--_border: var(--color-text-subtle);
	}
	.db-combobox:focus-within {
		--_border: var(--color-focus);
		box-shadow: var(--focus-ring);
	}
	.db-combobox[data-invalid] {
		--_border: var(--color-danger);
	}
	.db-combobox[data-disabled] {
		background: var(--color-bg-subtle);
		color: var(--color-text-disabled);
		cursor: not-allowed;
	}
	.db-combobox[data-size='sm'] {
		--_h: var(--control-h-sm);
		--_px: var(--control-px-sm);
		--_fs: var(--control-text-sm);
	}
	.db-combobox[data-size='lg'] {
		--_h: var(--control-h-lg);
		--_px: var(--control-px-lg);
		--_fs: var(--control-text-lg);
	}
	.db-combobox[data-multiple] {
		padding-block: var(--space-1);
	}
	.db-combobox :global(.db-combobox__input) {
		flex: 1;
		min-width: 4rem;
		height: calc(var(--_h) - var(--control-border-width) * 2);
		background: none;
		border: none;
		outline: none;
		color: inherit;
		font: inherit;
	}
	.db-combobox[data-multiple] :global(.db-combobox__input) {
		height: calc(var(--_h) - var(--space-2) - var(--control-border-width) * 2);
	}
	.db-combobox :global(.db-combobox__input::placeholder) {
		color: var(--color-text-subtle);
	}
	.db-combobox__adornment {
		display: inline-flex;
		flex: none;
		color: var(--color-text-subtle);
	}
	.db-combobox__adornment :global(svg),
	.db-combobox :global(.db-combobox__toggle svg) {
		width: 1.1em;
		height: 1.1em;
	}
	.db-combobox :global(.db-combobox__toggle) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: calc(var(--_h) - var(--space-2));
		height: calc(var(--_h) - var(--space-2));
		border-radius: var(--radius-sm);
		color: var(--color-text-subtle);
		transition: var(--transition-colors), var(--transition-transform);
	}
	.db-combobox :global(.db-combobox__toggle:hover) {
		background: var(--color-component);
		color: var(--color-text);
	}
	.db-combobox[data-open] :global(.db-combobox__toggle svg) {
		transform: rotate(180deg);
	}

	/* chips (multiple) */
	.db-combobox__chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-0-5);
		height: calc(var(--_h) - var(--space-3));
		padding-inline: var(--space-2) var(--space-0-5);
		border-radius: var(--radius-sm);
		background: var(--color-component);
		font-size: var(--text-sm);
		line-height: 1;
		white-space: nowrap;
	}
	.db-combobox__chip-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: var(--radius-xs);
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.db-combobox__chip-remove:hover:not(:disabled) {
		background: var(--color-component-hover);
		color: var(--color-text);
	}
	.db-combobox__chip-remove :global(svg) {
		width: 0.85em;
		height: 0.85em;
	}

	/* popup */
	:global(.db-combobox__content) {
		z-index: var(--z-popover);
		width: var(--bits-combobox-anchor-width);
		min-width: max(var(--bits-combobox-anchor-width), 12rem);
		max-height: var(--bits-combobox-content-available-height);
		padding: var(--space-1);
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		outline: none;
	}
	:global(.db-combobox__content[data-state='open']) {
		animation: db-pop-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-combobox__content[data-state='closed']) {
		animation: db-pop-out var(--duration-fast) var(--ease-accelerate);
	}
	:global(.db-combobox__viewport) {
		max-height: 18rem;
		overflow-y: auto;
	}
	:global(.db-combobox__group-label) {
		padding: var(--space-2) var(--space-2-5) var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}
	:global(.db-combobox__item) {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: var(--control-h-sm);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: var(--leading-snug);
		cursor: default;
		user-select: none;
		outline: none;
	}
	:global(.db-combobox__item[data-highlighted]) {
		background: var(--color-component);
	}
	:global(.db-combobox__item[data-selected]) {
		color: var(--color-accent-text);
		font-weight: var(--weight-medium);
	}
	:global(.db-combobox__item[data-disabled]) {
		color: var(--color-text-disabled);
		pointer-events: none;
	}
	:global(.db-combobox__item-label) {
		flex: 1;
		min-width: 0;
	}
	:global(.db-combobox__item-check) {
		width: 1em;
		height: 1em;
		flex: none;
	}
	:global(.db-combobox__empty) {
		padding: var(--space-3) var(--space-2-5);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
	}
</style>
