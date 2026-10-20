<script lang="ts">
	import RouteProgress from './RouteProgress.svelte';
	let { active = $bindable(false), delay = 0 }: { active?: boolean; delay?: number } = $props();
</script>

<RouteProgress {active} {delay} />
