import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './AccordionFixture.test.svelte';

describe('Accordion', () => {
	it('renders headings with collapsed triggers and a disabled item', async () => {
		const screen = render(Fixture);
		expect(screen.getByRole('heading', { level: 3 }).elements()).toHaveLength(3);
		const fees = screen.getByRole('button', { name: /Fees/ });
		await expect.element(fees).toHaveAttribute('aria-expanded', 'false');
		await expect.element(fees).toHaveTextContent('What you pay');
		await expect.element(screen.getByRole('button', { name: 'Closed' })).toBeDisabled();
	});

	it('single: opens one item at a time and toggles closed', async () => {
		const onValueChange = vi.fn();
		const screen = render(Fixture, { onValueChange });
		await screen.getByRole('button', { name: /Fees/ }).click();
		await expect.element(screen.getByText('Zero commission.')).toBeVisible();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('fees');
		expect(onValueChange).toHaveBeenLastCalledWith('fees');

		await screen.getByRole('button', { name: 'Limits' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('limits');
		await expect.element(screen.getByText('Daily limit applies.')).toBeVisible();
		await expect
			.element(screen.getByRole('button', { name: /Fees/ }))
			.toHaveAttribute('aria-expanded', 'false');

		await screen.getByRole('button', { name: 'Limits' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('');
	});

	it('multiple: keeps several items open', async () => {
		const screen = render(Fixture, { type: 'multiple' });
		await screen.getByRole('button', { name: /Fees/ }).click();
		await screen.getByRole('button', { name: 'Limits' }).click();
		await expect.element(screen.getByTestId('value')).toHaveTextContent('fees,limits');
		await expect.element(screen.getByText('Zero commission.')).toBeVisible();
		await expect.element(screen.getByText('Daily limit applies.')).toBeVisible();
	});

	it('moves focus between triggers with arrow keys, skipping disabled', async () => {
		const screen = render(Fixture);
		const fees = screen.getByRole('button', { name: /Fees/ });
		(fees.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(document.activeElement?.textContent).toContain('Limits');
		await userEvent.keyboard('{ArrowDown}');
		expect(document.activeElement?.textContent).toContain('Fees');
	});
});
