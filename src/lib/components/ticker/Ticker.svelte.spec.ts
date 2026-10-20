import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Ticker, { type TickerItem } from './Ticker.svelte';

const items: TickerItem[] = [
	{ id: 'nvda', label: 'NVDA', value: 902.5, change: 1.24 },
	{ id: 'aapl', label: 'AAPL', value: 189.9, change: -0.42 },
	{ id: 'btc', label: 'BTC', value: 64210, change: 1850, changeFormat: 'currency' }
];

describe('Ticker', () => {
	it('renders one accessible copy of the items inside a labelled marquee', async () => {
		const screen = render(Ticker, { items, label: 'Watchlist' });
		const region = screen.getByRole('marquee', { name: 'Watchlist' });
		await expect.element(region).toBeVisible();
		// Duplicated groups (added once the width is measured) make the loop seamless but are
		// hidden from assistive tech.
		const all = () => screen.container.querySelectorAll('.db-ticker__group');
		await vi.waitFor(() => expect(all().length).toBeGreaterThanOrEqual(2));
		const groups = all();
		expect(groups[0]).not.toHaveAttribute('aria-hidden');
		for (const g of Array.from(groups).slice(1)) expect(g).toHaveAttribute('aria-hidden', 'true');
		expect(groups[0].textContent).toContain('NVDA');
		expect(groups[0].textContent).toContain('902.50');
		expect(groups[0].textContent).toContain('+1.24%');
		expect(groups[0].textContent).toContain('+$1,850.00');
	});

	it('animates, and the pause button stops it', async () => {
		const screen = render(Ticker, { items });
		const root = screen.container.querySelector('.db-ticker') as HTMLElement;
		const track = screen.container.querySelector('.db-ticker__track') as HTMLElement;
		await vi.waitFor(() => expect(root).not.toHaveAttribute('data-paused'));
		expect(getComputedStyle(track).animationName).not.toBe('none');
		expect(getComputedStyle(track).animationPlayState).toBe('running');
		const button = screen.getByRole('button', { name: 'Pause ticker' });
		await button.click();
		expect(root).toHaveAttribute('data-paused');
		expect(getComputedStyle(track).animationPlayState).toBe('paused');
		await expect.element(screen.getByRole('button', { name: 'Play ticker' })).toBeVisible();
	});

	it('links or buttons only in the first copy are tabbable', async () => {
		const onItemClick = vi.fn();
		const screen = render(Ticker, {
			items: items.map((i) => ({ ...i, href: `/q/${i.id}` })),
			onItemClick
		});
		const all = () => screen.container.querySelectorAll('a.db-ticker__link');
		await vi.waitFor(() => expect(all().length).toBeGreaterThanOrEqual(6));
		const links = all();
		expect(links[0]).not.toHaveAttribute('tabindex');
		expect(links[3]).toHaveAttribute('tabindex', '-1');
		(links[0] as HTMLAnchorElement).addEventListener('click', (e) => e.preventDefault());
		(links[0] as HTMLAnchorElement).click();
		expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'nvda' }));
	});

	it('flashes an item when its numeric value changes', async () => {
		const screen = render(Ticker, { items });
		const item = () => screen.container.querySelector('.db-ticker__item') as HTMLElement;
		expect(item()).not.toHaveAttribute('data-flash');
		await screen.rerender({
			items: items.map((i) => (i.id === 'nvda' ? { ...i, value: 910 } : i))
		});
		await vi.waitFor(() => expect(item()).toHaveAttribute('data-flash', 'up'));
		await screen.rerender({
			items: items.map((i) => (i.id === 'nvda' ? { ...i, value: 900 } : i))
		});
		await vi.waitFor(() => expect(item()).toHaveAttribute('data-flash', 'down'));
		await vi.waitFor(() => expect(item()).not.toHaveAttribute('data-flash'), { timeout: 2000 });
	});
});
