<script lang="ts">
	import PageTransition from './PageTransition.svelte';
	let { route = $bindable('a') }: { route?: string } = $props();
</script>

<PageTransition key={route} kind="slide" duration={50}>
	<p data-testid="page">Page {route}</p>
</PageTransition>
