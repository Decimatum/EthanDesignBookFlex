import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './SelectFixture.test.svelte';

describe('Select', () => {
	it('is labelled by the Field and shows the placeholder', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Ticker' });
		await expect.element(trigger).toBeVisible();
		await expect.element(trigger).toHaveTextContent('Choose a ticker');
		expect(screen.container.querySelector('.db-select')).toHaveAttribute('data-placeholder');
	});

	it('opens, lists grouped options and selects one', async () => {
		const onValueChange = vi.fn();
		const screen = render(Fixture, { onValueChange });
		const trigger = screen.getByRole('button', { name: 'Ticker' });
		await trigger.click();
		await expect.element(page.getByRole('listbox')).toBeVisible();
		await expect.element(page.getByText('Finance')).toBeVisible();
		await page.getByRole('option', { name: 'Microsoft' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('msft');
		await expect.element(trigger).toHaveTextContent('Microsoft');
		expect(onValueChange).toHaveBeenCalledWith('msft');
		// hidden input for native forms
		expect(screen.container.querySelector('input[name="ticker"]')).toHaveValue('msft');
	});

	it('marks disabled options and reflects Field errors', async () => {
		const screen = render(Fixture, { error: 'Required' });
		const trigger = screen.getByRole('button', { name: 'Ticker' });
		await expect.element(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(screen.container.querySelector('.db-select')).toHaveAttribute('data-invalid');
		await trigger.click();
		await expect
			.element(page.getByRole('option', { name: 'Delisted' }))
			.toHaveAttribute('data-disabled');
	});

	it('supports keyboard selection', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Ticker' });
		await trigger.click();
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Enter}');
		await expect.element(screen.getByTestId('value')).not.toHaveTextContent('none');
	});
});
