import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Avatar, { initials } from './Avatar.svelte';

describe('Avatar', () => {
	it('computes initials', () => {
		expect(initials('Ada Lovelace')).toBe('AL');
		expect(initials('  grace ')).toBe('G');
		expect(initials('Jean-Luc Picard Junior')).toBe('JP');
		expect(initials(undefined)).toBe('');
	});

	it('renders initials with an accessible name when there is no image', async () => {
		const screen = render(Avatar, { name: 'Ada Lovelace' });
		const el = screen.getByRole('img', { name: 'Ada Lovelace' });
		await expect.element(el).toBeVisible();
		expect(screen.container.querySelector('.db-avatar__initials')?.textContent).toBe('AL');
	});

	it('renders an image when src is given', () => {
		const screen = render(Avatar, {
			name: 'Ada',
			src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw='
		});
		const img = screen.container.querySelector('img.db-avatar__img');
		expect(img).not.toBeNull();
		expect(img).toHaveAttribute('alt', '');
	});

	it('reflects size and shape', () => {
		const screen = render(Avatar, { name: 'X', size: 'xl', shape: 'square' });
		const el = screen.container.querySelector('.db-avatar') as HTMLElement;
		expect(el).toHaveAttribute('data-size', 'xl');
		expect(el).toHaveAttribute('data-shape', 'square');
	});
});
