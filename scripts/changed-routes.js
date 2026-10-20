#!/usr/bin/env node
/**
 * Work out which docs routes a set of changed files can affect, so the e2e suites can run on a
 * subset instead of every page. Prints a value for E2E_ROUTES (see e2e/routes.ts).
 *
 *   node scripts/changed-routes.js              changes vs HEAD (staged, unstaged, untracked)
 *   node scripts/changed-routes.js origin/main   changes vs another ref
 *   node scripts/changed-routes.js --files src/lib/components/button/Button.svelte ...
 *
 * Mapping:
 *   src/lib/components/<n>/   → /components/<n>/, every component/flow that depends on <n>
 *                               (from registry.json), and every pattern page (they compose
 *                               many components)
 *   src/lib/flow/<n>/         → /flow/<n>/ + dependants; app-shell and nav → all (docs shell)
 *   src/routes/<a>/<b>/       → /<a>/<b>/            src/routes/+page.svelte → /
 *   tokens, styles, theme, utils, types, app.html, root layout, src/docs (except nav.ts → /) → all
 *   tests, READMEs, scripts, config, e2e, *.md → nothing
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
let files;
if (args[0] === '--files') {
	files = args.slice(1);
} else {
	const ref = args[0] ?? 'HEAD';
	const run = (cmd) => execSync(cmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
	files = [
		...run(`git diff --name-only ${ref}`),
		...run('git ls-files --others --exclude-standard')
	];
}
files = [...new Set(files.map((f) => f.replace(/\\/g, '/')))];

const registry = JSON.parse(readFileSync(new URL('../registry.json', import.meta.url), 'utf8'));
const dependants = new Map(); // name → Set of names that import it
for (const c of registry.components) {
	for (const dep of c.dependencies) {
		if (!dependants.has(dep)) dependants.set(dep, new Set());
		dependants.get(dep).add(c.name);
	}
}
const kindOf = new Map(registry.components.map((c) => [c.name, c.kind]));
const routeFor = (name) => `/${kindOf.get(name) === 'flow' ? 'flow' : 'components'}/${name}/`;

const GLOBAL = [
	/^src\/lib\/tokens\//,
	/^src\/lib\/styles\//,
	/^src\/lib\/theme\//,
	/^src\/lib\/utils\//,
	/^src\/lib\/types\.ts$/,
	/^src\/app\.html$/,
	/^src\/routes\/\+layout/,
	/^src\/docs\/(?!nav\.ts$)/,
	/^src\/lib\/flow\/(app-shell|nav)\//
];
const IGNORE = [
	/\.(spec|test)\.[jt]s$/,
	/\.md$/,
	/^scripts\//,
	/^e2e\//,
	/^\.|^[^/]+\.(json|js|ts|cjs)$/
];

const routes = new Set();
let all = false;
for (const f of files) {
	if (IGNORE.some((re) => re.test(f))) continue;
	if (GLOBAL.some((re) => re.test(f))) {
		all = true;
		break;
	}
	let m;
	if ((m = f.match(/^src\/lib\/(components|flow)\/([a-z0-9-]+)\//))) {
		const name = m[2];
		routes.add(routeFor(name));
		for (const d of dependants.get(name) ?? []) routes.add(routeFor(d));
		for (const p of ['auth', 'checkout', 'dashboard', 'onboarding', 'settings'])
			routes.add(`/patterns/${p}/`);
	} else if ((m = f.match(/^src\/routes\/([a-z0-9-]+)\/([a-z0-9-]+)\//))) {
		routes.add(`/${m[1]}/${m[2]}/`);
	} else if (/^src\/routes\/\+page\.svelte$/.test(f) || f === 'src/docs/nav.ts') {
		// The nav only appears in the docs shell, which is baselined on '/'.
		routes.add('/');
	} else if (/^src\//.test(f)) {
		all = true; // something under src we don't understand: be safe
		break;
	}
}

const out = all ? 'all' : [...routes].sort().join(',');
process.stdout.write(out + '\n');
