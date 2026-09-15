import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './RadioFixture.test.svelte';

describe('RadioGroup + Radio', () => {
	it('renders a labelled radiogroup with the bound value checked', async () => {
		const screen = render(Fixture);
		const group = screen.getByRole('radiogroup', { name: 'Plan' });
		await expect.element(group).toBeVisible();
		await expect.element(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
		await expect.element(screen.getByRole('radio', { name: 'Basic' })).not.toBeChecked();
		// all radios share one generated name
		const names = new Set(
			[...screen.container.querySelectorAll('input')].map((i) => i.getAttribute('name'))
		);
		expect(names.size).toBe(1);
	});

	it('selects on click and reports the change', async () => {
		const onValueChange = vi.fn();
		const screen = render(Fixture, { onValueChange });
		await screen.getByText('Team').click();
		await expect.element(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
		expect(onValueChange).toHaveBeenCalledWith('c');
	});

	it('propagates disabled and error to the group', async () => {
		const screen = render(Fixture, { disabled: true, error: 'Choose a plan' });
		await expect.element(screen.getByRole('radio', { name: 'Basic' })).toBeDisabled();
		await expect.element(screen.getByRole('alert')).toHaveTextContent('Choose a plan');
		expect(screen.container.querySelector('[role="radiogroup"]')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});
});
