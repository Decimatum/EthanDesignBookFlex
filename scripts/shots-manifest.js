#!/usr/bin/env node
/**
 * Hash manifest of the screenshot baselines, so two copies of the repo (e.g. the machine that
 * ran Playwright and the one that holds the git checkout) can sync only the files that differ
 * instead of shipping all baselines every time.
 *
 *   node scripts/shots-manifest.js > shots.manifest            write the manifest (use node, not
 *                                                              `npm run`, so no banner lands in it)
 *   node scripts/shots-manifest.js --diff other.manifest       list files that differ or are
 *                                                              missing on the other side
 *   node scripts/shots-manifest.js --diff other.manifest | tar czf changed.tgz -T -
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

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

const mine = new Map();
for (const p of walk(dir).sort()) {
	const hash = createHash('sha1').update(readFileSync(p)).digest('hex');
	mine.set(relative(root, p).replace(/\\/g, '/'), hash);
}

const diffIdx = process.argv.indexOf('--diff');
if (diffIdx === -1) {
	for (const [p, h] of mine) process.stdout.write(`${h}  ${p}\n`);
} else {
	const theirs = new Map(
		readFileSync(process.argv[diffIdx + 1], 'utf8')
			.split('\n')
			// Ignore anything that is not a hash line (e.g. npm's own banner when `npm run … > file`).
			.filter((l) => /^[0-9a-f]{40}\s+/.test(l))
			.map((l) => {
				const [h, ...rest] = l.split(/\s+/);
				return [rest.join(' '), h];
			})
	);
	for (const [p, h] of mine) if (theirs.get(p) !== h) process.stdout.write(`${p}\n`);
	const stale = [...theirs.keys()].filter((p) => !mine.has(p));
	if (stale.length)
		process.stderr.write(
			`# ${stale.length} baseline(s) exist only on the other side:\n# ${stale.join('\n# ')}\n`
		);
}
