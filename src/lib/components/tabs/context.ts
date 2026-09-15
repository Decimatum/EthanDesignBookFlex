import { getContext, setContext } from 'svelte';

const KEY = Symbol('db-tabs');

export interface TabsContext {
	readonly variant: 'underline' | 'pill';
	readonly size: 'sm' | 'md';
}

export function setTabsContext(ctx: TabsContext) {
	setContext(KEY, ctx);
}
export function getTabsContext(): TabsContext | undefined {
	return getContext<TabsContext | undefined>(KEY);
}
