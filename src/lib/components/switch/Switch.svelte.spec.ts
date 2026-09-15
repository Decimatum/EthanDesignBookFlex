import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Switch from './Switch.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Notifications</span>' }));

describe('Switch', () => {
	it('renders a labelled switch and toggles', async () => {
		const screen = render(Switch, { children: label });
		const sw = screen.getByRole('switch', { name: 'Notifications' });
		await expect.element(sw).not.toBeChecked();
		await screen.getByText('Notifications').click();
		await expect.element(sw).toBeChecked();
	});

	it('reflects size, label position, description and disabled', async () => {
		const screen = render(Switch, {
			children: label,
			size: 'sm',
			labelPosition: 'start',
			description: 'Email and push',
			disabled: true
		});
		const root = screen.container.querySelector('.db-switch') as HTMLElement;
		expect(root).toHaveAttribute('data-size', 'sm');
		expect(root).toHaveAttribute('data-label-position', 'start');
		expect(root).toHaveAttribute('data-disabled');
		await expect.element(screen.getByRole('switch')).toBeDisabled();
		await expect.element(screen.getByText('Email and push')).toBeVisible();
	});
});
