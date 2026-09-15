/** Small, dependency-free helpers shared by components. */

/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(' ');
}

let counter = 0;
/** Stable-ish unique id for aria wiring. Prefer Svelte's $props.id() inside components. */
export function uid(prefix = 'db'): string {
	counter += 1;
	return `${prefix}-${counter.toString(36)}`;
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

/** True when running in a browser (SSR-safe checks). */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/** Respect the user's reduced-motion preference. */
export function prefersReducedMotion(): boolean {
	return isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
