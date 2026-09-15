import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './MenuFixture.test.svelte';

describe('Menu', () => {
	it('opens a menu with items, links, groups and a disabled item', async () => {
		const screen = render(Fixture);
		await screen.getByRole('button', { name: 'Actions' }).click();
		const menu = page.getByRole('menu');
		await expect.element(menu).toBeVisible();
		await expect.element(page.getByRole('menuitem', { name: /Rename/ })).toBeVisible();
		await expect
			.element(page.getByRole('menuitem', { name: 'Download' }))
			.toHaveAttribute('href', '/download');
		await expect
			.element(page.getByRole('menuitem', { name: 'Move' }))
			.toHaveAttribute('aria-disabled', 'true');
		await expect.element(page.getByText('File')).toBeVisible();
	});

	it('selects with the mouse and closes; danger item calls its handler', async () => {
		const onRename = vi.fn();
		const onDelete = vi.fn();
		const screen = render(Fixture, { onRename, onDelete });
		const trigger = screen.getByRole('button', { name: 'Actions' });
		await trigger.click();
		await page.getByRole('menuitem', { name: /Rename/ }).click();
		expect(onRename).toHaveBeenCalledTimes(1);
		await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull();
		await trigger.click();
		await page.getByRole('menuitem', { name: 'Delete' }).click();
		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it('supports keyboard navigation and checkbox items', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Actions' });
		await trigger.click();
		await userEvent.keyboard('{ArrowDown}');
		await expect
			.element(page.getByRole('menuitem', { name: /Rename/ }))
			.toHaveAttribute('data-highlighted');
		const check = page.getByRole('menuitemcheckbox', { name: 'Show hidden' });
		await expect.element(check).toHaveAttribute('aria-checked', 'false');
		await check.click();
		await expect.element(screen.getByTestId('hidden')).toHaveTextContent('yes');
		// checkbox items keep the menu open by default
		await expect.element(page.getByRole('menu')).toBeVisible();
	});
});
