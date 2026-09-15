<script lang="ts">
	export interface PropRow {
		name: string;
		type: string;
		default?: string;
		description?: string;
	}
	let { rows, title = 'Props' }: { rows: PropRow[]; title?: string } = $props();
</script>

<h2>{title}</h2>
<table>
	<thead>
		<tr
			><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col"
				>Description</th
			></tr
		>
	</thead>
	<tbody>
		{#each rows as row (row.name)}
			<tr>
				<td><code>{row.name}</code></td>
				<td><code>{row.type}</code></td>
				<td
					>{#if row.default}<code>{row.default}</code>{:else}—{/if}</td
				>
				<td>{row.description ?? ''}</td>
			</tr>
		{/each}
	</tbody>
</table>
