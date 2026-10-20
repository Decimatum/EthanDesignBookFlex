<script lang="ts">
	import AppShell from './AppShell.svelte';
	let open = $state(false);
	let collapsed = $state(false);
</script>

<AppShell
	bind:sidebarOpen={open}
	bind:collapsed
	mainId="content"
	sidebarLabel="Site"
	style="--db-app-shell-min-height: 20rem"
>
	{#snippet brand({ collapsed })}<strong>{collapsed ? 'B' : 'Brand'}</strong>{/snippet}
	{#snippet header({ toggle, sidebarOpen })}
		<button type="button" onclick={toggle} data-testid="custom-toggle"
			>{sidebarOpen ? 'shut' : 'open'}</button
		>
	{/snippet}
	{#snippet sidebar({ close })}
		<a href="/">Home</a>
		<button type="button" onclick={close}>Close nav</button>
	{/snippet}
	{#snippet aside()}<p>Aside</p>{/snippet}
	{#snippet footer()}<p>Footer</p>{/snippet}
	<p>Body</p>
</AppShell>
<span data-testid="state">{open ? 'open' : 'closed'}</span>
<span data-testid="collapsed">{collapsed ? 'rail' : 'full'}</span>
