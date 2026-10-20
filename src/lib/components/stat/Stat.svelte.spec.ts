import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Stat from './Stat.svelte';

describe('Stat', () => {
	it('renders label, value, delta and hint', async () => {
		const screen = render(Stat, {
			label: 'Net liquidation',
			value: '$1.24M',
			delta: 1.8,
			hint: 'vs. yesterday'
		});
		await expect.element(screen.getByText('Net liquidation')).toBeVisible();
		await expect.element(screen.getByText('$1.24M')).toBeVisible();
		await expect.element(screen.getByText('vs. yesterday')).toBeVisible();
		expect(screen.container.querySelector('.db-delta')).toHaveAttribute('data-tone', 'positive');
		expect(screen.container.querySelector('.db-delta__value')?.textContent).toBe('+1.80%');
	});

	it('shows skeletons while loading and forwards extras', () => {
		const loading = render(Stat, { label: 'P&L', value: '—', hint: 'today', loading: true });
		expect(loading.container.querySelector('.db-stat')).toHaveAttribute('aria-busy', 'true');
		expect(loading.container.querySelectorAll('.db-skeleton')).toHaveLength(2);
		expect(loading.container.querySelector('.db-stat__value')).toBeNull();

		const extra = render(Stat, {
			label: 'Margin',
			value: '42%',
			deltaInvert: true,
			delta: 3,
			children: createRawSnippet(() => ({ render: () => '<div data-testid="extra">bar</div>' }))
		});
		expect(extra.container.querySelector('.db-delta')).toHaveAttribute('data-tone', 'negative');
		expect(extra.getByTestId('extra').elements()).toHaveLength(1);
	});
});
