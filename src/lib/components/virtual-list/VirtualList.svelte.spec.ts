import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import VirtualList from './VirtualList.svelte';

const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Row ${i}` }));
type Item = (typeof items)[number];

const row = createRawSnippet((item: () => Item) => ({
	render: () => `<div class="r">${item().name}</div>`
}));

function rendered(container: HTMLElement) {
	return [...container.querySelectorAll('.db-virtual-list__row')].map((el) =>
		Number(el.getAttribute('aria-posinset'))
	);
}

describe('VirtualList', () => {
	it('renders only a window of rows plus overscan, with set size exposed', async () => {
		const screen = render(VirtualList<Item>, {
			items,
			row,
			itemHeight: 40,
			height: '200px',
			overscan: 2,
			label: 'Rows'
		});
		await expect.element(screen.getByText('Row 0')).toBeVisible();
		const list = screen.container.querySelector('.db-virtual-list') as HTMLElement;
		expect(list).toHaveAttribute('role', 'region');
		expect(list).toHaveAttribute('aria-label', 'Rows');
		const posinsets = rendered(screen.container);
		// 200px / 40px = 5 visible rows (+1 for the boundary) + 2 overscan below
		expect(posinsets[0]).toBe(1);
		expect(posinsets.length).toBeGreaterThanOrEqual(6);
		expect(posinsets.length).toBeLessThanOrEqual(9);
		expect(screen.container.querySelector('[aria-setsize="1000"]')).not.toBeNull();
		expect(screen.container.querySelector('.db-virtual-list__track')).toHaveStyle({
			height: '40000px'
		});
	});

	it('moves the window on scroll and keeps absolute positions', async () => {
		const screen = render(VirtualList<Item>, { items, row, itemHeight: 40, height: '200px' });
		await expect.element(screen.getByText('Row 0')).toBeVisible();
		const list = screen.container.querySelector('.db-virtual-list') as HTMLElement;
		list.scrollTop = 4000; // row 100
		list.dispatchEvent(new Event('scroll'));
		await expect.element(screen.getByText('Row 100')).toBeVisible();
		expect(screen.container.querySelector('.r')?.textContent).not.toBe('Row 0');
		const first = screen.container.querySelector('.db-virtual-list__row') as HTMLElement;
		const i = Number(first.getAttribute('aria-posinset')) - 1;
		expect(first.style.transform).toBe(`translateY(${i * 40}px)`);
	});

	it('scrollToIndex aligns a row and getRange reports the window', async () => {
		const screen = render(VirtualList<Item>, { items, row, itemHeight: 40, height: '200px' });
		await expect.element(screen.getByText('Row 0')).toBeVisible();
		const list = screen.container.querySelector('.db-virtual-list') as HTMLElement;
		screen.component.scrollToIndex(500, 'start');
		expect(list.scrollTop).toBe(20000);
		await expect.element(screen.getByText('Row 500')).toBeVisible();
		screen.component.scrollToIndex(999, 'end');
		expect(list.scrollTop).toBe(40000 - list.clientHeight);
		// nearest: already visible → no movement
		const before = list.scrollTop;
		screen.component.scrollToIndex(998);
		expect(list.scrollTop).toBe(before);
		const r = screen.component.getRange();
		expect(r.end).toBe(999);
		expect(r.start).toBeLessThanOrEqual(995);
	});

	it('fires onEndReached once per approach and re-arms when items grow', async () => {
		const onEndReached = vi.fn();
		const screen = render(VirtualList<Item>, {
			items: items.slice(0, 50),
			row,
			itemHeight: 40,
			height: '200px',
			onEndReached
		});
		await expect.element(screen.getByText('Row 0')).toBeVisible();
		expect(onEndReached).not.toHaveBeenCalled();
		const list = screen.container.querySelector('.db-virtual-list') as HTMLElement;
		list.scrollTop = 50 * 40;
		list.dispatchEvent(new Event('scroll'));
		await expect.element(screen.getByText('Row 49')).toBeVisible();
		expect(onEndReached).toHaveBeenCalledTimes(1);
		list.scrollTop = 1800;
		list.dispatchEvent(new Event('scroll'));
		await expect.element(screen.getByText('Row 45')).toBeVisible();
		expect(onEndReached).toHaveBeenCalledTimes(1);
		await screen.rerender({ items: items.slice(0, 100) });
		await expect.element(screen.getByText('Row 49')).toBeVisible();
		list.scrollTop = 100 * 40;
		list.dispatchEvent(new Event('scroll'));
		await expect.element(screen.getByText('Row 99')).toBeVisible();
		expect(onEndReached).toHaveBeenCalledTimes(2);
	});

	it('measures variable row heights and positions later rows accordingly', async () => {
		const tall = createRawSnippet((item: () => Item) => ({
			render: () => `<div style="height:${item().id % 2 ? 60 : 20}px">${item().name}</div>`
		}));
		const screen = render(VirtualList<Item>, {
			items: items.slice(0, 20),
			row: tall,
			itemHeight: 10,
			measure: true,
			height: '200px',
			overscan: 0
		});
		await expect.element(screen.getByText('Row 0')).toBeVisible();
		// Rows 0..3 are 20,60,20,60 → row 4 sits at 160px once measured.
		await vi.waitFor(() => {
			const r4 = screen.container.querySelector('[aria-posinset="5"]') as HTMLElement;
			expect(r4?.style.transform).toBe('translateY(160px)');
		});
		const track = screen.container.querySelector('.db-virtual-list__track') as HTMLElement;
		// 10 short (20) + 10 tall (60) = 800px, with unmeasured rows still at the 10px estimate.
		expect(parseInt(track.style.height)).toBeGreaterThan(200);
	});

	it('shows the empty state', async () => {
		const screen = render(VirtualList<Item>, { items: [], row, emptyText: 'Nothing here' });
		await expect.element(screen.getByText('Nothing here')).toBeVisible();
		expect(screen.container.querySelector('.db-virtual-list__track')).toBeNull();
	});
});
