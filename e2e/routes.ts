import { nav, allRoutes } from '../src/docs/nav.js';

/**
 * Route selection shared by the a11y and visual suites.
 *
 * Default: every page. Set E2E_ROUTES to run a subset and keep a dev loop cheap:
 *   E2E_ROUTES=button,input npm run test:visual        substrings matched against the route
 *   E2E_ROUTES=/components/button/,/ npm run test:a11y  values starting with '/' match exactly
 *   E2E_ROUTES=all                                     explicit full run
 * `npm run test:changed` computes the list from `git diff` (scripts/changed-routes.js).
 */
function select(routes: string[]): string[] {
	const raw = process.env.E2E_ROUTES?.trim();
	if (!raw || raw === 'all') return routes;
	const wanted = raw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	// A value starting with '/' is a route and must match exactly; anything else is a substring.
	const picked = routes.filter((r) =>
		wanted.some((w) => (w.startsWith('/') ? r === w : r.includes(w)))
	);
	if (picked.length === 0) {
		throw new Error(
			`E2E_ROUTES="${raw}" matched no routes. Known routes:\n  ${routes.join('\n  ')}`
		);
	}
	return picked;
}

/** Every docs page (home + foundations + flow + patterns + components). */
export const a11yRoutes = select(allRoutes);

/** Component, flow and pattern pages plus '/' (the docs shell) — the ones with screenshot baselines. */
export const visualRoutes = select([
	'/',
	...nav
		.filter((s) => s.title === 'Components' || s.title === 'Flow' || s.title === 'Patterns')
		.flatMap((s) => s.items.map((i) => i.href))
]);
