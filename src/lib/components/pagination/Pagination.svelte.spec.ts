import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './PaginationFixture.test.svelte';

function pageLabels(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.container.querySelectorAll('.db-pagination__page, .db-pagination__ellipsis'),
		(el) => el.textContent?.trim()
	);
}

describe('Pagination', () => {
	it('renders first, siblings and last with ellipses around the current page', async () => {
		const screen = render(Fixture, { pages: 20, initial: 10 });
		await expect.element(screen.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
		expect(pageLabels(screen)).toEqual(['1', '…', '9', '10', '11', '…', '20']);
		await expect
			.element(screen.getByRole('button', { name: 'Page 10' }))
			.toHaveAttribute('aria-current', 'page');
	});

	it('derives the page count from count and perPage', () => {
		const screen = render(Fixture, { count: 45, perPage: 10 });
		expect(pageLabels(screen)).toEqual(['1', '2', '3', '4', '5']);
	});

	it('keeps a constant number of slots near the edges', () => {
		expect(pageLabels(render(Fixture, { pages: 20, initial: 3 }))).toEqual([
			'1',
			'2',
			'3',
			'4',
			'5',
			'…',
			'20'
		]);
		expect(pageLabels(render(Fixture, { pages: 20, initial: 18 }))).toEqual([
			'1',
			'…',
			'16',
			'17',
			'18',
			'19',
			'20'
		]);
		expect(pageLabels(render(Fixture, { pages: 7 }))).toEqual(['1', '2', '3', '4', '5', '6', '7']);
	});

	it('navigates with prev/next and page buttons, clamping at the edges', async () => {
		const onPageChange = vi.fn();
		const screen = render(Fixture, { pages: 3, onPageChange });
		const prev = screen.getByRole('button', { name: 'Previous page' });
		const next = screen.getByRole('button', { name: 'Next page' });
		await expect.element(prev).toBeDisabled();

		await next.click();
		await expect.element(screen.getByTestId('page')).toHaveTextContent('2');
		expect(onPageChange).toHaveBeenLastCalledWith(2);

		await screen.getByRole('button', { name: 'Page 3' }).click();
		await expect.element(screen.getByTestId('page')).toHaveTextContent('3');
		await expect.element(next).toBeDisabled();

		// clicking the current page is a no-op
		await screen.getByRole('button', { name: 'Page 3' }).click();
		expect(onPageChange).toHaveBeenCalledTimes(2);
	});

	it('shows a single page when there is nothing to paginate', () => {
		const screen = render(Fixture, { count: 0 });
		expect(pageLabels(screen)).toEqual(['1']);
	});
});
