import { getContext, setContext } from 'svelte';

const KEY = Symbol('db-radio-group');

export interface RadioGroupContext {
	readonly name: string;
	readonly value: string | undefined;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly describedBy: string | undefined;
	select(value: string): void;
}

export function setRadioGroupContext(ctx: RadioGroupContext) {
	setContext(KEY, ctx);
}
export function getRadioGroupContext(): RadioGroupContext | undefined {
	return getContext<RadioGroupContext | undefined>(KEY);
}
