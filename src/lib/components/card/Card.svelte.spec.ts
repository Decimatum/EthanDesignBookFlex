import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Card from './Card.svelte';

const body = createRawSnippet(() => ({ render: () => '<p>Body</p>' }));
const head = createRawSnippet(() => ({ render: () => '<span>Head</span>' }));
const foot = createRawSnippet(() => ({ render: () => '<span>Foot</span>' }));

describe('Card', () => {
	it('renders body with defaults', async () => {
		const screen = render(Card, { children: body });
		const el = screen.container.querySelector('.db-card') as HTMLElement;
		await expect.element(screen.getByText('Body')).toBeVisible();
		expect(el).toHaveAttribute('data-variant', 'outlined');
		expect(el).toHaveAttribute('data-padding', 'md');
		expect(el.querySelector('.db-card__header')).toBeNull();
	});

	it('renders header and footer sections', async () => {
		const screen = render(Card, { header: head, footer: foot, children: body });
		await expect.element(screen.getByText('Head')).toBeVisible();
		await expect.element(screen.getByText('Foot')).toBeVisible();
	});

	it('becomes an interactive link with href', async () => {
		const screen = render(Card, { href: '/x', children: body });
		const link = screen.getByRole('link');
		await expect.element(link).toHaveAttribute('href', '/x');
		await expect.element(link).toHaveAttribute('data-interactive');
	});
});
