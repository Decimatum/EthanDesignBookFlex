<script lang="ts">
	import { Button, type ButtonVariant, type ButtonTone, type ButtonSize } from '$lib/index.js';
	import { Plus, ArrowRight, Trash2, Settings } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	const variants: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link'];
	const tones: ButtonTone[] = ['accent', 'neutral', 'danger'];
	const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

	let loading = $state(false);
	function simulate() {
		loading = true;
		setTimeout(() => (loading = false), 1500);
	}
</script>

<h1>Button</h1>
<p class="lead">
	The primary action control. Five variants, three tones, three sizes; renders a link when given
	<code>href</code>.
</p>

<Demo
	title="Variants"
	code={`<Button>Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
>
	{#each variants as variant (variant)}
		<Button {variant}>{variant}</Button>
	{/each}
</Demo>

<Demo title="Tones × variants" stack>
	<table class="matrix">
		<thead>
			<tr>
				<th scope="col"><span class="sr-only">Tone</span></th>
				{#each variants as variant (variant)}<th scope="col">{variant}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#each tones as tone (tone)}
				<tr>
					<th scope="row">{tone}</th>
					{#each variants as variant (variant)}
						<td><Button {tone} {variant}>Button</Button></td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</Demo>

<Demo
	title="Sizes"
	code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
>
	{#each sizes as size (size)}
		<Button {size}>{size}</Button>
	{/each}
</Demo>

<Demo
	title="With icons"
	code={`<Button>
	{#snippet leading()}<Plus />{/snippet}
	New item
</Button>
<Button variant="soft" tone="neutral">
	Continue
	{#snippet trailing()}<ArrowRight />{/snippet}
</Button>
<Button iconOnly aria-label="Settings" variant="ghost" tone="neutral">
	{#snippet leading()}<Settings />{/snippet}
</Button>`}
>
	<Button>
		{#snippet leading()}<Plus />{/snippet}
		New item
	</Button>
	<Button variant="soft" tone="neutral">
		Continue
		{#snippet trailing()}<ArrowRight />{/snippet}
	</Button>
	<Button variant="outline" tone="danger">
		{#snippet leading()}<Trash2 />{/snippet}
		Delete
	</Button>
	<Button iconOnly aria-label="Settings" variant="ghost" tone="neutral">
		{#snippet leading()}<Settings />{/snippet}
	</Button>
	<Button iconOnly aria-label="Add" size="sm">
		{#snippet leading()}<Plus />{/snippet}
	</Button>
</Demo>

<Demo
	title="States"
	code={`<Button disabled>Disabled</Button>
<Button loading>Saving…</Button>
<Button loading={loading} onclick={simulate}>Click to load</Button>`}
>
	<Button disabled>Disabled</Button>
	<Button variant="outline" disabled>Disabled</Button>
	<Button loading>Saving…</Button>
	<Button {loading} onclick={simulate} variant="soft" tone="neutral">
		{#snippet leading()}<Plus />{/snippet}
		Click to load
	</Button>
</Demo>

<Demo
	title="As a link"
	code={`<Button href="/">Home</Button>
<Button href="/" variant="link">Back to overview</Button>
<Button href="/" disabled>Unavailable</Button>`}
>
	<Button href="/">Home</Button>
	<Button href="/" variant="link">Back to overview</Button>
	<Button href="/" disabled>Unavailable</Button>
</Demo>

<Demo title="Block" stack code="<Button block>Continue to payment</Button>">
	<Button block>Continue to payment</Button>
	<Button block variant="outline" tone="neutral">Cancel</Button>
</Demo>

<PropsTable
	rows={[
		{
			name: 'variant',
			type: "'solid' | 'soft' | 'outline' | 'ghost' | 'link'",
			default: "'solid'",
			description: 'Visual weight.'
		},
		{
			name: 'tone',
			type: "'accent' | 'neutral' | 'danger'",
			default: "'accent'",
			description: 'Colour intent.'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Follows the density axis.'
		},
		{
			name: 'type',
			type: "'button' | 'submit' | 'reset'",
			default: "'button'",
			description: 'Native type.'
		},
		{ name: 'href', type: 'string', description: 'Render as <a>.' },
		{ name: 'disabled', type: 'boolean', default: 'false' },
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Spinner + aria-busy + disabled.'
		},
		{ name: 'block', type: 'boolean', default: 'false', description: 'Full width.' },
		{
			name: 'iconOnly',
			type: 'boolean',
			default: 'false',
			description: 'Square; requires aria-label.'
		}
	]}
/>
<p>
	Snippets: <code>children</code>, <code>leading</code>, <code>trailing</code>. Everything else is
	forwarded to the root element.
</p>

<style>
	.matrix th {
		font-size: var(--text-xs);
		text-transform: capitalize;
		color: var(--color-text-subtle);
		border: none;
	}
	.matrix td {
		border: none;
	}
</style>
