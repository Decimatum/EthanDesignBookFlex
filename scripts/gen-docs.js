#!/usr/bin/env node
/**
 * Generates llms.txt (an index AI tools can read) and registry.json (component manifest used by
 * the copy-in CLI) from the component folders. Run after adding or changing a component.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const componentsDir = join(root, 'src/lib/components');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const components = readdirSync(componentsDir)
	.filter((name) => statSync(join(componentsDir, name)).isDirectory())
	.sort()
	.map((name) => {
		const dir = join(componentsDir, name);
		const readmePath = join(dir, 'README.md');
		const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
		const title = readme.match(/^#\s+(.+)$/m)?.[1] ?? name;
		const description =
			readme
				.split('\n')
				.slice(1)
				.find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('```'))
				?.trim() ?? '';
		const files = readdirSync(dir)
			.filter((f) => !f.includes('.spec.') && !f.includes('.test.'))
			.map((f) => relative(root, join(dir, f)));

		// Internal dependencies: other components imported via '../<name>/'
		const source = files
			.filter((f) => f.endsWith('.svelte') || f.endsWith('.ts'))
			.map((f) => readFileSync(join(root, f), 'utf8'))
			.join('\n');
		const internal = [
			...new Set([...source.matchAll(/from '\.\.\/([a-z0-9-]+)\//g)].map((m) => m[1]))
		];
		const external = [
			...new Set(
				[...source.matchAll(/from '((?:@[a-z0-9-]+\/)?[a-z0-9-]+)/g)]
					.map((m) => m[1])
					.filter((d) => d !== 'svelte' && !d.startsWith('.'))
			)
		];

		return { name, title, description, files, dependencies: internal, external };
	});

// ---- registry.json ----
const registry = {
	$schema: 'https://designbook.local/registry.schema.json',
	name: pkg.name,
	version: pkg.version,
	generated: new Date().toISOString(),
	shared: {
		tokens: ['src/lib/tokens'],
		styles: ['src/lib/styles'],
		utils: ['src/lib/utils/index.ts'],
		theme: ['src/lib/theme/theme.svelte.ts']
	},
	components
};
writeFileSync(join(root, 'registry.json'), JSON.stringify(registry, null, '\t') + '\n');

// ---- llms.txt ----
const lines = [
	`# ${pkg.name}`,
	'',
	`> ${pkg.description}`,
	'',
	'Svelte 5 component library with three themes (slate, folio, terminal), light/dark schemes and two densities, all driven by CSS custom properties. Components reference semantic tokens only.',
	'',
	'## Start here',
	'',
	'- [CLAUDE.md](CLAUDE.md): conventions, token rules, definition of done',
	'- [PLAN.md](PLAN.md): architecture and roadmap',
	'- [Tokens](src/lib/tokens/semantic.css): every semantic token a component may use',
	'- [Theme controller](src/lib/theme/theme.svelte.ts): theme / scheme / density API',
	'- [Registry](registry.json): machine-readable component manifest',
	'',
	'## Components',
	''
];
for (const c of components) {
	lines.push(`- [${c.title}](src/lib/components/${c.name}/README.md): ${c.description}`);
}
lines.push(
	'',
	'## Usage',
	'',
	'```svelte',
	"import '@ethan/designbook/styles';",
	"import { Button, theme } from '@ethan/designbook';",
	'```',
	''
);
writeFileSync(join(root, 'llms.txt'), lines.join('\n'));

console.log(`Wrote registry.json (${components.length} components) and llms.txt`);
