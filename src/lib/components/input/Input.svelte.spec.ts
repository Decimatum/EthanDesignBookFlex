import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Input from './Input.svelte';

const icon = createRawSnippet(() => ({ render: () => '<svg data-testid="icon"></svg>' }));

describe('Input', () => {
	it('renders a text input with defaults', async () => {
		const screen = render(Input, { 'aria-label': 'Name' });
		const input = screen.getByRole('textbox', { name: 'Name' });
		await expect.element(input).toBeVisible();
		expect(screen.container.querySelector('.db-input')).toHaveAttribute('data-size', 'md');
	});

	it('binds value and accepts typing', async () => {
		const screen = render(Input, { 'aria-label': 'Name', value: 'Ada' });
		const input = screen.getByRole('textbox', { name: 'Name' });
		await expect.element(input).toHaveValue('Ada');
		await input.fill('Grace');
		await expect.element(input).toHaveValue('Grace');
	});

	it('reflects invalid, disabled, size, numeric and adornments', () => {
		const screen = render(Input, {
			'aria-label': 'Amount',
			invalid: true,
			disabled: true,
			size: 'lg',
			numeric: true,
			leading: icon,
			trailing: icon
		});
		const root = screen.container.querySelector('.db-input') as HTMLElement;
		const input = screen.container.querySelector('input') as HTMLInputElement;
		expect(root).toHaveAttribute('data-invalid');
		expect(root).toHaveAttribute('data-disabled');
		expect(root).toHaveAttribute('data-size', 'lg');
		expect(root).toHaveAttribute('data-numeric');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toBeDisabled();
		expect(root.querySelectorAll('[data-testid="icon"]')).toHaveLength(2);
	});

	it('forwards native attributes', () => {
		const screen = render(Input, { 'aria-label': 'Email', type: 'email', placeholder: 'x@y.z' });
		const input = screen.container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('type', 'email');
		expect(input).toHaveAttribute('placeholder', 'x@y.z');
	});

	it('draws a single focus ring on the wrapper, not the inner control', async () => {
		const screen = render(Input, { 'aria-label': 'Focus' });
		const input = screen.container.querySelector('input') as HTMLInputElement;
		input.focus();
		await expect.element(screen.getByRole('textbox')).toHaveFocus();
		expect(getComputedStyle(input).boxShadow).toBe('none');
		expect(getComputedStyle(input.parentElement!).boxShadow).not.toBe('none');
	});
});
