import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './CommandPaletteFixture.test.svelte';

describe('CommandPalette', () => {
	it('opens with the global shortcut and closes with Escape', async () => {
		const screen = render(Fixture);
		await userEvent.keyboard('{Control>}k{/Control}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
		await expect.element(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
	});

	it('ignores the shortcut when disabled', async () => {
		const screen = render(Fixture, { shortcut: null });
		await userEvent.keyboard('{Control>}k{/Control}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
	});

	it('lists groups, filters by label and keywords, and runs a command from the keyboard', async () => {
		const onSelect = vi.fn();
		const screen = render(Fixture, { onSelect });
		await screen.getByRole('button', { name: 'Open palette' }).click();
		await expect.element(page.getByText('Navigate')).toBeVisible();
		await expect.element(page.getByText('Actions')).toBeVisible();
		expect(page.getByRole('option').elements()).toHaveLength(5);

		await userEvent.keyboard('fills');
		await expect.poll(() => page.getByRole('option').elements().length).toBe(1);
		await expect.element(page.getByRole('option', { name: /Orders/ })).toBeVisible();

		await userEvent.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}');
		await userEvent.keyboard('new');
		await userEvent.keyboard('{Enter}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
		await expect.element(screen.getByTestId('ran')).toHaveTextContent('new');
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'new' }));
	});

	it('renders href commands as links, shows shortcuts, and skips disabled ones', async () => {
		const screen = render(Fixture);
		await screen.getByRole('button', { name: 'Open palette' }).click();
		const dash = page.getByRole('option', { name: /Dashboard/ });
		expect(dash.element().tagName).toBe('A');
		expect(dash.element().getAttribute('href')).toBe('/dash');
		expect(dash.element().querySelectorAll('kbd')).toHaveLength(2);
		await expect
			.element(page.getByRole('option', { name: /Disabled thing/ }))
			.toHaveAttribute('data-disabled');
	});

	it('shows the empty text when nothing matches', async () => {
		const screen = render(Fixture);
		await screen.getByRole('button', { name: 'Open palette' }).click();
		await userEvent.keyboard('zzzz');
		await expect.element(page.getByText('No results')).toBeVisible();
	});
});
