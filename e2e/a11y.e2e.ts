import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { allRoutes } from '../src/docs/nav.js';

/**
 * Every docs page is scanned with axe in every theme × scheme combination.
 * Adding a page to src/docs/nav.ts automatically adds it here.
 */
const themes = ['slate', 'folio', 'terminal'] as const;
const schemes = ['light', 'dark'] as const;

for (const route of allRoutes) {
	for (const theme of themes) {
		for (const scheme of schemes) {
			test(`@a11y ${route} [${theme}/${scheme}]`, async ({ page }) => {
				// Zero the motion tokens so axe never samples a mid-transition colour.
				await page.emulateMedia({ reducedMotion: 'reduce' });
				// Seed the persisted theme so app.html's init script applies it before first paint
				// (setting data-* after navigation races hydration and made results order-dependent).
				await page.addInitScript(
					(settings) => localStorage.setItem('designbook:theme', JSON.stringify(settings)),
					{ theme, scheme, density: 'comfortable' }
				);
				await page.goto(route);
				await page.evaluate(() => document.fonts.ready);

				const results = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
					.analyze();

				expect(
					results.violations,
					results.violations
						.map(
							(v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`
						)
						.join('\n')
				).toEqual([]);
			});
		}
	}
}
