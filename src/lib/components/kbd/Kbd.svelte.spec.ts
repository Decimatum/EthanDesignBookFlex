import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Kbd from './Kbd.svelte';

const isMac = /Mac|iPhone|iPad/.test(navigator.platform ?? '');

describe('Kbd', () => {
	it('renders a single key from children', () => {
		const screen = render(Kbd, {
			children: createRawSnippet(() => ({ render: () => '<span>Esc</span>' }))
		});
		const kbd = screen.container.querySelector('kbd.db-kbd');
		expect(kbd?.textContent?.trim()).toBe('Esc');
		expect(screen.container.querySelector('.db-kbd-group')).toBeNull();
	});

	it('splits a shortcut string into keys and maps platform glyphs', () => {
		const screen = render(Kbd, { keys: 'mod+shift+k', size: 'sm' });
		const keys = Array.from(screen.container.querySelectorAll('kbd'), (k) => k.textContent?.trim());
		expect(keys).toEqual([isMac ? '⌘' : 'Ctrl', '⇧', 'K']);
		expect(screen.container.querySelector('.db-kbd-group')).toHaveAttribute('data-size', 'sm');
	});

	it('leaves unknown multi-letter keys as written', () => {
		const screen = render(Kbd, { keys: 'ctrl+F5' });
		const keys = Array.from(screen.container.querySelectorAll('kbd'), (k) => k.textContent?.trim());
		expect(keys).toEqual(['Ctrl', 'F5']);
	});
});
