import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Stack from './Stack.svelte';

const kids = createRawSnippet(() => ({
	render: () => '<div><span>first</span><span>second</span></div>'
}));

describe('Stack', () => {
	it('renders a column flex container with the gap token', async () => {
		const screen = render(Stack, { gap: '6', children: kids });
		const el = screen.container.querySelector('.db-stack') as HTMLElement;
		await expect.element(screen.getByText('first')).toBeVisible();
		expect(getComputedStyle(el).flexDirection).toBe('column');
		expect(el.style.getPropertyValue('--_gap')).toBe('var(--space-6)');
	});

	it('renders the requested element and alignment', () => {
		const screen = render(Stack, { as: 'ul', align: 'center', justify: 'between', children: kids });
		const el = screen.container.querySelector('ul.db-stack') as HTMLElement;
		expect(el).not.toBeNull();
		expect(el.style.alignItems).toBe('center');
		expect(el.style.justifyContent).toBe('space-between');
	});
});
