import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import NumberInput from './NumberInput.svelte';

const spin = (screen: ReturnType<typeof render>) => screen.getByRole('spinbutton');

describe('NumberInput', () => {
	it('renders a spinbutton with range attributes and the formatted value', async () => {
		const screen = render(NumberInput, {
			'aria-label': 'Qty',
			value: 1234.5,
			min: 0,
			max: 10000,
			step: 0.5,
			format: 'decimal'
		});
		const input = spin(screen);
		await expect.element(input).toHaveValue('1,234.5');
		await expect.element(input).toHaveAttribute('aria-valuemin', '0');
		await expect.element(input).toHaveAttribute('aria-valuemax', '10000');
		await expect.element(input).toHaveAttribute('aria-valuenow', '1234.5');
		await expect.element(input).toHaveAttribute('inputmode', 'decimal');
	});

	it('shows the plain number while editing and reformats on blur', async () => {
		const screen = render(NumberInput, {
			'aria-label': 'Price',
			value: 1234.5,
			format: 'currency',
			step: 0.01
		});
		const input = spin(screen);
		await expect.element(input).toHaveValue('$1,234.50');
		(input.element() as HTMLInputElement).focus();
		await expect.element(input).toHaveValue('1234.5');
		(input.element() as HTMLInputElement).blur();
		await expect.element(input).toHaveValue('$1,234.50');
	});

	it('parses typed and pasted text, clamps, rounds and reports changes', async () => {
		const onValueChange = vi.fn();
		const screen = render(NumberInput, {
			'aria-label': 'Qty',
			min: 0,
			max: 100,
			step: 1,
			onValueChange
		});
		const input = spin(screen);
		await input.fill('1,2a3.7');
		expect(onValueChange).toHaveBeenLastCalledWith(100); // 123.7 → clamped to max
		await input.fill('42.4');
		expect(onValueChange).toHaveBeenLastCalledWith(42); // rounded to step precision
		await input.fill('');
		expect(onValueChange).toHaveBeenLastCalledWith(null);
	});

	it('steps with the arrow keys, ×10 with Shift, and jumps with Home/End', async () => {
		const onValueChange = vi.fn();
		const screen = render(NumberInput, {
			'aria-label': 'Qty',
			value: 5,
			min: 0,
			max: 50,
			onValueChange
		});
		const input = spin(screen);
		(input.element() as HTMLInputElement).focus();
		await userEvent.keyboard('{ArrowUp}');
		expect(onValueChange).toHaveBeenLastCalledWith(6);
		await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
		expect(onValueChange).toHaveBeenLastCalledWith(0); // 6 − 10 clamped to min
		await userEvent.keyboard('{End}');
		expect(onValueChange).toHaveBeenLastCalledWith(50);
		await userEvent.keyboard('{Home}');
		expect(onValueChange).toHaveBeenLastCalledWith(0);
	});

	it('avoids floating-point drift when stepping by decimals', async () => {
		const onValueChange = vi.fn();
		const screen = render(NumberInput, { 'aria-label': 'X', value: 0.1, step: 0.1, onValueChange });
		(spin(screen).element() as HTMLInputElement).focus();
		await userEvent.keyboard('{ArrowUp}{ArrowUp}');
		expect(onValueChange).toHaveBeenLastCalledWith(0.3);
	});

	it('increments with the stepper buttons without stealing focus, and disables at the bounds', async () => {
		const onValueChange = vi.fn();
		const screen = render(NumberInput, {
			'aria-label': 'Qty',
			value: 9,
			min: 1,
			max: 10,
			onValueChange
		});
		const up = screen.container.querySelector('[data-direction="up"]') as HTMLButtonElement;
		const down = screen.container.querySelector('[data-direction="down"]') as HTMLButtonElement;
		// Steppers are outside the tab order and hidden from AT: the spinbutton already exposes them.
		expect(up).toHaveAttribute('tabindex', '-1');
		expect(up).toHaveAttribute('aria-hidden', 'true');
		up.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }));
		up.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
		expect(onValueChange).toHaveBeenLastCalledWith(10);
		await expect.element(spin(screen)).toHaveValue('10');
		expect(up).toBeDisabled();
		expect(down).not.toBeDisabled();
	});

	it('starts from min when stepping up from empty', () => {
		const onValueChange = vi.fn();
		const screen = render(NumberInput, { 'aria-label': 'Qty', min: 1, onValueChange });
		const up = screen.container.querySelector('[data-direction="up"]') as HTMLButtonElement;
		up.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }));
		up.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
		expect(onValueChange).toHaveBeenLastCalledWith(1);
	});

	it('renders a hidden input for forms and reflects invalid/disabled/size', () => {
		const screen = render(NumberInput, {
			'aria-label': 'Qty',
			name: 'qty',
			value: 3,
			invalid: true,
			disabled: true,
			size: 'lg',
			controls: 'split'
		});
		const root = screen.container.querySelector('.db-number-input') as HTMLElement;
		expect(root).toHaveAttribute('data-invalid');
		expect(root).toHaveAttribute('data-disabled');
		expect(root).toHaveAttribute('data-size', 'lg');
		expect(root).toHaveAttribute('data-controls', 'split');
		const hidden = screen.container.querySelector('input[type="hidden"]') as HTMLInputElement;
		expect(hidden).toHaveAttribute('name', 'qty');
		expect(hidden).toHaveValue('3');
		expect(screen.container.querySelector('input[role="spinbutton"]')).toBeDisabled();
	});
});
