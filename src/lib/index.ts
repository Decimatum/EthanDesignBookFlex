/**
 * @ethan/designbook — public API.
 *
 * Styles are imported separately (they are CSS, not JS):
 *   import '@ethan/designbook/styles';   // tokens + reset + typography
 *   import '@ethan/designbook/fonts';    // self-hosted fonts for all themes (optional)
 */

// Theme
export {
	theme,
	applyTheme,
	themeInitScript,
	THEMES,
	SCHEMES,
	DENSITIES,
	DEFAULT_THEME,
	STORAGE_KEY,
	type Theme,
	type Scheme,
	type Density,
	type ThemeSettings
} from './theme/theme.svelte.js';

// Utils & shared types
export * from './utils/index.js';
export * from './types.js';

// Components
export * from './components/button/index.js';
export * from './components/spinner/index.js';
export * from './components/stack/index.js';
export * from './components/inline/index.js';
export * from './components/grid/index.js';
export * from './components/container/index.js';
export * from './components/divider/index.js';
export * from './components/text/index.js';
export * from './components/heading/index.js';
export * from './components/badge/index.js';
export * from './components/card/index.js';
export * from './components/avatar/index.js';
export * from './components/skeleton/index.js';
export * from './components/field/index.js';
export * from './components/input/index.js';
export * from './components/textarea/index.js';
export * from './components/checkbox/index.js';
export * from './components/radio/index.js';
export * from './components/switch/index.js';
export * from './components/dialog/index.js';
export * from './components/popover/index.js';
export * from './components/tooltip/index.js';
export * from './components/menu/index.js';
export * from './components/select/index.js';
export * from './components/tabs/index.js';
export * from './components/alert/index.js';
export * from './components/toast/index.js';
