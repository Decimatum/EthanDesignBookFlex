import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Button from './Button.svelte';

const label = (text: string) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }));
const icon = createRawSnippet(() => ({
	render: () => `<svg data-testid="icon" viewBox="0 0 24 24"></svg>`
}));

describe('Button', () => {
	it('renders a native button with its label and sensible defaults', async () => {
		const screen = render(Button, { children: label('Save') });
		const button = screen.getByRole('button', { name: 'Save' });

		await expect.element(button).toBeVisible();
		await expect.element(button).toHaveAttribute('type', 'button');
		await expect.element(button).toHaveAttribute('data-variant', 'solid');
		await expect.element(button).toHaveAttribute('data-tone', 'accent');
		await expect.element(button).toHaveAttribute('data-size', 'md');
	});

	it('reflects variant, tone and size as data attributes', async () => {
		const screen = render(Button, {
			variant: 'outline',
			tone: 'danger',
			size: 'lg',
			children: label('Delete')
		});
		const button = screen.getByRole('button', { name: 'Delete' });

		await expect.element(button).toHaveAttribute('data-variant', 'outline');
		await expect.element(button).toHaveAttribute('data-tone', 'danger');
		await expect.element(button).toHaveAttribute('data-size', 'lg');
	});

	it('calls onclick when clicked', async () => {
		const onclick = vi.fn();
		const screen = render(Button, { onclick, children: label('Go') });

		await screen.getByRole('button', { name: 'Go' }).click();
		expect(onclick).toHaveBeenCalledTimes(1);
	});

	it('is disabled and does not fire when disabled', async () => {
		const onclick = vi.fn();
		const screen = render(Button, { disabled: true, onclick, children: label('Nope') });
		const button = screen.getByRole('button', { name: 'Nope' });

		await expect.element(button).toBeDisabled();
		await button.click({ force: true });
		expect(onclick).not.toHaveBeenCalled();
	});

	it('shows a spinner, sets aria-busy and disables while loading', async () => {
		const screen = render(Button, { loading: true, leading: icon, children: label('Saving') });
		const button = screen.getByRole('button', { name: 'Saving' });

		await expect.element(button).toBeDisabled();
		await expect.element(button).toHaveAttribute('aria-busy', 'true');
		await expect.element(button).toHaveAttribute('data-loading');
		// The leading icon is replaced by the spinner while loading.
		expect(screen.container.querySelector('[data-testid="icon"]')).toBeNull();
		expect(screen.container.querySelector('.db-spinner')).not.toBeNull();
	});

	it('renders leading and trailing snippets', async () => {
		const screen = render(Button, { leading: icon, trailing: icon, children: label('Both') });

		await expect.element(screen.getByRole('button', { name: 'Both' })).toBeVisible();
		expect(screen.container.querySelectorAll('[data-testid="icon"]')).toHaveLength(2);
	});

	it('renders an anchor when href is provided', async () => {
		const screen = render(Button, { href: '/docs', children: label('Docs') });
		const link = screen.getByRole('link', { name: 'Docs' });

		await expect.element(link).toBeVisible();
		await expect.element(link).toHaveAttribute('href', '/docs');
		expect(screen.container.querySelector('button')).toBeNull();
	});

	it('renders a disabled anchor without href and removes it from the tab order', async () => {
		const screen = render(Button, { href: '/docs', disabled: true, children: label('Docs') });
		const link = screen.getByRole('link', { name: 'Docs' });

		await expect.element(link).toHaveAttribute('aria-disabled', 'true');
		await expect.element(link).toHaveAttribute('tabindex', '-1');
		await expect.element(link).not.toHaveAttribute('href');
	});

	it('forwards native attributes and merges classes', async () => {
		const screen = render(Button, {
			type: 'submit',
			class: 'custom',
			'aria-label': 'Submit form',
			iconOnly: true,
			leading: icon
		});
		const button = screen.getByRole('button', { name: 'Submit form' });

		await expect.element(button).toHaveAttribute('type', 'submit');
		await expect.element(button).toHaveClass('db-button');
		await expect.element(button).toHaveClass('custom');
		await expect.element(button).toHaveAttribute('data-icon-only');
	});
});
