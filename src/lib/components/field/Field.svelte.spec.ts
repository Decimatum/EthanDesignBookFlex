import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './FieldFixture.test.svelte';

describe('Field', () => {
	it('labels the control and links the hint via aria-describedby', async () => {
		const screen = render(Fixture, { hint: 'We never share it.' });
		const input = screen.getByLabelText('Email');
		await expect.element(input).toBeVisible();
		const el = screen.container.querySelector('input') as HTMLInputElement;
		const hint = screen.container.querySelector('.db-field__hint') as HTMLElement;
		expect(el.getAttribute('aria-describedby')).toBe(hint.id);
		expect(el).not.toHaveAttribute('aria-invalid');
	});

	it('marks the control invalid and announces the error', async () => {
		const screen = render(Fixture, { hint: 'Hint', error: 'Required' });
		const alert = screen.getByRole('alert');
		await expect.element(alert).toHaveTextContent('Required');
		const el = screen.container.querySelector('input') as HTMLInputElement;
		expect(el).toHaveAttribute('aria-invalid', 'true');
		expect(el.getAttribute('aria-describedby')).toContain('-error');
		// hint is replaced by the error, not shown alongside it
		expect(screen.container.querySelector('.db-field__hint')).toBeNull();
	});

	it('propagates disabled and required', async () => {
		const screen = render(Fixture, { disabled: true, required: true });
		const el = screen.container.querySelector('input') as HTMLInputElement;
		await expect.element(screen.getByLabelText('Email')).toBeDisabled();
		expect(el).toBeRequired();
		expect(screen.container.querySelector('.db-field__required')).not.toBeNull();
	});

	it('wires a Checkbox to the Field label, hint and required', async () => {
		const screen = render(Fixture, { control: 'checkbox', hint: 'Weekly', required: true });
		const box = screen.container.querySelector('input') as HTMLInputElement;
		const fieldLabel = screen.container.querySelector('.db-field__label') as HTMLLabelElement;
		expect(fieldLabel.htmlFor).toBe(box.id);
		expect(box).toBeRequired();
		await expect.element(screen.getByRole('checkbox')).toHaveAccessibleDescription('Weekly');
	});

	it('as a fieldset, keeps ids unique and describes the group once', () => {
		const screen = render(Fixture, { control: 'fieldset', hint: 'Pick any' });
		const [a, b] = Array.from(screen.container.querySelectorAll('input'));
		expect(a.id).not.toBe(b.id);
		expect(a.hasAttribute('aria-describedby')).toBe(false);
		const fieldset = screen.container.querySelector('fieldset') as HTMLElement;
		expect(fieldset.getAttribute('aria-describedby')).toBeTruthy();
		expect(screen.container.querySelector('legend')?.textContent).toContain('Alerts');
	});
});
