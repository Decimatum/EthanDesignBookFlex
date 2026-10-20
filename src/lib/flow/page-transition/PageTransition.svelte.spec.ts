import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './PageTransitionFixture.test.svelte';
import { viewTransition, slideByDepth, type NavigationLike } from './view-transition.js';

const nav = (from: string, to: string): NavigationLike => ({
	from: { url: new URL(from, 'http://x') },
	to: { url: new URL(to, 'http://x') },
	complete: Promise.resolve()
});

describe('PageTransition', () => {
	it('swaps content when the key changes, overlapping old and new pages', async () => {
		const screen = render(Fixture, { route: 'a' });
		await expect.element(screen.getByText('Page a')).toBeVisible();
		await screen.rerender({ route: 'b' });
		// during the swap both pages exist in the same grid cell
		await expect.element(screen.getByText('Page b')).toBeInTheDocument();
		await expect
			.poll(() => screen.container.querySelectorAll('.db-page-transition__page').length)
			.toBe(1);
		expect(screen.container.querySelector('.db-page-transition')).toHaveAttribute(
			'data-kind',
			'slide'
		);
	});
});

describe('viewTransition()', () => {
	it('picks slide for depth changes and fade for siblings', () => {
		expect(slideByDepth(nav('/a', '/a/b'))).toBe('slide');
		expect(slideByDepth(nav('/a/b', '/a/c'))).toBe('fade');
	});

	it('is a no-op without browser support or with kind none', () => {
		const doc = document as unknown as Record<string, unknown>;
		const original = doc.startViewTransition;
		doc.startViewTransition = undefined;
		expect(viewTransition()(nav('/', '/a'))).toBeUndefined();
		doc.startViewTransition = original;
		expect(viewTransition({ kind: 'none' })(nav('/', '/a'))).toBeUndefined();
	});

	it('sets data-transition on <html> for the duration when supported', async () => {
		const doc = document as unknown as Record<string, unknown>;
		const original = doc.startViewTransition;
		let finish!: () => void;
		const finished = new Promise<void>((r) => (finish = r));
		const start = vi.fn((cb: () => Promise<void>) => {
			void cb();
			return { finished };
		});
		doc.startViewTransition = start;
		const p = viewTransition({ kind: 'slide' })(nav('/', '/a'));
		await p;
		expect(start).toHaveBeenCalledTimes(1);
		expect(document.documentElement.dataset.transition).toBe('slide');
		finish();
		await expect.poll(() => document.documentElement.dataset.transition).toBeUndefined();
		doc.startViewTransition = original;
	});
});
