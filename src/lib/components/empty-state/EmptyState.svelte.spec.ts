import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import EmptyState from './EmptyState.svelte';

const icon = createRawSnippet(() => ({ render: () => '<svg data-testid="icon"></svg>' }));
const actions = createRawSnippet(() => ({ render: () => '<button type="button">Add</button>' }));

describe('EmptyState', () => {
	it('renders title, description, icon and actions', async () => {
		const screen = render(EmptyState, {
			title: 'No positions',
			description: 'Open a trade to see it here.',
			icon,
			actions,
			size: 'lg'
		});
		await expect.element(screen.getByText('No positions')).toBeVisible();
		await expect.element(screen.getByText('Open a trade to see it here.')).toBeVisible();
		await expect.element(screen.getByRole('button', { name: 'Add' })).toBeVisible();
		const iconWrap = screen.container.querySelector('.db-empty-state__icon');
		expect(iconWrap?.getAttribute('aria-hidden')).toBe('true');
		expect(screen.container.querySelector('.db-empty-state')?.getAttribute('data-size')).toBe('lg');
	});

	it('omits optional parts and forwards rest attributes', () => {
		const screen = render(EmptyState, { title: 'Empty', 'data-testid': 'es' });
		expect(screen.container.querySelector('.db-empty-state__icon')).toBeNull();
		expect(screen.container.querySelector('.db-empty-state__description')).toBeNull();
		expect(screen.container.querySelector('.db-empty-state__actions')).toBeNull();
		expect(screen.getByTestId('es').elements()).toHaveLength(1);
	});
});
