import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Calendar from './Calendar.svelte';

describe('Calendar', () => {
	it('shows the month of the value with the value selected', async () => {
		const screen = render(Calendar, { value: '2026-10-13', today: '2026-10-13' });
		expect(screen.container.querySelector('.db-calendar__heading')?.textContent).toContain(
			'October 2026'
		);
		const selected = screen.container.querySelector('.db-calendar__day[data-selected]');
		expect(selected?.textContent?.trim()).toBe('13');
	});

	it('reports a new ISO value when a day is clicked', async () => {
		const onValueChange = vi.fn();
		const screen = render(Calendar, { value: '2026-10-13', today: '2026-10-13', onValueChange });
		const days = screen.container.querySelectorAll<HTMLElement>(
			'.db-calendar__day:not([data-outside-month])'
		);
		const twentieth = Array.from(days).find((d) => d.textContent?.trim() === '20');
		twentieth?.click();
		await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith('2026-10-20'));
	});

	it('draws marks and describes them', async () => {
		const screen = render(Calendar, {
			value: '2026-10-13',
			today: '2026-10-13',
			marks: { '2026-10-13': [{ label: 'night entry' }, { tone: 'success', label: 'padel' }] }
		});
		const day = screen.container.querySelector('.db-calendar__day[data-selected]');
		expect(day?.querySelectorAll('.db-calendar__mark').length).toBe(2);
		expect(day?.getAttribute('aria-description')).toBe('night entry, padel');
	});
});
