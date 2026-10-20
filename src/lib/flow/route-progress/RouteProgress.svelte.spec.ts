import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './RouteProgressFixture.test.svelte';

describe('RouteProgress', () => {
	it('stays hidden when inactive and for navigations shorter than the delay', async () => {
		const screen = render(Fixture, { active: false });
		expect(screen.container.querySelector('.db-route-progress')).toBeNull();
		await screen.rerender({ active: true, delay: 500 });
		await new Promise((r) => setTimeout(r, 100));
		expect(screen.container.querySelector('.db-route-progress')).toBeNull();
	});

	it('appears, trickles, then completes and hides', async () => {
		const screen = render(Fixture, { active: true, delay: 0 });
		const bar = screen.getByRole('progressbar', { name: 'Loading page' });
		await expect.element(bar).toBeInTheDocument();
		const first = Number(bar.element().getAttribute('aria-valuenow'));
		expect(first).toBeGreaterThan(0);
		await new Promise((r) => setTimeout(r, 450));
		const later = Number(bar.element().getAttribute('aria-valuenow'));
		expect(later).toBeGreaterThan(first);
		expect(later).toBeLessThanOrEqual(90);

		await screen.rerender({ active: false });
		await expect.element(bar).toHaveAttribute('aria-valuenow', '100');
		await expect.poll(() => screen.container.querySelector('.db-route-progress')).toBeNull();
	});
});
