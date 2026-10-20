import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Rating from './Rating.svelte';

describe('Rating', () => {
	it('renders one radio per step and marks the value', async () => {
		const screen = render(Rating, { value: 3, 'aria-label': 'Energy' });
		const group = screen.getByRole('radiogroup', { name: 'Energy' });
		await expect.element(group).toBeVisible();
		await expect
			.element(screen.getByRole('radio', { name: '3' }))
			.toHaveAttribute('aria-checked', 'true');
		await expect
			.element(screen.getByRole('radio', { name: '4' }))
			.toHaveAttribute('aria-checked', 'false');
	});

	it('sets on click, clears when the current step is clicked again', async () => {
		const onchange = vi.fn();
		const screen = render(Rating, { onchange, 'aria-label': 'Mood' });
		await screen.getByRole('radio', { name: '4' }).click();
		expect(onchange).toHaveBeenLastCalledWith(4);
		await screen.getByRole('radio', { name: '4' }).click();
		expect(onchange).toHaveBeenLastCalledWith(0);
	});

	it('uses step labels in the accessible name', async () => {
		const screen = render(Rating, {
			labels: ['Drained', 'Low', 'Okay', 'Good', 'Full'],
			'aria-label': 'Energy'
		});
		await expect.element(screen.getByRole('radio', { name: '3 — Okay' })).toBeVisible();
	});

	it('takes no input when readonly', async () => {
		const onchange = vi.fn();
		const screen = render(Rating, { value: 2, readonly: true, onchange, 'aria-label': 'Score' });
		await screen.getByRole('radio', { name: '5' }).click();
		expect(onchange).not.toHaveBeenCalled();
	});

	it('disables every step when disabled', async () => {
		const screen = render(Rating, { value: 2, disabled: true, 'aria-label': 'Off' });
		await expect.element(screen.getByRole('radio', { name: '1' })).toBeDisabled();
	});
});
