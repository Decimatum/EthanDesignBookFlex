<script lang="ts">
	import { toast, Button, Inline, Text } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';

	let n = 0;
	const fakeSave = () =>
		new Promise<string>((resolve, reject) =>
			setTimeout(
				() => (Math.random() > 0.3 ? resolve('42 rows') : reject(new Error('timeout'))),
				1200
			)
		);
</script>

<h1>Toast</h1>
<p class="lead">
	Transient notifications. The docs site already renders a <code>&lt;Toaster /&gt;</code> in its layout,
	so the buttons below work.
</p>

<Demo
	title="Tones"
	code={`toast('Saved');
toast.success('Order filled', { description: '100 AAPL @ 189.20' });
toast.warning('Margin call at 92%');
toast.danger('Failed to save', { duration: 0 });`}
>
	<Inline gap="2">
		<Button variant="soft" tone="neutral" onclick={() => toast(`Saved (${++n})`)}>Neutral</Button>
		<Button variant="soft" tone="neutral" onclick={() => toast.info('Market opens in 10 minutes')}
			>Info</Button
		>
		<Button
			variant="soft"
			tone="neutral"
			onclick={() => toast.success('Order filled', { description: '100 AAPL @ 189.20' })}
			>Success</Button
		>
		<Button variant="soft" tone="neutral" onclick={() => toast.warning('Margin utilisation at 92%')}
			>Warning</Button
		>
		<Button
			variant="soft"
			tone="neutral"
			onclick={() => toast.danger('Failed to save', { duration: 0 })}>Danger (sticky)</Button
		>
	</Inline>
</Demo>

<Demo
	title="Action, update in place, promise"
	code={`toast('Message deleted', { action: { label: 'Undo', onClick: restore } });

const id = toast('Uploading…', { duration: 0, dismissible: false });
toast.success('Uploaded', { id });

toast.promise(save(), { loading: 'Saving…', success: (v) => \`Saved \${v}\`, error: 'Save failed' });`}
>
	<Inline gap="2">
		<Button
			variant="outline"
			tone="neutral"
			onclick={() =>
				toast('Message deleted', {
					action: { label: 'Undo', onClick: () => toast.success('Restored') }
				})}>With action</Button
		>
		<Button
			variant="outline"
			tone="neutral"
			onclick={() => {
				const id = toast('Uploading…', { duration: 0, dismissible: false });
				setTimeout(() => toast.success('Uploaded 3 files', { id }), 1500);
			}}
		>
			Update in place
		</Button>
		<Button
			variant="outline"
			tone="neutral"
			onclick={() =>
				toast
					.promise(fakeSave(), {
						loading: 'Saving…',
						success: (v) => `Saved ${v}`,
						error: (e) => `Save failed: ${(e as Error).message}`
					})
					.catch(() => {})}
		>
			Promise (70% success)
		</Button>
		<Button variant="ghost" tone="neutral" onclick={() => toast.clear()}>Clear all</Button>
	</Inline>
</Demo>

<Text size="sm" tone="muted">Hover or focus a toast to pause its timer.</Text>

<PropsTable
	title="toast() options"
	rows={[
		{
			name: 'tone',
			type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
			default: "'neutral'"
		},
		{ name: 'description', type: 'string' },
		{ name: 'duration', type: 'number', default: '5000', description: '0 = sticky.' },
		{ name: 'action', type: '{ label, onClick }' },
		{ name: 'id', type: 'string', default: 'generated', description: 'Reuse to update.' },
		{ name: 'dismissible', type: 'boolean', default: 'true' }
	]}
/>
<PropsTable
	title="Toaster props"
	rows={[
		{
			name: 'position',
			type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
			default: "'bottom-right'"
		}
	]}
/>
