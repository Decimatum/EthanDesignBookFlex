import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Fixture from './ButtonGroupFixture.test.svelte';

describe('ButtonGroup', () => {
	it('renders a labelled group of buttons', async () => {
		const screen = render(Fixture);
		await expect.element(screen.getByRole('group', { name: 'Range' })).toBeVisible();
		expect(screen.getByRole('button').elements()).toHaveLength(3);
	});

	it('joins attached buttons by collapsing the inner radii', () => {
		const screen = render(Fixture);
		const [first, middle, last] = screen.getByRole('button').elements();
		const r = (el: Element) => getComputedStyle(el);
		expect(r(first).borderTopRightRadius).toBe('0px');
		expect(r(first).borderTopLeftRadius).not.toBe('0px');
		expect(r(middle).borderTopLeftRadius).toBe('0px');
		expect(r(middle).borderTopRightRadius).toBe('0px');
		expect(r(last).borderTopLeftRadius).toBe('0px');
		expect(r(last).borderTopRightRadius).not.toBe('0px');
	});

	it('keeps radii and a gap when not attached', () => {
		const screen = render(Fixture, { attached: false });
		const [first] = screen.getByRole('button').elements();
		expect(getComputedStyle(first).borderTopRightRadius).not.toBe('0px');
		const group = screen.container.querySelector('.db-button-group') as HTMLElement;
		expect(getComputedStyle(group).gap).not.toBe('0px');
	});

	it('stacks vertically', () => {
		const screen = render(Fixture, { orientation: 'vertical' });
		const group = screen.container.querySelector('.db-button-group') as HTMLElement;
		expect(getComputedStyle(group).flexDirection).toBe('column');
		const [first] = screen.getByRole('button').elements();
		expect(getComputedStyle(first).borderBottomLeftRadius).toBe('0px');
		expect(getComputedStyle(first).borderTopLeftRadius).not.toBe('0px');
	});
});
