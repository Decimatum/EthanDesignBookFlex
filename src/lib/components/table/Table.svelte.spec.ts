import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './TableFixture.test.svelte';

function bodyCells(screen: ReturnType<typeof render>, col: number) {
	return Array.from(screen.container.querySelectorAll(`tbody tr td:nth-child(${col})`), (td) =>
		td.textContent?.trim()
	);
}

describe('Table', () => {
	it('renders headers, caption, custom cells and numeric alignment', async () => {
		const screen = render(Fixture);
		await expect.element(screen.getByRole('table', { name: 'Open positions' })).toBeVisible();
		expect(screen.getByRole('columnheader').elements()).toHaveLength(3);
		await expect
			.element(screen.getByRole('columnheader', { name: 'Qty' }))
			.toHaveAttribute('data-align', 'end');
		await expect
			.element(screen.getByRole('columnheader', { name: 'Symbol' }))
			.toHaveAttribute('aria-sort', 'none');
		// custom cell renders nulls as a dash
		expect(bodyCells(screen, 3)).toEqual(['120.50', '-40.00', '—']);
		expect(screen.container.querySelector('td[data-numeric]')).not.toBeNull();
	});

	it('sorts client-side, toggles direction and updates aria-sort', async () => {
		const screen = render(Fixture);
		const qty = screen.getByRole('button', { name: 'Qty' });
		await qty.click();
		await expect
			.element(screen.getByRole('columnheader', { name: 'Qty' }))
			.toHaveAttribute('aria-sort', 'ascending');
		await expect.element(screen.getByTestId('sort')).toHaveTextContent('qty:asc');
		expect(bodyCells(screen, 2)).toEqual(['5', '10', '25']);

		await qty.click();
		await expect
			.element(screen.getByRole('columnheader', { name: 'Qty' }))
			.toHaveAttribute('aria-sort', 'descending');
		expect(bodyCells(screen, 2)).toEqual(['25', '10', '5']);

		// nulls always sort last, strings sort naturally
		await screen.getByRole('button', { name: 'P&L' }).click();
		expect(bodyCells(screen, 3)).toEqual(['-40.00', '120.50', '—']);
		await screen.getByRole('button', { name: 'Symbol' }).click();
		expect(bodyCells(screen, 1)).toEqual(['AAPL', 'MSFT', 'NVDA']);
	});

	it('hands sorting to onSort and leaves row order alone', async () => {
		const onSort = vi.fn();
		const screen = render(Fixture, { onSort });
		await screen.getByRole('button', { name: 'Qty' }).click();
		expect(onSort).toHaveBeenCalledWith({ key: 'qty', direction: 'asc' });
		expect(bodyCells(screen, 2)).toEqual(['10', '25', '5']);
	});

	it('makes rows focusable and activatable when onRowClick is set', async () => {
		const onRowClick = vi.fn();
		const screen = render(Fixture, { onRowClick });
		const rows = screen.getByRole('row').elements().slice(1);
		expect(rows[0].getAttribute('tabindex')).toBe('0');
		await screen.getByRole('row', { name: /AAPL/ }).click();
		expect(onRowClick).toHaveBeenLastCalledWith(expect.objectContaining({ symbol: 'AAPL' }));
		(rows[2] as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		expect(onRowClick).toHaveBeenLastCalledWith(expect.objectContaining({ symbol: 'NVDA' }));
	});

	it('does not treat clicks on cell controls as row activation', async () => {
		const onRowClick = vi.fn();
		const screen = render(Fixture, { onRowClick, withButtons: true });
		await screen.getByRole('button', { name: 'Close MSFT' }).click();
		expect(onRowClick).not.toHaveBeenCalled();
	});

	it('shows the empty text when there are no rows', async () => {
		const screen = render(Fixture, { rows: [] });
		await expect.element(screen.getByText('Nothing here')).toBeVisible();
		expect(screen.container.querySelector('td')?.getAttribute('colspan')).toBe('3');
	});
});
