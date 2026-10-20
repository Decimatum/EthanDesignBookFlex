import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './AppShellFixture.test.svelte';

describe('AppShell', () => {
	it('lays out landmarks with the given ids and labels', async () => {
		await page.viewport(414, 800);
		const screen = render(Fixture);
		await expect.element(screen.getByRole('banner')).toHaveTextContent('Brand');
		// the sidebar is off-canvas (hidden) at the test viewport width, so query the DOM directly
		const nav = screen.container.querySelector('nav.db-app-shell__sidebar');
		expect(nav?.getAttribute('aria-label')).toBe('Site');
		const main = screen.getByRole('main');
		await expect.element(main).toHaveAttribute('id', 'content');
		await expect.element(main).toHaveTextContent('Body');
		await expect.element(screen.getByRole('contentinfo')).toHaveTextContent('Footer');
		expect(screen.container.querySelector('.db-app-shell__surface')).not.toBeNull();
		expect(screen.container.querySelector('.db-app-shell')).toHaveAttribute('data-has-sidebar');
		expect(screen.container.querySelector('.db-app-shell')).toHaveAttribute('data-has-aside');
	});

	it('toggles the off-canvas sidebar from the built-in button, the header snippet, and Escape', async () => {
		await page.viewport(414, 800);
		const screen = render(Fixture);
		const menu = screen.getByRole('button', { name: 'Open navigation' });
		await expect.element(menu).toHaveAttribute('aria-expanded', 'false');
		await menu.click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
		await expect
			.element(screen.getByRole('button', { name: 'Close navigation' }))
			.toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Escape}');
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');

		await screen.getByTestId('custom-toggle').click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('open');
		await screen.getByRole('button', { name: 'Close nav', exact: true }).click();
		await expect.element(screen.getByTestId('state')).toHaveTextContent('closed');
	});

	it('collapses to a rail and tells the brand snippet (wide viewport)', async () => {
		await page.viewport(1200, 800);
		const screen = render(Fixture);
		const btn = screen.container.querySelector('.db-app-shell__collapse') as HTMLButtonElement;
		expect(btn.getAttribute('aria-label')).toBe('Collapse sidebar');
		expect(btn.getAttribute('aria-pressed')).toBe('false');
		await userEvent.click(btn);
		await expect.element(screen.getByTestId('collapsed')).toHaveTextContent('rail');
		expect(screen.container.querySelector('.db-app-shell')).toHaveAttribute('data-collapsed');
		await expect
			.poll(() => screen.container.querySelector('.db-app-shell__brand')?.textContent?.trim())
			.toBe('B');
		expect(btn.getAttribute('aria-label')).toBe('Expand sidebar');
	});
});
