<script lang="ts">
	import { CommandPalette, Button, Kbd, Text, toast, theme } from '$lib/index.js';
	import { LayoutDashboard, ListOrdered, Plus, SunMoon, Settings } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	let open = $state(false);
	let last = $state('');
	const groups = [
		{
			heading: 'Navigate',
			commands: [
				{
					id: 'dash',
					label: 'Dashboard',
					href: '/flow/command-palette/',
					shortcut: 'g+d',
					icon: dash
				},
				{
					id: 'orders',
					label: 'Orders',
					href: '/flow/command-palette/',
					keywords: ['trades', 'fills'],
					icon: orders
				},
				{ id: 'settings', label: 'Settings', href: '/flow/command-palette/', icon: settings }
			]
		},
		{
			heading: 'Actions',
			commands: [
				{
					id: 'new',
					label: 'New order',
					hint: 'Open the order ticket',
					shortcut: 'n',
					icon: plus,
					onSelect: () => toast('Order ticket opened')
				},
				{
					id: 'theme',
					label: 'Toggle dark mode',
					shortcut: 'mod+shift+l',
					icon: sunMoon,
					onSelect: () => theme.toggleScheme()
				},
				{
					id: 'export',
					label: 'Export statement',
					hint: 'Not available on this plan',
					disabled: true
				}
			]
		}
	];
</script>

{#snippet dash()}<LayoutDashboard />{/snippet}
{#snippet orders()}<ListOrdered />{/snippet}
{#snippet settings()}<Settings />{/snippet}
{#snippet plus()}<Plus />{/snippet}
{#snippet sunMoon()}<SunMoon />{/snippet}

<h1>Command palette</h1>
<p class="lead">One shortcut to everything: search, navigate and act from the keyboard.</p>

<Demo
	title="Try it"
	stack
	code={`<CommandPalette bind:open {groups} onSelect={(c) => track(c.id)} />
<Button onclick={() => (open = true)}>Search <Kbd keys="mod+k" /></Button>`}
>
	<div style="display:flex; align-items:center; gap: var(--space-3); flex-wrap: wrap">
		<Button variant="outline" tone="neutral" onclick={() => (open = true)}>
			Search&nbsp;&nbsp;<Kbd keys="mod+k" size="sm" />
		</Button>
		<Text size="sm" tone="muted">
			…or press <Kbd keys="mod+k" size="sm" /> anywhere on this page.
			{#if last}Last run: <code>{last}</code>.{/if}
		</Text>
	</div>
	<CommandPalette bind:open {groups} onSelect={(c) => (last = c.id)} />
</Demo>

<PropsTable
	rows={[
		{ name: 'open', type: 'boolean', default: 'false', description: 'Bindable.' },
		{ name: 'groups', type: 'CommandGroup[]', description: 'Required: { heading, commands }.' },
		{ name: 'placeholder', type: 'string', default: "'Type a command or search…'" },
		{ name: 'emptyText', type: 'string', default: "'No results'" },
		{ name: 'shortcut', type: 'string | null', default: "'mod+k'" },
		{ name: 'onSelect', type: '(command) => void' },
		{ name: 'onOpenChange', type: '(open) => void' },
		{ name: 'label', type: 'string', default: "'Command palette'" }
	]}
/>
<PropsTable
	title="Command"
	rows={[
		{ name: 'id / label', type: 'string', description: 'Required.' },
		{ name: 'hint', type: 'string' },
		{ name: 'shortcut', type: 'string', description: 'Kbd syntax, display only.' },
		{ name: 'keywords', type: 'string[]' },
		{ name: 'href', type: 'string', description: 'Renders a link.' },
		{ name: 'onSelect', type: '() => void' },
		{ name: 'disabled', type: 'boolean' },
		{ name: 'icon', type: 'Snippet' }
	]}
/>
