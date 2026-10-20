import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Fixture from './NavFixture.test.svelte';

describe('Nav', () => {
	it('derives the active item from current, by prefix unless exact', async () => {
		const screen = render(Fixture, { current: '/orders/new/' });
		// prefix match: /orders is active for /orders/new; exact items only match themselves
		await expect
			.element(screen.getByRole('link', { name: 'New order' }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(screen.getByRole('link', { name: /Orders 3/ }))
			.toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Home' }).element().hasAttribute('aria-current')).toBe(
			false
		);
	});

	it('positions one indicator on the active item and moves it when current changes', async () => {
		const screen = render(Fixture, { current: '/orders/' });
		const indicator = () => screen.container.querySelector('.db-nav__indicator') as HTMLElement;
		await expect.poll(() => indicator()?.style.height).not.toBe('');
		const first = indicator().style.transform;
		await screen.rerender({ current: '/settings/' });
		await expect.poll(() => indicator().style.transform).not.toBe(first);
		await expect
			.element(screen.getByRole('link', { name: 'Settings' }))
			.toHaveAttribute('aria-current', 'page');
	});

	it('renders badges, disabled items as buttons, and folds collapsible sections', async () => {
		const screen = render(Fixture);
		expect(screen.container.querySelector('.db-nav-item__badge')?.textContent).toBe('3');
		await expect.element(screen.getByRole('button', { name: 'Reports' })).toBeDisabled();
		await expect.element(screen.getByRole('button', { name: 'Sign out' })).toBeEnabled();
		await screen.getByRole('button', { name: 'More' }).click();
		await expect.element(screen.getByTestId('open')).toHaveTextContent('closed');
		expect(screen.container.querySelector('a[href="/settings"]')).toBeNull();
	});

	it('horizontal: lays items in a row, groups sections, and slides an underline', async () => {
		const screen = render(Fixture, { orientation: 'horizontal', current: '/orders/' });
		const nav = screen.container.querySelector('.db-nav') as HTMLElement;
		expect(nav).toHaveAttribute('data-orientation', 'horizontal');
		expect(getComputedStyle(nav).flexDirection).toBe('row');
		// sections become labelled inline groups instead of headed blocks
		expect(screen.container.querySelector('.db-nav-section__title')).toBeNull();
		expect(screen.container.querySelector('[role="group"][aria-label="Main"]')).not.toBeNull();
		const indicator = () => screen.container.querySelector('.db-nav__indicator') as HTMLElement;
		await expect.poll(() => indicator()?.style.width).not.toBe('');
		const first = indicator().style.transform;
		expect(first).toContain('translateX');
		await screen.rerender({ orientation: 'horizontal', current: '/settings/' });
		await expect.poll(() => indicator().style.transform).not.toBe(first);
	});

	it('orients itself from the AppShell placement: top bar is horizontal, drawer is vertical', async () => {
		await page.viewport(1200, 800);
		const screen = render(Fixture, { inShell: true, navigation: 'top', current: '/orders/' });
		const navs = screen.container.querySelectorAll('.db-nav');
		expect(navs).toHaveLength(2); // header copy + drawer copy
		const top = screen.container.querySelector('.db-app-shell__topnav .db-nav');
		const drawer = screen.container.querySelector('.db-app-shell__sidebar .db-nav');
		expect(top).toHaveAttribute('data-orientation', 'horizontal');
		expect(drawer).toHaveAttribute('data-orientation', 'vertical');
		// on a wide viewport only the top bar is shown
		expect(
			getComputedStyle(screen.container.querySelector('.db-app-shell__sidebar')!).display
		).toBe('none');
		await page.viewport(414, 800);
	});

	it('collapses to icons/monograms with tooltips inside a collapsed AppShell', async () => {
		const screen = render(Fixture, { inShell: true, collapsed: true, current: '/orders/' });
		const orders = screen.container.querySelector('a[href="/orders"]') as HTMLElement;
		expect(orders).toHaveAttribute('data-collapsed');
		await expect.poll(() => orders.getAttribute('title')).toBe('Orders');
		expect(orders.querySelector('.db-nav-item__monogram')?.textContent).toBe('O');
	});
});
