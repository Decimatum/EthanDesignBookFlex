import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Toaster from './Toaster.svelte';
import { toast, toasts } from './toast.svelte.js';

afterEach(() => toasts.clear());

/**
 * The pointer position persists between tests. A click on a toast in one test leaves the mouse
 * over where the next test's Toaster renders, which (correctly) pauses its timers. Park it first.
 */
async function parkMouse() {
	const park = document.createElement('div');
	park.style.cssText = 'position:fixed;top:0;left:0;width:8px;height:8px;';
	document.body.appendChild(park);
	await userEvent.hover(park);
	park.remove();
}

describe('Toast', () => {
	it('shows a toast with tone, description and a live-region announcement', async () => {
		const screen = render(Toaster);
		toast.success('Order filled', { description: '100 AAPL @ 189.20' });
		const el = screen.getByRole('status').first();
		await expect.element(el).toBeVisible();
		await expect.element(el).toHaveTextContent('Order filled');
		await expect.element(el).toHaveTextContent('100 AAPL @ 189.20');
		expect(screen.container.querySelector('.db-toast')).toHaveAttribute('data-tone', 'success');
		expect(screen.container.querySelector('[aria-live="polite"]')?.textContent).toContain(
			'Order filled'
		);
	});

	it('dismisses via the close button and the action', async () => {
		const screen = render(Toaster);
		const onClick = vi.fn();
		toast('Deleted', { action: { label: 'Undo', onClick }, duration: 0 });
		toast('Second', { duration: 0 });
		await screen.getByRole('button', { name: 'Undo' }).click();
		expect(onClick).toHaveBeenCalledTimes(1);
		await expect.poll(() => screen.container.querySelectorAll('.db-toast').length).toBe(1);
		await screen.getByRole('button', { name: 'Dismiss' }).click();
		await expect.poll(() => screen.container.querySelectorAll('.db-toast').length).toBe(0);
	});

	it('auto-dismisses after its duration and updates in place by id', async () => {
		await parkMouse();
		const screen = render(Toaster);
		const id = toast('Saving…', { duration: 0, dismissible: false });
		toast.success('Saved', { id, duration: 200 });
		await expect.poll(() => screen.container.querySelectorAll('.db-toast').length).toBe(1);
		await expect.element(screen.getByRole('status').first()).toHaveTextContent('Saved');
		await expect
			.poll(() => screen.container.querySelectorAll('.db-toast').length, {
				timeout: 2000
			})
			.toBe(0);
	});

	it('uses role=alert for danger', async () => {
		const screen = render(Toaster);
		toast.danger('Failed', { duration: 0 });
		await expect.element(screen.getByRole('alert')).toHaveTextContent('Failed');
	});

	it('tracks a promise from loading to success', async () => {
		await parkMouse();
		const screen = render(Toaster);
		const p = toast.promise(new Promise<string>((r) => setTimeout(() => r('ok'), 100)), {
			loading: 'Working…',
			success: (v) => `Done: ${v}`,
			error: 'Nope'
		});
		await expect.element(screen.getByRole('status').first()).toHaveTextContent('Working…');
		await p;
		await expect.element(screen.getByRole('status').first()).toHaveTextContent('Done: ok');
	});
});
