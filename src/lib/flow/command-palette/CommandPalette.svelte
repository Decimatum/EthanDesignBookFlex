<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface Command {
		id: string;
		label: string;
		/** Secondary text after the label. */
		hint?: string;
		/** Shortcut string in Kbd syntax, e.g. `"mod+shift+p"` — display only. */
		shortcut?: string;
		/** Extra words the search matches. */
		keywords?: string[];
		/** Navigates (rendered as a link) instead of running `onSelect`. */
		href?: string;
		onSelect?: () => void;
		disabled?: boolean;
		icon?: Snippet;
	}

	export interface CommandGroup {
		heading: string;
		commands: Command[];
	}

	export interface CommandPaletteProps {
		/** Bindable. */
		open?: boolean;
		groups: CommandGroup[];
		placeholder?: string;
		/** Text shown when nothing matches. */
		emptyText?: string;
		/** Global shortcut that opens it; `null` disables. */
		shortcut?: string | null;
		/** Called after a command runs; the palette closes first. */
		onSelect?: (command: Command) => void;
		onOpenChange?: (open: boolean) => void;
		/** Accessible name of the dialog. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { Dialog, Command as Bits } from 'bits-ui';
	import { Search } from '@lucide/svelte';
	import Kbd from '../../components/kbd/Kbd.svelte';
	import { cn } from '../../utils/index.js';

	let {
		open = $bindable(false),
		groups,
		placeholder = 'Type a command or search…',
		emptyText = 'No results',
		shortcut = 'mod+k',
		onSelect,
		onOpenChange,
		label = 'Command palette',
		class: className
	}: CommandPaletteProps = $props();

	let search = $state('');

	function matchesShortcut(e: KeyboardEvent, combo: string) {
		const parts = combo.toLowerCase().split('+');
		const key = parts.pop();
		const need = new Set(parts);
		const mod = e.metaKey || e.ctrlKey;
		if (need.has('mod') && !mod) return false;
		if (need.has('shift') !== e.shiftKey) return false;
		if (need.has('alt') !== e.altKey) return false;
		if (!need.has('mod') && !need.has('ctrl') && !need.has('meta') && mod) return false;
		return e.key.toLowerCase() === key;
	}

	function onkeydown(e: KeyboardEvent) {
		if (!shortcut || !matchesShortcut(e, shortcut)) return;
		e.preventDefault();
		open = !open;
	}

	function handleOpenChange(next: boolean) {
		open = next;
		if (!next) search = '';
		onOpenChange?.(next);
	}

	function run(command: Command) {
		if (command.disabled) return;
		handleOpenChange(false);
		command.onSelect?.();
		onSelect?.(command);
	}
</script>

<svelte:window {onkeydown} />

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay class="db-command-palette__overlay" />
		<Dialog.Content class={cn('db-command-palette', className)} aria-label={label}>
			<Bits.Root class="db-command-palette__root" bind:value={search} loop label="Commands">
				<div class="db-command-palette__search">
					<Search class="db-command-palette__icon" aria-hidden="true" />
					<Bits.Input class="db-command-palette__input" {placeholder} autocomplete="off" />
					<Kbd size="sm">Esc</Kbd>
				</div>
				<Bits.List class="db-command-palette__list">
					<Bits.Viewport>
						<Bits.Empty class="db-command-palette__empty">{emptyText}</Bits.Empty>
						{#each groups as group (group.heading)}
							<Bits.Group class="db-command-palette__group" value={group.heading}>
								<Bits.GroupHeading class="db-command-palette__heading">
									{group.heading}
								</Bits.GroupHeading>
								<Bits.GroupItems>
									{#each group.commands as command (command.id)}
										{#if command.href}
											<Bits.LinkItem
												class="db-command-palette__item"
												value={command.id}
												keywords={[command.label, ...(command.keywords ?? [])]}
												disabled={command.disabled}
												href={command.href}
												onSelect={() => run(command)}
											>
												{@render row(command)}
											</Bits.LinkItem>
										{:else}
											<Bits.Item
												class="db-command-palette__item"
												value={command.id}
												keywords={[command.label, ...(command.keywords ?? [])]}
												disabled={command.disabled}
												onSelect={() => run(command)}
											>
												{@render row(command)}
											</Bits.Item>
										{/if}
									{/each}
								</Bits.GroupItems>
							</Bits.Group>
						{/each}
					</Bits.Viewport>
				</Bits.List>
			</Bits.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

{#snippet row(command: Command)}
	{#if command.icon}
		<span class="db-command-palette__item-icon" aria-hidden="true">{@render command.icon()}</span>
	{/if}
	<span class="db-command-palette__item-label">{command.label}</span>
	{#if command.hint}<span class="db-command-palette__item-hint">{command.hint}</span>{/if}
	{#if command.shortcut}<Kbd keys={command.shortcut} size="sm" />{/if}
{/snippet}

<style>
	:global(.db-command-palette__overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-overlay);
		background: oklch(0% 0 0 / 0.45);
		backdrop-filter: blur(2px);
	}
	:global(.db-command-palette__overlay[data-state='open']) {
		animation: db-fade-in var(--duration-base) var(--ease-standard);
	}
	:global(.db-command-palette__overlay[data-state='closed']) {
		animation: db-fade-out var(--duration-fast) var(--ease-standard);
	}

	:global(.db-command-palette) {
		position: fixed;
		inset-inline: 0;
		top: min(15vh, 8rem);
		z-index: var(--z-modal);
		width: min(36rem, calc(100vw - var(--space-8)));
		margin-inline: auto;
		max-height: min(70vh, 32rem);
		display: flex;
		flex-direction: column;
		background: var(--color-surface-overlay);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-overlay);
		outline: none;
		overflow: hidden;
		font-family: var(--font-body);
	}
	:global(.db-command-palette[data-state='open']) {
		animation: db-dialog-in var(--duration-base) var(--ease-decelerate);
	}
	:global(.db-command-palette[data-state='closed']) {
		animation: db-dialog-out var(--duration-fast) var(--ease-accelerate);
	}
	:global(.db-command-palette__root) {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	.db-command-palette__search {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}
	:global(.db-command-palette__icon) {
		width: 1.1em;
		height: 1.1em;
		flex: none;
		color: var(--color-text-subtle);
	}
	:global(.db-command-palette__input) {
		flex: 1;
		min-width: 0;
		height: var(--control-h-md);
		background: none;
		border: none;
		outline: none;
		color: var(--color-text);
		font: inherit;
		font-size: var(--text-md);
	}
	:global(.db-command-palette__input:focus-visible) {
		box-shadow: none; /* the dialog itself is the focus target; no ring inside the search row */
	}
	:global(.db-command-palette__input::placeholder) {
		color: var(--color-text-subtle);
	}
	:global(.db-command-palette__list) {
		overflow-y: auto;
		padding: var(--space-1);
		overscroll-behavior: contain;
	}
	:global(.db-command-palette__empty) {
		padding: var(--space-6) var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	:global(.db-command-palette__heading) {
		padding: var(--space-2) var(--space-2-5) var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}
	:global(.db-command-palette__item) {
		display: flex;
		align-items: center;
		gap: var(--space-2-5);
		min-height: var(--control-h-md);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-size: var(--text-sm);
		text-decoration: none;
		cursor: default;
		user-select: none;
		outline: none;
	}
	:global(.db-command-palette__item[data-selected]) {
		background: var(--color-component);
	}
	:global(.db-command-palette__item[data-disabled]) {
		color: var(--color-text-disabled);
		pointer-events: none;
	}
	.db-command-palette__item-icon {
		display: inline-flex;
		flex: none;
		width: 1.1em;
		height: 1.1em;
		color: var(--color-text-muted);
	}
	.db-command-palette__item-icon :global(svg) {
		width: 100%;
		height: 100%;
	}
	.db-command-palette__item-label {
		flex: none;
	}
	.db-command-palette__item-hint {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-text-subtle);
	}
	.db-command-palette__item-label + :global(.db-kbd-group),
	.db-command-palette__item-hint + :global(.db-kbd-group) {
		margin-inline-start: auto;
	}
</style>
