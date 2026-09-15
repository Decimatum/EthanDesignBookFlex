<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabList from './TabList.svelte';
	import Tab from './Tab.svelte';
	import TabPanel from './TabPanel.svelte';
	let {
		activation = 'automatic',
		onValueChange
	}: { activation?: 'automatic' | 'manual'; onValueChange?: (v: string) => void } = $props();
	let value = $state('positions');
</script>

<Tabs bind:value {activation} {onValueChange}>
	<TabList label="Portfolio sections">
		<Tab value="positions" badge={12}>Positions</Tab>
		<Tab value="orders">Orders</Tab>
		<Tab value="history" disabled>History</Tab>
	</TabList>
	<TabPanel value="positions">Positions panel</TabPanel>
	<TabPanel value="orders">Orders panel</TabPanel>
	<TabPanel value="history">History panel</TabPanel>
</Tabs>
<span data-testid="value">{value}</span>
