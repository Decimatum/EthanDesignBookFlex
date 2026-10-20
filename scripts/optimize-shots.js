#!/usr/bin/env node
/**
 * Losslessly shrink screenshot baselines with oxipng (pixels are untouched, so Playwright's
 * comparison is unaffected; typically ~25% smaller than what Playwright writes).
 *
 *   npm run shots:optimize                 every baseline
 *   npm run shots:optimize -- file.png …   only these files (e.g. the ones `-u` just rewrote)
 *
 * oxipng is not a dependency of this repo: the npm package only ships x64 binaries and the
 * machine that holds the checkout is arm64. It is used when found on PATH or in
 * node_modules/.bin (on the machine that runs Playwright: `npm i --no-save oxipng-bin`),
 * otherwise this script explains and exits 0 — skipping is harmless.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dir = join(root, 'e2e/__screenshots__');

function walk(d) {
	let out = [];
	for (const name of readdirSync(d)) {
		const p = join(d, name);
		if (statSync(p).isDirectory()) out = out.concat(walk(p));
		else if (name.endsWith('.png')) out.push(p);
	}
	return out;
}

const files = process.argv.length > 2 ? process.argv.slice(2) : existsSync(dir) ? walk(dir) : [];
if (files.length === 0) {
	console.log('optimize-shots: no baselines found.');
	process.exit(0);
}

const local = join(root, 'node_modules/.bin/oxipng');
const bin = existsSync(local) ? local : 'oxipng';
const probe = spawnSync(bin, ['--version'], { encoding: 'utf8' });
if (probe.error || probe.status !== 0) {
	console.log(
		'optimize-shots: oxipng not found — skipping (harmless). On the machine that runs Playwright:\n' +
			'  npm i --no-save oxipng-bin && npm run shots:optimize'
	);
	process.exit(0);
}

const before = files.reduce((n, f) => n + statSync(f).size, 0);
// -o 2 is within a few percent of -o 4 on these images and several times faster.
const r = spawnSync(bin, ['-o', '2', '--strip', 'safe', '-q', ...files], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
const after = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(
	`optimize-shots: ${files.length} files, ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB (${Math.round((100 * after) / before)}%)`
);
