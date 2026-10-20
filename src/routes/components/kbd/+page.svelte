<script lang="ts">
	import { Kbd, Text, Inline } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Kbd</h1>
<p class="lead">Keycaps for shortcuts, with platform-aware modifier glyphs.</p>

<Demo
	title="Shortcuts"
	code={`<Kbd keys="mod+k" />
<Kbd keys="shift+enter" />
<Kbd keys="ctrl+alt+delete" size="sm" />`}
>
	<Kbd keys="mod+k" />
	<Kbd keys="shift+enter" />
	<Kbd keys="alt+up" />
	<Kbd keys="ctrl+alt+delete" size="sm" />
</Demo>

<Demo title="Single keys in prose" code={`Press <Kbd>Esc</Kbd> to close, <Kbd>?</Kbd> for help.`}>
	<Text>
		Press <Kbd>Esc</Kbd> to close the ticket, <Kbd>?</Kbd> for help, or <Kbd keys="mod+enter" /> to submit
		the order.
	</Text>
</Demo>

<Demo
	title="In a menu-like list"
	stack
	code={`<Inline justify="between">Search <Kbd keys="mod+k" /></Inline>`}
>
	{#each [['Search', 'mod+k'], ['New order', 'n'], ['Toggle theme', 'mod+shift+l'], ['Command palette', 'mod+p']] as [label, keys] (label)}
		<Inline justify="between" style="max-width: 20rem; width: 100%">
			<Text size="sm">{label}</Text>
			<Kbd {keys} size="sm" />
		</Inline>
	{/each}
</Demo>

<PropsTable
	rows={[
		{ name: 'keys', type: 'string', description: '"+"-separated shortcut string.' },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'children', type: 'Snippet', description: 'A single key when keys is omitted.' }
	]}
/>
