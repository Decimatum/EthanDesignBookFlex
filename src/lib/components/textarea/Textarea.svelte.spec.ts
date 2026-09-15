import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Textarea from './Textarea.svelte';

describe('Textarea', () => {
	it('renders with rows and binds value', async () => {
		const screen = render(Textarea, { 'aria-label': 'Notes', value: 'hi', rows: 5 });
		const ta = screen.getByRole('textbox', { name: 'Notes' });
		await expect.element(ta).toHaveValue('hi');
		expect(screen.container.querySelector('textarea')).toHaveAttribute('rows', '5');
		await ta.fill('longer text');
		await expect.element(ta).toHaveValue('longer text');
	});

	it('marks invalid and disabled', () => {
		const screen = render(Textarea, { 'aria-label': 'Notes', invalid: true, disabled: true });
		const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
		expect(ta).toHaveAttribute('aria-invalid', 'true');
		expect(ta).toHaveAttribute('data-invalid');
		expect(ta).toBeDisabled();
	});

	it('grows with content when autoResize is on', async () => {
		const screen = render(Textarea, { 'aria-label': 'Notes', autoResize: true, rows: 1 });
		const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
		expect(ta).toHaveAttribute('data-auto-resize');
		const before = ta.getBoundingClientRect().height;
		await screen.getByRole('textbox').fill('one\ntwo\nthree\nfour\nfive');
		await expect.poll(() => ta.getBoundingClientRect().height).toBeGreaterThan(before);
	});
});
