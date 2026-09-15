<script lang="ts">
	import { DropdownMenu as Bits } from 'bits-ui';
</script>

<Bits.Separator class="db-menu-separator" />

<style>
	:global(.db-menu-separator) {
		height: 1px;
		margin: var(--space-1) calc(var(--space-1) * -1);
		background: var(--color-border);
	}
</style>
