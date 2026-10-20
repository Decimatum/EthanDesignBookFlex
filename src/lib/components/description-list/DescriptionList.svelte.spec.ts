import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import DescriptionList from './DescriptionList.svelte';

describe('DescriptionList', () => {
	it('renders terms and descriptions as a dl', async () => {
		const screen = render(DescriptionList, {
			items: [
				{ term: 'Venue', description: 'Kallang' },
				{ term: 'Duration', description: '90 min', note: 'incl. warm-up' }
			]
		});
		await expect.element(screen.getByText('Venue')).toBeVisible();
		await expect.element(screen.getByText('90 min')).toBeVisible();
		await expect.element(screen.getByText('incl. warm-up')).toBeVisible();
		const dl = screen.container.querySelector('dl');
		expect(dl?.getAttribute('data-layout')).toBe('stacked');
		expect(dl?.querySelectorAll('dt').length).toBe(2);
	});

	it('renders a snippet description and reflects the layout', async () => {
		const badge = createRawSnippet(() => ({ render: () => `<span data-testid="rich">Won</span>` }));
		const screen = render(DescriptionList, {
			layout: 'inline',
			items: [{ term: 'Result', description: badge }]
		});
		await expect.element(screen.getByTestId('rich')).toBeVisible();
		expect(screen.container.querySelector('dl')?.getAttribute('data-layout')).toBe('inline');
	});
});
