import { getContext, setContext } from 'svelte';

const KEY = Symbol('db-field');

/**
 * What a Field tells the control inside it. Getters keep it reactive: controls read
 * `ctx.invalid` in their template and re-render when the Field's props change.
 */
export interface FieldContext {
	/** id the control should use, so the Field's <label for> points at it. */
	readonly id: string;
	/** Space-separated ids of the hint/error elements, for aria-describedby. */
	readonly describedBy: string | undefined;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly disabled: boolean;
}

export function setFieldContext(ctx: FieldContext) {
	setContext(KEY, ctx);
}

export function getFieldContext(): FieldContext | undefined {
	return getContext<FieldContext | undefined>(KEY);
}
