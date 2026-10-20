import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Delta from './Delta.svelte';

const root = (s: ReturnType<typeof render>) =>
	s.container.querySelector('.db-delta') as HTMLElement;

describe('Delta', () => {
	it('formats sign, percent and currency, and announces direction', () => {
		let s = render(Delta, { value: 3.456, format: 'percent' });
		expect(root(s).querySelector('.db-delta__value')?.textContent).toBe('+3.46%');
		expect(root(s)).toHaveAttribute('data-tone', 'positive');
		expect(root(s).textContent).toContain(', up');

		s = render(Delta, { value: -1250, format: 'currency', currency: 'USD', locale: 'en-US' });
		expect(root(s).querySelector('.db-delta__value')?.textContent).toBe('−$1,250.00');
		expect(root(s)).toHaveAttribute('data-tone', 'negative');

		s = render(Delta, { value: 0, digits: 0 });
		expect(root(s).querySelector('.db-delta__value')?.textContent).toBe('0');
		expect(root(s)).toHaveAttribute('data-tone', 'neutral');
		expect(root(s).textContent).toContain('unchanged');
	});

	it('invert flips the tone but not the direction', () => {
		const s = render(Delta, { value: 5, invert: true, format: 'percent' });
		expect(root(s)).toHaveAttribute('data-direction', 'up');
		expect(root(s)).toHaveAttribute('data-tone', 'negative');
	});

	it('supports pill variant and no arrow', () => {
		const s = render(Delta, { value: 2, variant: 'pill', arrow: false, size: 'sm' });
		expect(root(s)).toHaveAttribute('data-variant', 'pill');
		expect(root(s).querySelector('.db-delta__arrow')).toBeNull();
	});
});
