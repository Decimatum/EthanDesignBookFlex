import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Skeleton from './Skeleton.svelte';

describe('Skeleton', () => {
	it('renders text lines, last one shorter, hidden from assistive tech', () => {
		const screen = render(Skeleton, { lines: 3 });
		const el = screen.container.querySelector('.db-skeleton') as HTMLElement;
		expect(el).toHaveAttribute('aria-hidden', 'true');
		const lines = el.querySelectorAll('.db-skeleton__line');
		expect(lines).toHaveLength(3);
		expect(lines[2]).toHaveAttribute('data-last');
	});

	it('renders rect and circle variants with explicit dimensions', () => {
		const screen = render(Skeleton, { variant: 'circle', width: '3rem', height: '3rem' });
		const el = screen.container.querySelector('.db-skeleton') as HTMLElement;
		expect(el).toHaveAttribute('data-variant', 'circle');
		expect(el.style.width).toBe('3rem');
		expect(el.querySelector('.db-skeleton__line')).toBeNull();
	});
});
