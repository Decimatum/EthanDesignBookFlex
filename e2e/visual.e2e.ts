import { test, expect } from '@playwright/test';
import { visualRoutes } from './routes.js';

/**
 * Screenshot baselines for every component, flow and pattern page.
 *
 * Matrix: per theme, light/comfortable and dark/compact (6 baselines per page). Scheme and
 * density are orthogonal axes, so the two combinations cover both schemes and both densities
 * without the 9-combo product.
 *
 * Each page captures only its content surface (`main#main`), not the docs sidebar/header, so
 * adding a page to the nav does not change every other page's baseline. The docs shell itself
 * (header, sidebar, nav) is baselined once per combo as a full-page capture of the home page.
 *
 * Run a subset with E2E_ROUTES (see routes.ts). Update deliberately with
 * `npm run test:visual:update`, which rewrites only the baselines that changed.
 */
const themes = ['slate', 'folio', 'terminal'] as const;
const combos = [
	['light', 'comfortable'],
	['dark', 'compact']
] as const;

for (const route of visualRoutes) {
	// '/' (the docs shell baseline) is captured below, full page.
	if (route === '/') continue;
	const name = route.replaceAll('/', '_').replace(/^_|_$/g, '');
	for (const theme of themes) {
		for (const [scheme, density] of combos) {
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
				// visual-content.css hides the sticky shell header, which would otherwise overlap
				// the top of the element capture; the shell has its own shell-* baselines.
				await expect(page.locator('main#main')).toHaveScreenshot(
					`${name}-${theme}-${scheme}-${density}.png`,
					{ stylePath: new URL('./visual-content.css', import.meta.url).pathname }
				);
			});
		}
	}
}

// The docs shell: header, sidebar nav, brand, theme switcher — one full-page baseline per combo.
for (const theme of themes) {
	for (const [scheme, density] of combos) {
		if (!visualRoutes.includes('/')) break;
		test(`@visual / [${theme}/${scheme}/${density}]`, async ({ page }) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.addInitScript(
				(settings) => localStorage.setItem('designbook:theme', JSON.stringify(settings)),
				{ theme, scheme, density }
			);
			await page.goto('/');
			await page.evaluate(() => document.fonts.ready);
			await expect(page).toHaveScreenshot(`shell-${theme}-${scheme}-${density}.png`, {
				fullPage: true
			});
		});
	}
}
