import { getContext, setContext } from 'svelte';

const KEY = Symbol('db-nav');

export interface NavContext {
	/** Current URL path, used to derive `active` for items with an `href`. */
	readonly current: string | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	/** Called by the active item with its element so the indicator can move to it. */
	setActiveElement(el: HTMLElement | null): void;
}

export function setNavContext(ctx: NavContext) {
	setContext(KEY, ctx);
}

export function getNavContext(): NavContext | undefined {
	return getContext<NavContext | undefined>(KEY);
}
