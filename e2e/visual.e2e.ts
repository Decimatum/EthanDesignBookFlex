import { test, expect } from '@playwright/test';
import { nav } from '../src/docs/nav.js';

/**
 * Screenshot baselines for every component page.
 * Every theme × scheme is covered at comfortable density; compact density is covered once
 * per theme (dark) so density regressions are caught without tripling the baseline count.
 * Update deliberately with:  npm run test:visual:update
 */
const componentRoutes = nav.find((s) => s.title === 'Components')?.items.map((i) => i.href) ?? [];
const themes = ['slate', 'folio', 'terminal'] as const;
const schemes = ['light', 'dark'] as const;
const combos: Array<[string, string, string]> = [];
for (const theme of themes) {
	for (const scheme of schemes) combos.push([theme, scheme, 'comfortable']);
	combos.push([theme, 'dark', 'compact']);
}

for (const route of componentRoutes) {
	const name = route.replaceAll('/', '_').replace(/^_|_$/g, '');
	for (const [theme, scheme, density] of combos) {
		test(`@visual ${route} [${theme}/${scheme}/${density}]`, async ({ page }) => {
			// Zero the motion tokens so screenshots never sample a mid-transition colour.
			await page.emulateMedia({ reducedMotion: 'reduce' });
			// Seed the persisted theme so app.html's init script applies it before first paint
			// (setting data-* after navigation races hydration and made baselines order-dependent).
			await page.addInitScript(
				(settings) => localStorage.setItem('designbook:theme', JSON.stringify(settings)),
				{ theme, scheme, density }
			);
			await page.goto(route);
			await page.evaluate(() => document.fonts.ready);
			await expect(page).toHaveScreenshot(`${name}-${theme}-${scheme}-${density}.png`, {
				fullPage: true
			});
		});
	}
}
