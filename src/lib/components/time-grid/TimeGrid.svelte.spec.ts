import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TimeGrid from './TimeGrid.svelte';

const days = ['2026-10-19', '2026-10-20'];
const at = (d: string, h: number, m = 0) => {
	const [y, mo, da] = d.split('-').map(Number);
	return new Date(y, mo - 1, da, h, m);
};
const events = [
	{
		id: 'a',
		start: at(days[0], 9),
		end: at(days[0], 10),
		title: 'Ah Boy',
		meta: 'Swimming',
		tone: 'info' as const
	},
	{ id: 'b', start: at(days[0], 9, 30), end: at(days[0], 11), title: 'Mei Ling' },
	{ id: 'c', start: at(days[1], 18), end: at(days[1], 19), title: 'Raj', cancelled: true }
];

describe('TimeGrid', () => {
	it('renders a grid with a column per day and a button per event', async () => {
		const screen = render(TimeGrid, { days, events, hourFrom: 8, hourTo: 20, today: days[0] });
		await expect.element(screen.getByRole('grid', { name: 'Schedule' })).toBeVisible();
		await expect
			.element(screen.getByRole('button', { name: /Ah Boy, 9:00 AM to 10:00 AM, Swimming/ }))
			.toBeVisible();
		await expect
			.element(screen.getByRole('button', { name: /Raj.*cancelled/ }))
			.toHaveAttribute('data-cancelled');
	});

	it('lays overlapping events out side by side', async () => {
		const screen = render(TimeGrid, { days, events, hourFrom: 8, hourTo: 20 });
		const a = screen.getByRole('button', { name: /Ah Boy/ });
		const b = screen.getByRole('button', { name: /Mei Ling/ });
		await expect.element(a).toHaveAttribute('style', expect.stringContaining('--_lanes: 2'));
		await expect.element(b).toHaveAttribute('style', expect.stringContaining('--_lane: 1'));
	});

	it('reports selection and creation', async () => {
		const onSelect = vi.fn();
		const onCreate = vi.fn();
		const screen = render(TimeGrid, { days, events, hourFrom: 8, hourTo: 20, onSelect, onCreate });
		await screen.getByRole('button', { name: /Ah Boy/ }).click();
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }));
		await screen.getByRole('button', { name: /Add on Tuesday, 20 October at 8:30 AM/ }).click();
		expect(onCreate).toHaveBeenCalledWith('2026-10-20', '08:30');
	});

	it('is read-only without onCreate and hides the now line without now', async () => {
		const screen = render(TimeGrid, { days, events, hourFrom: 8, hourTo: 20 });
		await expect.element(screen.getByRole('button', { name: /^Add on/ })).not.toBeInTheDocument();
		expect(screen.container.querySelector('.db-time-grid__now')).toBeNull();
	});
});
