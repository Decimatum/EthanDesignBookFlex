import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Progress from './Progress.svelte';

describe('Progress', () => {
	it('exposes a labelled progressbar with the clamped value', async () => {
		const screen = render(Progress, { value: 140, label: 'Upload', showValue: true });
		const bar = screen.getByRole('progressbar', { name: 'Upload' });
		await expect.element(bar).toHaveAttribute('aria-valuenow', '100');
		await expect.element(bar).toHaveAttribute('aria-valuemax', '100');
		await expect.element(screen.getByText('100%')).toBeVisible();
		expect((screen.container.querySelector('.db-progress__bar') as HTMLElement).style.width).toBe(
			'100%'
		);
	});

	it('is indeterminate without a value and falls back to a generic name', async () => {
		const screen = render(Progress, { tone: 'success' });
		const bar = screen.getByRole('progressbar', { name: 'Progress' });
		await expect.element(bar).toHaveAttribute('data-indeterminate');
		expect(bar.element().hasAttribute('aria-valuenow')).toBe(false);
		expect(screen.container.querySelector('.db-progress')?.getAttribute('data-tone')).toBe(
			'success'
		);
	});

	it('uses a custom aria-label only on the progressbar', () => {
		const screen = render(Progress, { value: 20, 'aria-label': 'Sync' });
		expect(screen.container.querySelector('.db-progress')?.hasAttribute('aria-label')).toBe(false);
		expect(screen.getByRole('progressbar', { name: 'Sync' }).elements()).toHaveLength(1);
	});
});
