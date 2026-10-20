<script lang="ts">
	import { untrack } from 'svelte';
	import Pagination from './Pagination.svelte';
	let {
		pages,
		count,
		perPage,
		siblings,
		initial = 1,
		onPageChange
	}: {
		pages?: number;
		count?: number;
		perPage?: number;
		siblings?: number;
		initial?: number;
		onPageChange?: (p: number) => void;
	} = $props();
	let page = $state(untrack(() => initial));
</script>

<Pagination bind:page {pages} {count} {perPage} {siblings} {onPageChange} />
<span data-testid="page">{page}</span>
