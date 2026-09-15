<script lang="ts">
	import { Inline, Badge, Button, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Inline</h1>
<p class="lead">Horizontal flex layout that wraps by default.</p>

<Demo
	title="Wrapping row"
	stack
	code={`<Inline gap="2">
	<Badge>Design</Badge>
	<Badge>Svelte</Badge>
	…
</Inline>`}
>
	<Inline gap="2">
		{#each ['Design', 'Svelte', 'Tokens', 'Themes', 'Density', 'Accessibility', 'Testing', 'Docs'] as t (t)}
			<Badge>{t}</Badge>
		{/each}
	</Inline>
</Demo>

<Demo
	title="Space between"
	stack
	code={`<Inline justify="between" wrap={false}>
	<Text weight="semibold">Team members</Text>
	<Button size="sm">Invite</Button>
</Inline>`}
>
	<Inline justify="between" wrap={false}>
		<Text weight="semibold">Team members</Text>
		<Button size="sm">Invite</Button>
	</Inline>
</Demo>

<PropsTable
	rows={[
		{
			name: 'as',
			type: "'div' | 'span' | 'nav' | 'ul' | 'ol' | 'header' | 'footer'",
			default: "'div'"
		},
		{ name: 'gap', type: 'Space', default: "'3'" },
		{ name: 'align', type: 'Align', default: "'center'" },
		{ name: 'justify', type: 'Justify' },
		{ name: 'wrap', type: 'boolean', default: 'true' }
	]}
/>
