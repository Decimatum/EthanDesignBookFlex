import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './TabsFixture.test.svelte';

describe('Tabs', () => {
	it('renders a labelled tablist with the bound tab selected and its panel shown', async () => {
		const screen = render(Fixture);
		await expect.element(screen.getByRole('tablist', { name: 'Portfolio sections' })).toBeVisible();
		const positions = screen.getByRole('tab', { name: /Positions/ });
		await expect.element(positions).toHaveAttribute('aria-selected', 'true');
		await expect.element(screen.getByRole('tabpanel')).toHaveTextContent('Positions panel');
		await expect
			.element(screen.getByRole('tab', { name: 'History' }))
			.toHaveAttribute('data-disabled');
	});

	it('switches on click and reports the change', async () => {
		const onValueChange = vi.fn();
		const screen = render(Fixture, { onValueChange });
		await screen.getByRole('tab', { name: 'Orders' }).click();
		await expect.element(screen.getByRole('tabpanel')).toHaveTextContent('Orders panel');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('orders');
		expect(onValueChange).toHaveBeenCalledWith('orders');
	});

	it('moves with arrow keys, skipping disabled tabs', async () => {
		const screen = render(Fixture);
		await screen.getByRole('tab', { name: /Positions/ }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('orders');
		await userEvent.keyboard('{ArrowRight}');
		// History is disabled → wraps back to Positions
		await expect.element(screen.getByTestId('value')).toHaveTextContent('positions');
	});
});
