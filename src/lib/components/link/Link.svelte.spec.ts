import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Link from './Link.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Docs</span>' }));

describe('Link', () => {
	it('renders an accent underlined link by default', async () => {
		const screen = render(Link, { href: '/docs', children: label });
		const a = screen.getByRole('link', { name: 'Docs' });
		await expect.element(a).toHaveAttribute('href', '/docs');
		await expect.element(a).toHaveAttribute('data-tone', 'accent');
		expect(a.element().hasAttribute('target')).toBe(false);
	});

	it('marks external links safely and announces the new tab', async () => {
		const screen = render(Link, { href: 'https://example.com', children: label, external: true });
		const a = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
		await expect.element(a).toHaveAttribute('target', '_blank');
		await expect.element(a).toHaveAttribute('rel', 'noopener noreferrer');
		expect(screen.container.querySelector('.db-link__icon svg')).not.toBeNull();
	});

	it('lets explicit target/rel win and supports tones', async () => {
		const screen = render(Link, {
			props: {
				href: '/x',
				children: label,
				external: true,
				target: '_self',
				rel: 'me',
				tone: 'muted',
				subtle: true
			}
		});
		const a = screen.getByRole('link');
		await expect.element(a).toHaveAttribute('target', '_self');
		await expect.element(a).toHaveAttribute('rel', 'me');
		await expect.element(a).toHaveAttribute('data-tone', 'muted');
		await expect.element(a).toHaveAttribute('data-subtle');
	});
});
