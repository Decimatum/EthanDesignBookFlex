import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Checkbox from './Checkbox.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Accept terms</span>' }));

describe('Checkbox', () => {
	it('renders a labelled native checkbox and toggles on click', async () => {
		const screen = render(Checkbox, { children: label });
		const box = screen.getByRole('checkbox', { name: 'Accept terms' });
		await expect.element(box).not.toBeChecked();
		await screen.getByText('Accept terms').click();
		await expect.element(box).toBeChecked();
	});

	it('supports indeterminate, description, disabled and invalid', async () => {
		const screen = render(Checkbox, {
			children: label,
			indeterminate: true,
			description: 'Some selected',
			disabled: true,
			invalid: true
		});
		const input = screen.container.querySelector('input') as HTMLInputElement;
		expect(input.indeterminate).toBe(true);
		expect(input).toHaveAttribute('aria-checked', 'mixed');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		await expect.element(screen.getByText('Some selected')).toBeVisible();
		expect(screen.container.querySelector('.db-checkbox')).toHaveAttribute('data-invalid');
	});

	it('starts checked when told to', async () => {
		const screen = render(Checkbox, { children: label, checked: true });
		await expect.element(screen.getByRole('checkbox')).toBeChecked();
	});
});
