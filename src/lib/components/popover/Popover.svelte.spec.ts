import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './PopoverFixture.test.svelte';

describe('Popover', () => {
	it('toggles from the trigger and exposes aria-expanded', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Filters' });
		await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
		await trigger.click();
		await expect.element(page.getByText('Panel content')).toBeVisible();
		await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
	});

	it('closes with Escape and with the close() helper', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Filters' });
		await trigger.click();
		await userEvent.keyboard('{Escape}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
		await trigger.click();
		await page.getByRole('button', { name: 'Done' }).click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
	});
});
