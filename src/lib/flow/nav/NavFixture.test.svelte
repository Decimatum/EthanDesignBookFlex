<script lang="ts">
	import Nav from './Nav.svelte';
	import NavSection from './NavSection.svelte';
	import NavItem from './NavItem.svelte';
	import AppShell from '../app-shell/AppShell.svelte';
	let {
		current = '/orders/',
		inShell = false,
		collapsed = false,
		orientation,
		navigation = 'sidebar'
	}: {
		current?: string;
		inShell?: boolean;
		collapsed?: boolean;
		orientation?: 'vertical' | 'horizontal';
		navigation?: 'sidebar' | 'top';
	} = $props();
	let open = $state(true);
</script>

{#snippet menu()}
	<Nav {current} {orientation}>
		<NavSection title="Main">
			<NavItem href="/" exact>Home</NavItem>
			<NavItem href="/orders" badge={3} badgeTone="accent">Orders</NavItem>
			<NavItem href="/orders/new" exact>New order</NavItem>
		</NavSection>
		<NavSection title="More" collapsible bind:open>
			<NavItem href="/settings">Settings</NavItem>
			<NavItem disabled>Reports</NavItem>
			<NavItem onclick={() => {}}>Sign out</NavItem>
		</NavSection>
	</Nav>
{/snippet}

{#if inShell}
	<AppShell {collapsed} {navigation} embedded mainId="m" style="--db-app-shell-min-height: 30rem">
		{#snippet sidebar()}{@render menu()}{/snippet}
		<p>Body</p>
	</AppShell>
{:else}
	{@render menu()}
{/if}
<span data-testid="open">{open ? 'open' : 'closed'}</span>
