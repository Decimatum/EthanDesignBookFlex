#!/usr/bin/env node
/**
 * Run the e2e suites only for the routes affected by uncommitted changes.
 *
 *   npm run test:changed                 a11y + visual for affected routes
 *   npm run test:changed -- --grep @visual
 *   npm run test:changed -- origin/main  diff against a ref instead of HEAD
 *
 * Prints the route list first so it can be sanity-checked. If nothing routable changed, exits 0
 * without starting Playwright.
 */
import { execFileSync, spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const ref = args.find((a) => !a.startsWith('-')) ?? 'HEAD';
const pwArgs = args.filter((a) => a !== ref);

const routes = execFileSync(process.execPath, ['scripts/changed-routes.js', ref], {
	encoding: 'utf8'
}).trim();

if (!routes) {
	console.log('changed-routes: no docs route is affected by the current changes — nothing to run.');
	process.exit(0);
}
console.log(`changed-routes: E2E_ROUTES=${routes}`);
const r = spawnSync('npx', ['playwright', 'test', ...pwArgs], {
	stdio: 'inherit',
	env: { ...process.env, E2E_ROUTES: routes },
	shell: process.platform === 'win32'
});
process.exit(r.status ?? 1);
