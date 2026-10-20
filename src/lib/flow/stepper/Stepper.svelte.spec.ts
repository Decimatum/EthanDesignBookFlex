import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './StepperFixture.test.svelte';

describe('Stepper', () => {
	it('marks completed, current and upcoming steps with screen-reader text', async () => {
		const screen = render(Fixture);
		const items = screen.getByRole('listitem').elements();
		expect(items.map((li) => li.getAttribute('data-state'))).toEqual([
			'complete',
			'complete',
			'current',
			'upcoming'
		]);
		expect(items[2].getAttribute('aria-current')).toBe('step');
		expect(items[0].textContent).toContain('Step 1 of 4, completed');
		// nothing is clickable without onStepClick
		expect(screen.container.querySelectorAll('button')).toHaveLength(0);
	});

	it('linear: only completed steps are buttons, and clicking one goes back', async () => {
		const onStepClick = vi.fn();
		const screen = render(Fixture, { onStepClick });
		expect(screen.getByRole('button').elements()).toHaveLength(2);
		await screen.getByRole('button', { name: /Details/ }).click();
		await expect.element(screen.getByTestId('current')).toHaveTextContent('details');
		expect(onStepClick).toHaveBeenCalledWith('details');
	});

	it('non-linear: every other step is clickable', () => {
		const screen = render(Fixture, { onStepClick: vi.fn(), linear: false });
		expect(screen.getByRole('button').elements()).toHaveLength(3);
	});

	it('shows an error marker on a completed step flagged with error', () => {
		const screen = render(Fixture, { error: true });
		const marker = screen.container.querySelectorAll('.db-stepper__marker')[1];
		expect(marker).toHaveAttribute('data-error');
	});
});
