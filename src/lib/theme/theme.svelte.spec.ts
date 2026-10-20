import { afterEach, describe, expect, it } from 'vitest';
import { theme, applyTheme, DEFAULT_THEME, STORAGE_KEY } from './theme.svelte.js';

afterEach(() => theme.reset());

describe('theme controller', () => {
	it('applies all three axes to <html> and persists them', () => {
		theme.set({ theme: 'folio', scheme: 'dark', density: 'compact' });
		const d = document.documentElement.dataset;
		expect([d.theme, d.scheme, d.density]).toEqual(['folio', 'dark', 'compact']);
		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
			theme: 'folio',
			scheme: 'dark',
			density: 'compact'
		});
		theme.reset();
		expect(theme.current).toEqual(DEFAULT_THEME);
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it('resolves auto from the OS preference and toggles from the resolved value', () => {
		theme.set({ scheme: 'auto' });
		const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		expect(theme.resolvedScheme).toBe(osDark ? 'dark' : 'light');
		theme.toggleScheme();
		expect(theme.current.scheme).toBe(osDark ? 'light' : 'dark');
		expect(theme.resolvedScheme).toBe(theme.current.scheme);
	});

	it('can theme a subtree through applyTheme', () => {
		const el = document.createElement('div');
		applyTheme({ theme: 'terminal', scheme: 'light', density: 'comfortable' }, el);
		expect(el.dataset.theme).toBe('terminal');
		expect(document.documentElement.dataset.theme).not.toBe('terminal');
	});
});
