<script lang="ts">
	import { Badge, Inline, type Tone } from '$lib/index.js';
	import { Check } from '@lucide/svelte';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
	const tones: Tone[] = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];
</script>

<h1>Badge</h1>
<p class="lead">Small status label with three variants and six tones.</p>

{#each ['soft', 'solid', 'outline'] as variant (variant)}
	<Demo title={variant} code={`<Badge variant="${variant}" tone="success">Live</Badge>`}>
		{#each tones as tone (tone)}
			<Badge variant={variant as 'soft'} {tone}>{tone}</Badge>
		{/each}
	</Demo>
{/each}

<Demo
	title="Dot, pill, icon, size"
	code={`<Badge tone="success" dot>Live</Badge>
<Badge pill tone="accent">Beta</Badge>
<Badge size="sm">v2.1</Badge>
<Badge tone="info">{#snippet leading()}<Check />{/snippet}Verified</Badge>`}
>
	<Inline gap="2">
		<Badge tone="success" dot>Live</Badge>
		<Badge tone="warning" dot variant="outline">Degraded</Badge>
		<Badge pill tone="accent">Beta</Badge>
		<Badge size="sm">v2.1</Badge>
		<Badge tone="info">{#snippet leading()}<Check />{/snippet}Verified</Badge>
	</Inline>
</Demo>

<PropsTable
	rows={[
		{ name: 'variant', type: "'soft' | 'solid' | 'outline'", default: "'soft'" },
		{ name: 'tone', type: 'Tone', default: "'neutral'" },
		{ name: 'size', type: "'sm' | 'md'", default: "'md'" },
		{ name: 'dot', type: 'boolean', default: 'false' },
		{ name: 'pill', type: 'boolean', default: 'false' }
	]}
/>
