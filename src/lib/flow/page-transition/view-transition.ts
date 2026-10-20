/**
 * Cross-document-style page transitions inside a SvelteKit app, using the View Transitions API
 * when the browser has it and doing nothing (an instant swap) when it doesn't.
 *
 * Wire it once in the root layout:
 *
 * ```svelte
 * <script>
 *   import { onNavigate } from '$app/navigation';
 *   import { viewTransition } from '@ethan/designbook';
 *   onNavigate(viewTransition());
 * </script>
 * ```
 *
 * The `kind` sets `data-transition` on <html> for the duration so `styles/transitions.css`
 * can pick an animation: `fade` (default), `slide` or `none`.
 */

export type ViewTransitionKind = 'fade' | 'slide' | 'none';

export interface ViewTransitionOptions {
	/** Animation to use; can also be decided per navigation with `pick`. */
	kind?: ViewTransitionKind;
	/** Choose the animation from the navigation (e.g. slide for deeper routes). */
	pick?: (navigation: NavigationLike) => ViewTransitionKind;
}

/** The subset of SvelteKit's `OnNavigate` this helper needs, so the library stays free of `$app/*`. */
export interface NavigationLike {
	from?: { url: URL } | null;
	to?: { url: URL } | null;
	complete: Promise<void>;
}

export function supportsViewTransitions(): boolean {
	return typeof document !== 'undefined' && 'startViewTransition' in document;
}

export function viewTransition(options: ViewTransitionOptions = {}) {
	return (navigation: NavigationLike): Promise<void> | void => {
		if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function')
			return;
		const doc = document;
		const kind = options.pick?.(navigation) ?? options.kind ?? 'fade';
		if (kind === 'none') return;
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise<void>((resolve) => {
			doc.documentElement.dataset.transition = kind;
			const transition = doc.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => {
				delete doc.documentElement.dataset.transition;
			});
		});
	};
}

/**
 * Picks `slide` when navigating deeper (more path segments) or shallower, `fade` for siblings.
 * Handy default for `pick`.
 */
export function slideByDepth(navigation: NavigationLike): ViewTransitionKind {
	const depth = (u?: { url: URL } | null) => u?.url.pathname.split('/').filter(Boolean).length ?? 0;
	return depth(navigation.to) === depth(navigation.from) ? 'fade' : 'slide';
}
