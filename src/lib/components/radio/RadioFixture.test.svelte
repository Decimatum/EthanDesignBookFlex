<!-- Test fixture: a RadioGroup with three options and a change spy. -->
<script lang="ts">
	import RadioGroup from './RadioGroup.svelte';
	import Radio from './Radio.svelte';
	let {
		value = $bindable('b'),
		onValueChange,
		disabled = false,
		error,
		orientation = 'vertical'
	}: {
		value?: string;
		onValueChange?: (v: string) => void;
		disabled?: boolean;
		error?: string;
		orientation?: 'vertical' | 'horizontal';
	} = $props();
</script>

<RadioGroup
	label="Plan"
	bind:value
	{onValueChange}
	{disabled}
	{error}
	{orientation}
	hint="Pick one"
>
	<Radio value="a">Basic</Radio>
	<Radio value="b" description="Most popular">Pro</Radio>
	<Radio value="c">Team</Radio>
</RadioGroup>
