import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TabBar from './TabBar.svelte';

const items = [
	{ href: '/', label: 'Today', exact: true },
	{ href: '/calendar', label: 'Calendar' },
	{ href: '/clients', label: 'Clients', badge: 2, badgeTone: 'accent' as const }
];

describe('TabBar', () => {
	it('renders a nav landmark with one link per item and marks the current one', async () => {
		const screen = render(TabBar, { items, current: '/clients/42' });
		await expect.element(screen.getByRole('navigation', { name: 'Sections' })).toBeVisible();
		await expect
			.element(screen.getByRole('link', { name: /Clients, 2/ }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(screen.getByRole('link', { name: 'Today' }))
			.not.toHaveAttribute('aria-current');
	});

	it('matches the root only exactly', async () => {
		const screen = render(TabBar, { items, current: '/calendar' });
		await expect
			.element(screen.getByRole('link', { name: 'Calendar' }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(screen.getByRole('link', { name: 'Today' }))
			.not.toHaveAttribute('aria-current');
	});

	it('forwards onclick', async () => {
		const onclick = vi.fn((e: MouseEvent) => e.preventDefault());
		const screen = render(TabBar, { items: [{ href: '/x', label: 'X', onclick }], current: '/' });
		await screen.getByRole('link', { name: 'X' }).click();
		expect(onclick).toHaveBeenCalled();
	});
});
