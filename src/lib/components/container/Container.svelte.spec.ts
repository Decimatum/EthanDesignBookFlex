import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Container from './Container.svelte';

const kids = createRawSnippet(() => ({ render: () => '<span>content</span>' }));

describe('Container', () => {
	it('defaults to lg, padded, centred', async () => {
		const screen = render(Container, { children: kids });
		const el = screen.container.querySelector('.db-container') as HTMLElement;
		await expect.element(screen.getByText('content')).toBeVisible();
		expect(el).toHaveAttribute('data-size', 'lg');
		expect(el).toHaveAttribute('data-padded');
	});

	it('renders as main with full size and no padding', () => {
		const screen = render(Container, { as: 'main', size: 'full', padded: false, children: kids });
		const el = screen.container.querySelector('main.db-container') as HTMLElement;
		expect(el).toHaveAttribute('data-size', 'full');
		expect(el).not.toHaveAttribute('data-padded');
	});
});
