import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Breadcrumb from './Breadcrumb.svelte';

const items = [
	{ label: 'Home', href: '/' },
	{ label: 'Accounts', href: '/accounts' },
	{ label: 'Brokerage', href: '/accounts/brokerage' },
	{ label: 'Positions', href: '/accounts/brokerage/positions' },
	{ label: 'MSFT' }
];

describe('Breadcrumb', () => {
	it('renders a labelled nav with links and the current page', async () => {
		const screen = render(Breadcrumb, { items: items.slice(0, 3), label: 'Trail' });
		await expect.element(screen.getByRole('navigation', { name: 'Trail' })).toBeVisible();
		expect(screen.getByRole('link').elements()).toHaveLength(2);
		await expect
			.element(screen.getByRole('link', { name: 'Accounts' }))
			.toHaveAttribute('href', '/accounts');
		const current = screen.getByText('Brokerage');
		await expect.element(current).toHaveAttribute('aria-current', 'page');
		expect(current.element().tagName).toBe('SPAN');
	});

	it('collapses long trails and expands on demand', async () => {
		const screen = render(Breadcrumb, { items });
		expect(screen.getByRole('listitem').elements()).toHaveLength(4);
		expect(screen.container.querySelector('a[href="/accounts"]')).toBeNull();
		await screen.getByRole('button', { name: 'Show all breadcrumbs' }).click();
		expect(screen.getByRole('listitem').elements()).toHaveLength(5);
		await expect.element(screen.getByRole('link', { name: 'Accounts' })).toBeVisible();
	});

	it('never shows fewer than first, ellipsis and last for tiny maxItems', async () => {
		const screen = render(Breadcrumb, { items, maxItems: 1 });
		expect(screen.getByRole('listitem').elements()).toHaveLength(3);
		await expect.element(screen.getByRole('link', { name: 'Home' })).toBeVisible();
		await expect.element(screen.getByText('MSFT')).toBeVisible();
	});

	it('never collapses when maxItems is large enough', () => {
		const screen = render(Breadcrumb, { items, maxItems: 5 });
		expect(screen.container.querySelector('.db-breadcrumb__ellipsis')).toBeNull();
	});
});
