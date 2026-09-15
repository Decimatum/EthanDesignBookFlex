import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Divider from './Divider.svelte';

describe('Divider', () => {
	it('is a horizontal separator by default', async () => {
		const screen = render(Divider);
		const el = screen.getByRole('separator');
		await expect.element(el).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('supports vertical orientation', async () => {
		const screen = render(Divider, { orientation: 'vertical' });
		await expect
			.element(screen.getByRole('separator'))
			.toHaveAttribute('aria-orientation', 'vertical');
	});

	it('renders a label', async () => {
		const screen = render(Divider, {
			children: createRawSnippet(() => ({ render: () => '<span>or</span>' }))
		});
		await expect.element(screen.getByText('or')).toBeVisible();
		expect(screen.container.querySelector('.db-divider')).toHaveAttribute('data-labelled');
	});
});
