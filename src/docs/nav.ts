/** Docs navigation. Add a component page here and it is automatically covered by the a11y and visual e2e suites. */
export interface NavItem {
	title: string;
	href: string;
}
export interface NavSection {
	title: string;
	items: NavItem[];
}

export const nav: NavSection[] = [
	{
		title: 'Foundations',
		items: [
			{ title: 'Colors', href: '/foundations/colors/' },
			{ title: 'Typography', href: '/foundations/typography/' },
			{ title: 'Spacing & density', href: '/foundations/spacing/' },
			{ title: 'Motion', href: '/foundations/motion/' }
		]
	},
	{
		title: 'Components',
		items: [
			{ title: 'Avatar', href: '/components/avatar/' },
			{ title: 'Badge', href: '/components/badge/' },
			{ title: 'Button', href: '/components/button/' },
			{ title: 'Card', href: '/components/card/' },
			{ title: 'Checkbox', href: '/components/checkbox/' },
			{ title: 'Container', href: '/components/container/' },
			{ title: 'Divider', href: '/components/divider/' },
			{ title: 'Field', href: '/components/field/' },
			{ title: 'Grid', href: '/components/grid/' },
			{ title: 'Heading', href: '/components/heading/' },
			{ title: 'Inline', href: '/components/inline/' },
			{ title: 'Input', href: '/components/input/' },
			{ title: 'Radio', href: '/components/radio/' },
			{ title: 'Skeleton', href: '/components/skeleton/' },
			{ title: 'Spinner', href: '/components/spinner/' },
			{ title: 'Stack', href: '/components/stack/' },
			{ title: 'Switch', href: '/components/switch/' },
			{ title: 'Text', href: '/components/text/' },
			{ title: 'Textarea', href: '/components/textarea/' }
		]
	}
];

export const allRoutes = ['/', ...nav.flatMap((s) => s.items.map((i) => i.href))];
