import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Inline from './Inline.svelte';

const kids = createRawSnippet(() => ({
	render: () => '<div><span>first</span><span>second</span></div>'
}));

describe('Inline', () => {
	it('renders a wrapping row', async () => {
		const screen = render(Inline, { children: kids });
		const el = screen.container.querySelector('.db-inline') as HTMLElement;
		await expect.element(screen.getByText('second')).toBeVisible();
		expect(getComputedStyle(el).flexDirection).toBe('row');
		expect(el.style.flexWrap).toBe('wrap');
	});

	it('can disable wrapping and set justify', () => {
		const screen = render(Inline, { wrap: false, justify: 'end', children: kids });
		const el = screen.container.querySelector('.db-inline') as HTMLElement;
		expect(el.style.flexWrap).toBe('nowrap');
		expect(el.style.justifyContent).toBe('flex-end');
	});
});
