/**
 * Theme state — the three axes of the design system, applied as attributes on <html>.
 *
 *   data-theme   slate | folio | terminal      palette, type, radius, shadows
 *   data-scheme  light | dark | auto           colour scheme
 *   data-density comfortable | compact         spacing + control heights
 *
 * Usage (anywhere, SSR-safe):
 *   import { theme } from '@ethan/designbook';
 *   theme.set({ scheme: 'dark' });
 *   theme.current.theme  // 'slate'
 *
 * Add the inline script from `themeInitScript` to app.html to restore the
 * persisted choice before first paint.
 */

export const THEMES = ['slate', 'folio', 'terminal'] as const;
export const SCHEMES = ['light', 'dark', 'auto'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;

export type Theme = (typeof THEMES)[number];
export type Scheme = (typeof SCHEMES)[number];
export type Density = (typeof DENSITIES)[number];

export interface ThemeSettings {
	theme: Theme;
	scheme: Scheme;
	density: Density;
}

export const DEFAULT_THEME: ThemeSettings = {
	theme: 'slate',
	scheme: 'auto',
	density: 'comfortable'
};

export const STORAGE_KEY = 'designbook:theme';

const isBrowser = typeof document !== 'undefined';

function isOneOf<T extends readonly string[]>(list: T, v: unknown): v is T[number] {
	return typeof v === 'string' && (list as readonly string[]).includes(v);
}

/** Read whatever is currently on <html> (set by the init script), falling back to defaults. */
function readFromDocument(): ThemeSettings {
	if (!isBrowser) return { ...DEFAULT_THEME };
	const d = document.documentElement.dataset;
	return {
		theme: isOneOf(THEMES, d.theme) ? d.theme : DEFAULT_THEME.theme,
		scheme: isOneOf(SCHEMES, d.scheme) ? d.scheme : DEFAULT_THEME.scheme,
		density: isOneOf(DENSITIES, d.density) ? d.density : DEFAULT_THEME.density
	};
}

/** Apply settings to an element (normally document.documentElement). */
export function applyTheme(
	settings: ThemeSettings,
	el: HTMLElement | null = isBrowser ? document.documentElement : null
) {
	if (!el) return;
	el.dataset.theme = settings.theme;
	el.dataset.scheme = settings.scheme;
	el.dataset.density = settings.density;
}

class ThemeState {
	#settings = $state<ThemeSettings>(readFromDocument());

	/** Current settings (reactive). */
	get current(): ThemeSettings {
		return this.#settings;
	}

	/** Resolved scheme: turns 'auto' into 'light' | 'dark' using the OS preference. */
	get resolvedScheme(): 'light' | 'dark' {
		const s = this.#settings.scheme;
		if (s !== 'auto') return s;
		if (!isBrowser) return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	/** Update one or more axes; applies to <html> and persists. */
	set(partial: Partial<ThemeSettings>, { persist = true } = {}) {
		this.#settings = { ...this.#settings, ...partial };
		applyTheme(this.#settings);
		if (persist && isBrowser) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#settings));
			} catch {
				/* storage unavailable (private mode, etc.) — ignore */
			}
		}
	}

	/** Flip between light and dark (resolving 'auto' first). */
	toggleScheme() {
		this.set({ scheme: this.resolvedScheme === 'dark' ? 'light' : 'dark' });
	}

	/** Back to defaults and clear persistence. */
	reset() {
		this.set({ ...DEFAULT_THEME });
		if (isBrowser) {
			try {
				localStorage.removeItem(STORAGE_KEY);
			} catch {
				/* ignore */
			}
		}
	}
}

/** Singleton theme controller. */
export const theme = new ThemeState();

/**
 * Inline script for <head> that restores persisted settings before first paint.
 * SvelteKit users: it is already in src/app.html of this repo; copy it into your own app.html.
 */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
	STORAGE_KEY
)})||'{}');var d=document.documentElement;if(s.theme)d.dataset.theme=s.theme;if(s.scheme)d.dataset.scheme=s.scheme;if(s.density)d.dataset.density=s.density;}catch(e){}})();`;
