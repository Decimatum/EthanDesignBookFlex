import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Tag from './Tag.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Tech</span>' }));

describe('Tag', () => {
	it('renders a static tag with tone and size', () => {
		const screen = render(Tag, { children: label, tone: 'accent', size: 'sm' });
		const el = screen.container.querySelector('.db-tag') as HTMLElement;
		expect(el).toHaveAttribute('data-tone', 'accent');
		expect(el).toHaveAttribute('data-size', 'sm');
		expect(el.querySelector('button')).toBeNull();
		expect(el.textContent?.trim()).toBe('Tech');
	});

	it('adds a remove button that calls onRemove', async () => {
		const onRemove = vi.fn();
		const screen = render(Tag, { children: label, onRemove });
		await screen.getByRole('button', { name: 'Remove' }).click();
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it('becomes a pressable toggle when onSelect is given', async () => {
		const onSelect = vi.fn();
		const screen = render(Tag, { children: label, onSelect });
		const toggle = screen.getByRole('button', { name: 'Tech' });
		await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
		await toggle.click();
		await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
		expect(onSelect).toHaveBeenLastCalledWith(true);
		expect(screen.container.querySelector('.db-tag')).toHaveAttribute('data-selected');
	});

	it('disables both buttons', async () => {
		const onSelect = vi.fn();
		const screen = render(Tag, { children: label, onSelect, onRemove: vi.fn(), disabled: true });
		await expect.element(screen.getByRole('button', { name: 'Tech' })).toBeDisabled();
		await expect.element(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
	});
});
