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

	it('sizes rows from content when it is a flex item (Chrome intrinsic-size quirk)', async () => {
		// Four 36px items in a 600px-wide, centre-aligned flex container with min="10rem" → 3 columns, 2 rows.
		const four = createRawSnippet(() => ({
			render: () =>
				'<div style="display:contents"><div style="height:36px">a</div><div style="height:36px">b</div><div style="height:36px">c</div><div style="height:36px">d</div></div>'
		}));
		const screen = render(Grid, { min: '10rem', gap: '0', children: four });
		screen.container.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;width:600px';
		await expect.element(screen.getByText('a')).toBeVisible();
		const el = screen.container.querySelector('.db-grid') as HTMLElement;
		// Without a definite width Chrome laid the rows out as if there were one column (144px).
		expect(el.getBoundingClientRect().height).toBe(72);
	});
});
