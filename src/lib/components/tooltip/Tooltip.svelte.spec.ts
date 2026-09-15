import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './TooltipFixture.test.svelte';

describe('Tooltip', () => {
	it('shows on hover and describes the trigger', async () => {
		const screen = render(Fixture);
		const trigger = screen.getByRole('button', { name: 'Delete' });
		await trigger.hover();
		const tip = page.getByRole('tooltip');
		await expect.element(tip).toBeVisible();
		await expect.element(tip).toHaveTextContent('Delete item');
	});

	it('shows on keyboard focus and hides on Escape', async () => {
		const screen = render(Fixture);
		await userEvent.keyboard('{Tab}');
		await expect.element(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
		await expect.element(page.getByRole('tooltip')).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => document.querySelector('[role="tooltip"]')).toBeNull();
	});
});
