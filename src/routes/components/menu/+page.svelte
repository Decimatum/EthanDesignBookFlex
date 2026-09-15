<script lang="ts">
	import {
		Menu,
		MenuItem,
		MenuGroup,
		MenuSeparator,
		MenuCheckboxItem,
		Button,
		Inline,
		Text
	} from '$lib/index.js';
	import { MoreHorizontal, Pencil, Download, Trash2, Copy, ChevronDown } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let last = $state('—');
	let showHidden = $state(false);
	let wrap = $state(true);
</script>

<h1>Menu</h1>
<p class="lead">A dropdown of actions with full keyboard support.</p>

<Demo
	title="Actions menu"
	code={`<Menu>
	{#snippet trigger(props)}
		<Button {...props} iconOnly aria-label="More actions" variant="ghost" tone="neutral">
			{#snippet leading()}<MoreHorizontal />{/snippet}
		</Button>
	{/snippet}
	<MenuGroup label="File">
		<MenuItem onSelect={rename} shortcut="⌘R">{#snippet leading()}<Pencil />{/snippet}Rename</MenuItem>
		<MenuItem href="/export">{#snippet leading()}<Download />{/snippet}Download</MenuItem>
	</MenuGroup>
	<MenuSeparator />
	<MenuItem tone="danger" onSelect={remove}>{#snippet leading()}<Trash2 />{/snippet}Delete</MenuItem>
</Menu>`}
>
	<Inline gap="4">
		<Menu>
			{#snippet trigger(props)}
				<Button {...props} iconOnly aria-label="More actions" variant="ghost" tone="neutral">
					{#snippet leading()}<MoreHorizontal />{/snippet}
				</Button>
			{/snippet}
			<MenuGroup label="File">
				<MenuItem onSelect={() => (last = 'Rename')} shortcut="⌘R"
					>{#snippet leading()}<Pencil />{/snippet}Rename</MenuItem
				>
				<MenuItem onSelect={() => (last = 'Duplicate')} shortcut="⌘D"
					>{#snippet leading()}<Copy />{/snippet}Duplicate</MenuItem
				>
				<MenuItem href="/">{#snippet leading()}<Download />{/snippet}Download</MenuItem>
				<MenuItem disabled>Move to…</MenuItem>
			</MenuGroup>
			<MenuSeparator />
			<MenuItem tone="danger" onSelect={() => (last = 'Delete')}
				>{#snippet leading()}<Trash2 />{/snippet}Delete</MenuItem
			>
		</Menu>
		<Text size="sm" tone="muted">Last action: {last}</Text>
	</Inline>
</Demo>

<Demo
	title="Checkbox items"
	code={`<MenuCheckboxItem bind:checked={showHidden}>Show hidden files</MenuCheckboxItem>`}
>
	<Inline gap="4">
		<Menu align="start">
			{#snippet trigger(props)}
				<Button {...props} variant="outline" tone="neutral">
					View
					{#snippet trailing()}<ChevronDown />{/snippet}
				</Button>
			{/snippet}
			<MenuCheckboxItem bind:checked={showHidden}>Show hidden files</MenuCheckboxItem>
			<MenuCheckboxItem bind:checked={wrap}>Wrap long lines</MenuCheckboxItem>
		</Menu>
		<Text size="sm" tone="muted"
			>hidden: {showHidden ? 'on' : 'off'} · wrap: {wrap ? 'on' : 'off'}</Text
		>
	</Inline>
</Demo>

<PropsTable
	title="Menu props"
	rows={[
		{ name: 'open', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'" },
		{ name: 'align', type: "'start' | 'center' | 'end'", default: "'start'" },
		{ name: 'minWidth', type: 'string', default: "'12rem'" },
		{ name: 'onOpenChange', type: '(open: boolean) => void' }
	]}
/>
<PropsTable
	title="MenuItem props"
	rows={[
		{ name: 'onSelect', type: '() => void' },
		{ name: 'href', type: 'string', description: 'Render as a link.' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'tone', type: "'default' | 'danger'", default: "'default'" },
		{ name: 'shortcut', type: 'string', description: 'Display-only hint.' },
		{ name: 'keepOpen', type: 'boolean', default: 'false' }
	]}
/>
<PropsTable
	title="MenuCheckboxItem props"
	rows={[
		{ name: 'checked', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'onCheckedChange', type: '(checked: boolean) => void' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{ name: 'keepOpen', type: 'boolean', default: 'true' }
	]}
/>
<p>
	<code>MenuGroup</code> takes an optional <code>label</code>; <code>MenuSeparator</code> has no props.
</p>
