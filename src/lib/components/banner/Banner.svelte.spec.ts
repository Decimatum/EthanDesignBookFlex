import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Banner from './Banner.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('Banner', () => {
	it('renders title and message with a status role by default', async () => {
		const screen = render(Banner, { title: 'Heads up', children: text('Two unsent captures.') });
		const el = screen.getByRole('status');
		await expect.element(el).toBeVisible();
		await expect.element(el).toHaveAttribute('data-tone', 'info');
		await expect.element(screen.getByText('Heads up')).toBeVisible();
	});

	it('uses role=alert for warning and danger', async () => {
		const screen = render(Banner, { tone: 'danger', children: text('Backup failed') });
		await expect.element(screen.getByRole('alert')).toHaveAttribute('data-tone', 'danger');
	});

	it('dismisses itself and reports it', async () => {
		const onDismiss = vi.fn();
		const screen = render(Banner, { dismissible: true, onDismiss, children: text('Bye') });
		await screen.getByRole('button', { name: 'Dismiss' }).click();
		expect(onDismiss).toHaveBeenCalledTimes(1);
		await expect.element(screen.getByText('Bye')).not.toBeInTheDocument();
	});
});
