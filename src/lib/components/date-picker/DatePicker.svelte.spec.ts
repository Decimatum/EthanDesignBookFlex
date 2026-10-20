import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DatePicker from './DatePicker.svelte';

describe('DatePicker', () => {
	it('renders the value as segments and a calendar trigger', async () => {
		const screen = render(DatePicker, { value: '2026-10-13', 'aria-label': 'Due on' });
		await expect.element(screen.getByRole('button', { name: 'Open calendar' })).toBeVisible();
		const text =
			screen.container.querySelector('.db-date-picker')?.textContent?.replace(/\s+/g, '') ?? '';
		expect(text).toContain('2026');
		expect(text).toContain('13');
	});

	it('opens the calendar and reports an ISO value when a day is picked', async () => {
		const onValueChange = vi.fn();
		const screen = render(DatePicker, {
			value: '2026-10-13',
			today: '2026-10-13',
			onValueChange,
			'aria-label': 'Due on'
		});
		await screen.getByRole('button', { name: 'Open calendar' }).click();
		await vi.waitFor(() =>
			expect(
				document.querySelector('.db-date-picker__calendar .db-calendar__heading')?.textContent
			).toContain('October 2026')
		);
		const days = document.querySelectorAll<HTMLElement>(
			'.db-date-picker__calendar .db-calendar__day:not([data-outside-month])'
		);
		Array.from(days)
			.find((d) => d.textContent?.trim() === '21')
			?.click();
		await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith('2026-10-21'));
	});

	it('is disabled as a whole when disabled', async () => {
		const screen = render(DatePicker, { value: '2026-10-13', disabled: true, 'aria-label': 'Off' });
		await expect.element(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled();
	});
});
