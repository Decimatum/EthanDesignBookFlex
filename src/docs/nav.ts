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
			{ title: 'Alert', href: '/components/alert/' },
			{ title: 'Avatar', href: '/components/avatar/' },
			{ title: 'Badge', href: '/components/badge/' },
			{ title: 'Button', href: '/components/button/' },
			{ title: 'Card', href: '/components/card/' },
			{ title: 'Checkbox', href: '/components/checkbox/' },
			{ title: 'Container', href: '/components/container/' },
			{ title: 'Dialog', href: '/components/dialog/' },
			{ title: 'Divider', href: '/components/divider/' },
			{ title: 'Field', href: '/components/field/' },
			{ title: 'Grid', href: '/components/grid/' },
			{ title: 'Heading', href: '/components/heading/' },
			{ title: 'Inline', href: '/components/inline/' },
			{ title: 'Input', href: '/components/input/' },
			{ title: 'Menu', href: '/components/menu/' },
			{ title: 'Popover', href: '/components/popover/' },
			{ title: 'Radio', href: '/components/radio/' },
			{ title: 'Select', href: '/components/select/' },
			{ title: 'Skeleton', href: '/components/skeleton/' },
			{ title: 'Spinner', href: '/components/spinner/' },
			{ title: 'Stack', href: '/components/stack/' },
			{ title: 'Switch', href: '/components/switch/' },
			{ title: 'Tabs', href: '/components/tabs/' },
			{ title: 'Text', href: '/components/text/' },
			{ title: 'Textarea', href: '/components/textarea/' },
			{ title: 'Toast', href: '/components/toast/' },
			{ title: 'Tooltip', href: '/components/tooltip/' }
		]
	}
];

export const allRoutes = ['/', ...nav.flatMap((s) => s.items.map((i) => i.href))];
