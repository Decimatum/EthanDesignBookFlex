import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Grid from './Grid.svelte';

const kids = createRawSnippet(() => ({
	render: () => '<div><span>first</span><span>second</span></div>'
}));

describe('Grid', () => {
	it('builds a fixed column template from a number', async () => {
		const screen = render(Grid, { columns: 3, children: kids });
		const el = screen.container.querySelector('.db-grid') as HTMLElement;
		await expect.element(screen.getByText('first')).toBeVisible();
		expect(el.style.gridTemplateColumns).toMatch(/^repeat\(3, minmax\(0(px)?, 1fr\)\)$/);
	});

	it('builds an auto-fit template from min', () => {
		const screen = render(Grid, { min: '12rem', children: kids });
		const el = screen.container.querySelector('.db-grid') as HTMLElement;
		expect(el.style.gridTemplateColumns).toContain('auto-fit');
		expect(el.style.gridTemplateColumns).toContain('12rem');
	});

	it('passes raw template strings through', () => {
		const screen = render(Grid, { columns: '1fr 2fr', children: kids });
		const el = screen.container.querySelector('.db-grid') as HTMLElement;
		expect(el.style.gridTemplateColumns).toBe('1fr 2fr');
	});
});
