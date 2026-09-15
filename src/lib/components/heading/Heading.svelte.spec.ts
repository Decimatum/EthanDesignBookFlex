import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Heading from './Heading.svelte';

const kids = createRawSnippet(() => ({ render: () => '<span>Title</span>' }));

describe('Heading', () => {
	it('renders the semantic level with a default size', async () => {
		const screen = render(Heading, { level: 1, children: kids });
		const el = screen.getByRole('heading', { level: 1 });
		await expect.element(el).toBeVisible();
		await expect.element(el).toHaveAttribute('data-size', 'xl');
	});

	it('decouples visual size from level', async () => {
		const screen = render(Heading, { level: 3, size: 'display', children: kids });
		const el = screen.getByRole('heading', { level: 3 });
		await expect.element(el).toHaveAttribute('data-size', 'display');
	});

	it('supports plain and truncate modifiers', () => {
		const screen = render(Heading, { plain: true, truncate: true, children: kids });
		const el = screen.container.querySelector('.db-heading') as HTMLElement;
		expect(el).toHaveAttribute('data-plain');
		expect(el).toHaveAttribute('data-truncate');
	});
});
