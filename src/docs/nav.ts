/** Docs navigation. Add a component or flow page here and it is automatically covered by the a11y and visual e2e suites. */
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
		title: 'Flow',
		items: [
			{ title: 'App shell', href: '/flow/app-shell/' },
			{ title: 'Command palette', href: '/flow/command-palette/' },
			{ title: 'Nav', href: '/flow/nav/' },
			{ title: 'Page transition', href: '/flow/page-transition/' },
			{ title: 'Route progress', href: '/flow/route-progress/' },
			{ title: 'Stepper', href: '/flow/stepper/' },
			{ title: 'Tab bar', href: '/flow/tab-bar/' }
		]
	},
	{
		title: 'Patterns',
		items: [
			{ title: 'Auth', href: '/patterns/auth/' },
			{ title: 'Checkout', href: '/patterns/checkout/' },
			{ title: 'Dashboard', href: '/patterns/dashboard/' },
			{ title: 'Onboarding', href: '/patterns/onboarding/' },
			{ title: 'Settings', href: '/patterns/settings/' }
		]
	},
	{
		title: 'Components',
		items: [
			{ title: 'Accordion', href: '/components/accordion/' },
			{ title: 'Alert', href: '/components/alert/' },
			{ title: 'Avatar', href: '/components/avatar/' },
			{ title: 'Badge', href: '/components/badge/' },
			{ title: 'Banner', href: '/components/banner/' },
			{ title: 'Breadcrumb', href: '/components/breadcrumb/' },
			{ title: 'Button group', href: '/components/button-group/' },
			{ title: 'Button', href: '/components/button/' },
			{ title: 'Calendar', href: '/components/calendar/' },
			{ title: 'Card', href: '/components/card/' },
			{ title: 'Checkbox', href: '/components/checkbox/' },
			{ title: 'Combobox', href: '/components/combobox/' },
			{ title: 'Container', href: '/components/container/' },
			{ title: 'Court map', href: '/components/court-map/' },
			{ title: 'Date picker', href: '/components/date-picker/' },
			{ title: 'Delta', href: '/components/delta/' },
			{ title: 'Description list', href: '/components/description-list/' },
			{ title: 'Dialog', href: '/components/dialog/' },
			{ title: 'Divider', href: '/components/divider/' },
			{ title: 'Drawer', href: '/components/drawer/' },
			{ title: 'Empty state', href: '/components/empty-state/' },
			{ title: 'Field', href: '/components/field/' },
			{ title: 'Grid', href: '/components/grid/' },
			{ title: 'Heading', href: '/components/heading/' },
			{ title: 'Inline', href: '/components/inline/' },
			{ title: 'Input', href: '/components/input/' },
			{ title: 'Kbd', href: '/components/kbd/' },
			{ title: 'Link', href: '/components/link/' },
			{ title: 'Menu', href: '/components/menu/' },
			{ title: 'Number input', href: '/components/number-input/' },
			{ title: 'Pagination', href: '/components/pagination/' },
			{ title: 'Popover', href: '/components/popover/' },
			{ title: 'Progress', href: '/components/progress/' },
			{ title: 'Radio', href: '/components/radio/' },
			{ title: 'Rating', href: '/components/rating/' },
			{ title: 'Select', href: '/components/select/' },
			{ title: 'Skeleton', href: '/components/skeleton/' },
			{ title: 'Slider', href: '/components/slider/' },
			{ title: 'Spinner', href: '/components/spinner/' },
			{ title: 'Stack', href: '/components/stack/' },
			{ title: 'Stat', href: '/components/stat/' },
			{ title: 'Switch', href: '/components/switch/' },
			{ title: 'Table', href: '/components/table/' },
			{ title: 'Tabs', href: '/components/tabs/' },
			{ title: 'Tag', href: '/components/tag/' },
			{ title: 'Text', href: '/components/text/' },
			{ title: 'Textarea', href: '/components/textarea/' },
			{ title: 'Ticker', href: '/components/ticker/' },
			{ title: 'TimeGrid', href: '/components/time-grid/' },
			{ title: 'Toast', href: '/components/toast/' },
			{ title: 'Tooltip', href: '/components/tooltip/' },
			{ title: 'VirtualList', href: '/components/virtual-list/' }
		]
	}
];

export const allRoutes = ['/', ...nav.flatMap((s) => s.items.map((i) => i.href))];
