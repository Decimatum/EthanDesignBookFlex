import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './DialogFixture.test.svelte';

describe('Dialog', () => {
	it('opens from the trigger with title, description and focus inside', async () => {
		const screen = render(Fixture);
		await screen.getByRole('button', { name: 'Open' }).click();
		const dialog = page.getByRole('dialog', { name: 'Delete file' });
		await expect.element(dialog).toBeVisible();
		await expect.element(dialog).toHaveAccessibleDescription('This cannot be undone.');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
		expect(document.activeElement && dialog.element().contains(document.activeElement)).toBe(true);
	});

	it('closes via Escape, the X button, and the close() helper', async () => {
		const onOpenChange = vi.fn();
		const screen = render(Fixture, { onOpenChange });
		const trigger = screen.getByRole('button', { name: 'Open' });

		await trigger.click();
		await userEvent.keyboard('{Escape}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
		expect(onOpenChange).toHaveBeenLastCalledWith(false);

		await trigger.click();
		await page.getByRole('button', { name: 'Close', exact: true }).click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');

		await trigger.click();
		await page.getByRole('button', { name: 'Cancel' }).click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
	});

	it('ignores Escape and hides the X when not dismissible', async () => {
		const screen = render(Fixture, { dismissible: false });
		await screen.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeVisible();
		expect(document.querySelector('.db-dialog__close')).toBeNull();
		await userEvent.keyboard('{Escape}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
	});
});
