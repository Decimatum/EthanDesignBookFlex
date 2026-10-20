<!--
  Internal: renders the shell's navigation snippet under a context that tells Nav components where
  they are (top bar vs sidebar) and whether the sidebar is collapsed. The same snippet is rendered
  once per placement, so each copy orients itself correctly.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAppShellContext } from './context.js';

	let {
		placement,
		collapsed = false,
		children
	}: { placement: 'sidebar' | 'topbar'; collapsed?: boolean; children: Snippet } = $props();

	setAppShellContext({
		get collapsed() {
			return collapsed;
		},
		get placement() {
			return placement;
		}
	});
</script>

{@render children()}
