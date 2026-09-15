import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Text from './Text.svelte';

const kids = createRawSnippet(() => ({ render: () => '<span>Hello</span>' }));

describe('Text', () => {
	it('renders a paragraph with defaults', async () => {
		const screen = render(Text, { children: kids });
		const el = screen.container.querySelector('p.db-text') as HTMLElement;
		await expect.element(screen.getByText('Hello')).toBeVisible();
		expect(el).toHaveAttribute('data-size', 'md');
		expect(el).toHaveAttribute('data-tone', 'default');
	});

	it('reflects size, weight, tone and modifiers', () => {
		const screen = render(Text, {
			as: 'span',
			size: 'sm',
			weight: 'semibold',
			tone: 'muted',
			numeric: true,
			truncate: true,
			children: kids
		});
		const el = screen.container.querySelector('span.db-text') as HTMLElement;
		expect(el).toHaveAttribute('data-size', 'sm');
		expect(el).toHaveAttribute('data-weight', 'semibold');
		expect(el).toHaveAttribute('data-tone', 'muted');
		expect(el).toHaveAttribute('data-numeric');
		expect(el).toHaveAttribute('data-truncate');
	});

	it('clamps lines', () => {
		const screen = render(Text, { lines: 2, children: kids });
		const el = screen.container.querySelector('.db-text') as HTMLElement;
		expect(el).toHaveAttribute('data-clamp');
		expect(el.style.getPropertyValue('--_lines')).toBe('2');
	});

	it('resets to the default colour when nested inside a toned Text', () => {
		const inner = createRawSnippet(() => ({
			render: () => '<span data-testid="inner">inner</span>'
		}));
		const screen = render(Text, { tone: 'danger', children: inner });
		const outer = screen.container.querySelector('.db-text') as HTMLElement;
		// simulate a nested default Text by rendering one into the outer element
		const nested = document.createElement('p');
		nested.className = outer.className;
		nested.dataset.tone = 'default';
		outer.appendChild(nested);
		expect(getComputedStyle(nested).color).not.toBe(getComputedStyle(outer).color);
	});
});
