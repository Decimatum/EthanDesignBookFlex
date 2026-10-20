import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './SliderFixture.test.svelte';

describe('Slider', () => {
	it('renders a labelled slider with value, ticks and the shown value', async () => {
		const screen = render(Fixture);
		const thumb = screen.getByRole('slider', { name: 'Volume' });
		await expect.element(thumb).toHaveAttribute('aria-valuenow', '40');
		await expect.element(thumb).toHaveAttribute('aria-valuemax', '100');
		expect(screen.container.querySelector('.db-slider__value')?.textContent).toBe('40');
		expect(screen.container.querySelectorAll('.db-slider__tick')).toHaveLength(5);
	});

	it('moves by step with the keyboard and reports change and commit', async () => {
		const onValueChange = vi.fn();
		const onValueCommit = vi.fn();
		const screen = render(Fixture, { onValueChange, onValueCommit });
		const thumb = screen.getByRole('slider');
		(thumb.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('45');
		expect(onValueChange).toHaveBeenLastCalledWith(45);
		expect(onValueCommit).toHaveBeenLastCalledWith(45);
		await userEvent.keyboard('{End}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('100');
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('100');
	});

	it('supports a range with two named thumbs', async () => {
		const screen = render(Fixture, { initial: [20, 60] });
		expect(screen.getByRole('slider').elements()).toHaveLength(2);
		const [low, high] = screen.getByRole('slider').elements();
		expect(low.getAttribute('aria-valuenow')).toBe('20');
		expect(high.getAttribute('aria-valuenow')).toBe('60');
		(high as HTMLElement).focus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(screen.getByTestId('value')).toHaveTextContent('20,55');
		await expect.element(screen.getByText('20 – 55')).toBeVisible();
	});

	it('takes its name, description and disabled state from a Field', async () => {
		const screen = render(Fixture, { inField: true });
		const thumb = screen.getByRole('slider', { name: 'Risk' });
		await expect.element(thumb).toHaveAccessibleDescription('Per trade');
		await expect.element(thumb).toHaveAttribute('data-disabled');
		expect(screen.container.querySelector('.db-slider')?.hasAttribute('data-disabled')).toBe(true);
	});
});
