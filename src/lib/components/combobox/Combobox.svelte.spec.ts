import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './ComboboxFixture.test.svelte';

describe('Combobox', () => {
	it('is labelled and described by the Field and filters as you type', async () => {
		const screen = render(Fixture);
		const input = screen.getByRole('combobox', { name: 'Ticker' });
		await expect.element(input).toHaveAccessibleDescription('Type to search');
		await input.click();
		await userEvent.keyboard('nv');
		await expect.element(page.getByRole('listbox')).toBeVisible();
		expect(
			page
				.getByRole('option')
				.elements()
				.map((o) => o.textContent?.trim())
		).toEqual(['NVIDIA']);
		// keywords are searched too
		await userEvent.keyboard('{Backspace}{Backspace}jpm');
		await expect.element(page.getByRole('option', { name: 'JPMorgan' })).toBeVisible();
	});

	it('shows the empty text when nothing matches', async () => {
		const screen = render(Fixture);
		await screen.getByRole('combobox').click();
		await userEvent.keyboard('zzz');
		await expect.element(page.getByText('No matches')).toBeVisible();
	});

	it('selects with the keyboard, mirrors the label, and fills the hidden input', async () => {
		const onValueChange = vi.fn();
		const screen = render(Fixture, { onValueChange });
		const input = screen.getByRole('combobox');
		await input.click();
		await userEvent.keyboard('app');
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('aapl');
		await expect.element(input).toHaveValue('Apple');
		expect(onValueChange).toHaveBeenCalledWith('aapl');
		expect(screen.container.querySelector('input[name="ticker"]')).toHaveValue('aapl');
	});

	it('restores the selected label when closed with a partial query', async () => {
		const screen = render(Fixture, { initial: 'msft' });
		const input = screen.getByRole('combobox');
		await expect.element(input).toHaveValue('Microsoft');
		await input.click();
		await userEvent.keyboard('{Backspace}{Backspace}{Backspace}');
		await userEvent.keyboard('{Escape}');
		await expect.element(input).toHaveValue('Microsoft');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('msft');
	});

	it('multiple: renders chips, keeps the list open, and removes via the chip', async () => {
		const screen = render(Fixture, { multiple: true, initial: ['msft'] });
		expect(screen.container.querySelectorAll('.db-combobox__chip')).toHaveLength(1);
		await screen.getByRole('button', { name: 'Show options' }).click();
		await page.getByRole('option', { name: 'Apple' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('msft,aapl');
		expect(screen.container.querySelectorAll('.db-combobox__chip')).toHaveLength(2);
		expect(screen.container.querySelectorAll('input[name="ticker[]"]')).toHaveLength(2);
		await screen.getByRole('button', { name: 'Remove Microsoft' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('aapl');
	});

	it('reflects Field errors and disabled options', async () => {
		const screen = render(Fixture, { error: 'Required' });
		const input = screen.getByRole('combobox');
		await expect.element(input).toHaveAttribute('aria-invalid', 'true');
		expect(screen.container.querySelector('.db-combobox')).toHaveAttribute('data-invalid');
		await screen.getByRole('button', { name: 'Show options' }).click();
		await expect
			.element(page.getByRole('option', { name: 'Delisted' }))
			.toHaveAttribute('data-disabled');
	});
});
