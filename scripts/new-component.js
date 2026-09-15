#!/usr/bin/env node
/**
 * Scaffold a component folder, docs page and nav entry that follow CLAUDE.md conventions.
 *
 *   npm run new:component badge
 *   npm run new:component date-picker
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const raw = process.argv[2];
if (!raw) {
	console.error('Usage: npm run new:component <kebab-name>');
	process.exit(1);
}
const kebab = raw
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '');
const pascal = kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const root = process.cwd();
const dir = join(root, 'src/lib/components', kebab);
const docsDir = join(root, 'src/routes/components', kebab);

if (existsSync(dir)) {
	console.error(`Component already exists: ${dir}`);
	process.exit(1);
}
mkdirSync(dir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

const component = `<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type ${pascal}Size = 'sm' | 'md' | 'lg';

	export interface ${pascal}Props extends HTMLAttributes<HTMLDivElement> {
		size?: ${pascal}Size;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let { size = 'md', children, class: className, ...rest }: ${pascal}Props = $props();
</script>

<div {...rest} class={['db-${kebab}', className]} data-size={size}>
	{#if children}{@render children()}{/if}
</div>

<style>
	.db-${kebab} {
		/* Use semantic tokens only — see CLAUDE.md */
		color: var(--color-text);
	}
	.db-${kebab}[data-size='sm'] {
		font-size: var(--text-sm);
	}
	.db-${kebab}[data-size='md'] {
		font-size: var(--text-md);
	}
	.db-${kebab}[data-size='lg'] {
		font-size: var(--text-lg);
	}
</style>
`;

const spec = `import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import ${pascal} from './${pascal}.svelte';

const text = createRawSnippet(() => ({ render: () => '<span>Hello</span>' }));

describe('${pascal}', () => {
	it('renders children', async () => {
		const screen = render(${pascal}, { children: text });
		await expect.element(screen.getByText('Hello')).toBeVisible();
	});

	it('reflects size as a data attribute', async () => {
		const screen = render(${pascal}, { size: 'lg', children: text });
		expect(screen.container.querySelector('.db-${kebab}')).toHaveAttribute('data-size', 'lg');
	});
});
`;

const index = `export { default as ${pascal}, type ${pascal}Props, type ${pascal}Size } from './${pascal}.svelte';\n`;

const readme = `# ${pascal}

One paragraph: what it is for and when to use it (and when not to).

\`\`\`svelte
<script>
	import { ${pascal} } from '@ethan/designbook';
</script>

<${pascal}>Hello</${pascal}>
\`\`\`

## Props

| Prop    | Type                   | Default | Description |
| ------- | ---------------------- | ------- | ----------- |
| \`size\`  | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\`  |             |
| \`class\` | \`string\`               | —       | Extra classes on the root element. |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| \`children\` |             |

## Keyboard

| Key | Action |
| --- | ------ |

## Accessibility

-

## Tokens used

\`--color-text\`, \`--text-*\`

## Anatomy

\`\`\`
<div class="db-${kebab}" data-size>
\`\`\`
`;

const docsPage = `<script lang="ts">
	import { ${pascal} } from '$lib/index.js';
	import Demo from '$docs/Demo.svelte';
	import PropsTable from '$docs/PropsTable.svelte';
</script>

<h1>${pascal}</h1>
<p class="lead">One-sentence description.</p>

<Demo title="Basic" code={\`<${pascal}>Hello</${pascal}>\`}>
	<${pascal}>Hello</${pascal}>
</Demo>

<PropsTable rows={[{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" }]} />
`;

writeFileSync(join(dir, `${pascal}.svelte`), component);
writeFileSync(join(dir, `${pascal}.svelte.spec.ts`), spec);
writeFileSync(join(dir, 'index.ts'), index);
writeFileSync(join(dir, 'README.md'), readme);
writeFileSync(join(docsDir, '+page.svelte'), docsPage);

// Export from the barrel
const barrelPath = join(root, 'src/lib/index.ts');
const barrel = readFileSync(barrelPath, 'utf8');
const exportLine = `export * from './components/${kebab}/index.js';\n`;
if (!barrel.includes(exportLine)) writeFileSync(barrelPath, barrel.trimEnd() + '\n' + exportLine);

// Add to docs nav (Components section, alphabetical)
const navPath = join(root, 'src/docs/nav.ts');
let nav = readFileSync(navPath, 'utf8');
const entry = `{ title: '${pascal}', href: '/components/${kebab}/' }`;
if (!nav.includes(entry)) {
	nav = nav.replace(
		/(title: 'Components',\s*items: \[)([\s\S]*?)(\n\t\t\])/,
		(_, open, body, close) => {
			const items = body
				.split('\n')
				.map((l) => l.trim().replace(/,$/, ''))
				.filter(Boolean);
			items.push(entry);
			items.sort((a, b) => a.localeCompare(b));
			return open + '\n' + items.map((i) => `\t\t\t${i}`).join(',\n') + close;
		}
	);
	writeFileSync(navPath, nav);
}

console.log(`Created ${pascal}:
  ${dir}/${pascal}.svelte
  ${dir}/${pascal}.svelte.spec.ts
  ${dir}/README.md
  ${dir}/index.ts
  ${docsDir}/+page.svelte
Exported from src/lib/index.ts and added to src/docs/nav.ts.
Next: implement, then run  npm run check && npm run test:unit -- --run && npm run gen:docs`);
