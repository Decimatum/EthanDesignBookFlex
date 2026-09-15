<script lang="ts">
	import { Spinner, Button } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>Spinner</h1>
<p class="lead">
	Indeterminate loading indicator. Inherits <code>currentColor</code> and scales with font size.
</p>

<Demo
	title="Sizes"
	code={`<Spinner />
<Spinner size="1.5rem" />
<Spinner size="2.5rem" />`}
>
	<Spinner />
	<Spinner size="1.5rem" />
	<Spinner size="2.5rem" />
</Demo>

<Demo
	title="Inherits colour"
	code="<span style=&quot;color: var(--color-accent)&quot;><Spinner size=&quot;2rem&quot; /></span>"
>
	<span style="color: var(--color-accent)"><Spinner size="2rem" /></span>
	<span style="color: var(--color-danger)"><Spinner size="2rem" /></span>
	<span style="color: var(--color-text-muted)"><Spinner size="2rem" /></span>
</Demo>

<Demo title="Inside a button" code="<Button loading>Saving…</Button>">
	<Button loading>Saving…</Button>
	<Button loading variant="outline" tone="neutral">Loading</Button>
</Demo>

<PropsTable
	rows={[
		{ name: 'size', type: 'string', default: "'1em'", description: 'Any CSS length.' },
		{
			name: 'label',
			type: 'string | null',
			default: "'Loading'",
			description: 'Accessible name; null hides it from assistive tech.'
		}
	]}
/>
