import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Alert from './Alert.svelte';

const body = createRawSnippet(() => ({
	render: () => '<p>Your session expires in 5 minutes.</p>'
}));

describe('Alert', () => {
	it('renders info as a status with title, body and icon', async () => {
		const screen = render(Alert, { title: 'Heads up', children: body });
		const el = screen.getByRole('status');
		await expect.element(el).toBeVisible();
		await expect.element(el).toHaveTextContent('Heads up');
		expect(screen.container.querySelector('.db-alert')).toHaveAttribute('data-tone', 'info');
		expect(screen.container.querySelector('.db-alert__icon svg')).not.toBeNull();
	});

	it('uses role=alert for danger and warning', () => {
		const a = render(Alert, { tone: 'danger', children: body });
		expect(a.container.querySelector('.db-alert')).toHaveAttribute('role', 'alert');
	});

	it('can be dismissed and hides its icon on request', async () => {
		const onDismiss = vi.fn();
		const screen = render(Alert, { dismissible: true, onDismiss, icon: null, children: body });
		expect(screen.container.querySelector('.db-alert__icon')).toBeNull();
		await screen.getByRole('button', { name: 'Dismiss' }).click();
		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(screen.container.querySelector('.db-alert')).toBeNull();
	});
});
