import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CourtMap from './CourtMap.svelte';

const markers = [
	{ id: 'me', kind: 'me' as const, x: 7.2, y: 15.4 },
	{ id: 'p', kind: 'partner' as const, x: 3.1, y: 11.8 },
	{ id: 'c', kind: 'correct' as const, x: 7.0, y: 11.4 }
];

describe('CourtMap', () => {
	it('draws the court with named markers and an arrow', async () => {
		const screen = render(CourtMap, { markers, arrows: [{ from: 'me', to: 'c' }] });
		await expect.element(screen.getByRole('img', { name: 'Padel court' })).toBeVisible();
		const dots = screen.container.querySelectorAll('.db-court-map__marker');
		expect(dots.length).toBe(3);
		expect(screen.container.querySelector('.db-court-map__sr')?.textContent).toContain(
			'me: your side, right, mid-court'
		);
		expect(screen.container.querySelectorAll('.db-court-map__arrow').length).toBe(1);
	});

	it('in edit mode a marker is a button that nudges with the arrow keys', async () => {
		const onMove = vi.fn();
		const screen = render(CourtMap, { markers, mode: 'edit', onMove });
		const me = screen.getByRole('button', { name: /^me:/ });
		await expect.element(me).toBeVisible();
		(me.element() as HTMLElement).focus();
		(me.element() as HTMLElement).dispatchEvent(
			new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
		);
		expect(onMove).toHaveBeenCalledWith('me', 7.2, 15.15);
	});

	it('view mode has no buttons; heat mode marks the root', async () => {
		const screen = render(CourtMap, { markers, heat: true });
		expect(screen.container.querySelectorAll('[role="button"]').length).toBe(0);
		expect(screen.container.querySelector('.db-court-map')?.hasAttribute('data-heat')).toBe(true);
	});
});
