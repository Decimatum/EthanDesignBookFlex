import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Badge from './Badge.svelte';

const kids = createRawSnippet(() => ({ render: () => '<span>New</span>' }));

describe('Badge', () => {
	it('renders with defaults', async () => {
		const screen = render(Badge, { children: kids });
		const el = screen.container.querySelector('.db-badge') as HTMLElement;
		await expect.element(screen.getByText('New')).toBeVisible();
		expect(el).toHaveAttribute('data-variant', 'soft');
		expect(el).toHaveAttribute('data-tone', 'neutral');
	});

	it('reflects variant, tone, size, pill and dot', () => {
		const screen = render(Badge, {
			variant: 'solid',
			tone: 'success',
			size: 'sm',
			pill: true,
			dot: true,
			children: kids
		});
		const el = screen.container.querySelector('.db-badge') as HTMLElement;
		expect(el).toHaveAttribute('data-variant', 'solid');
		expect(el).toHaveAttribute('data-tone', 'success');
		expect(el).toHaveAttribute('data-size', 'sm');
		expect(el).toHaveAttribute('data-pill');
		expect(el.querySelector('.db-badge__dot')).not.toBeNull();
	});
});
