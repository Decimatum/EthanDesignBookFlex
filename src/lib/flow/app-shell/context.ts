import { getContext, setContext } from 'svelte';

const KEY = Symbol('db-app-shell');

/** What the shell tells nav components rendered inside it. */
export interface AppShellContext {
	/** True when the sidebar is collapsed to an icon rail (labels hide, tooltips show). */
	readonly collapsed: boolean;
	/** Where the navigation is being rendered: a vertical sidebar/drawer or the horizontal top bar. */
	readonly placement: 'sidebar' | 'topbar';
}

export function setAppShellContext(ctx: AppShellContext) {
	setContext(KEY, ctx);
}

export function getAppShellContext(): AppShellContext | undefined {
	return getContext<AppShellContext | undefined>(KEY);
}
