<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
	export type TextTone =
		| 'default'
		| 'muted'
		| 'subtle'
		| 'accent'
		| 'success'
		| 'warning'
		| 'danger'
		| 'info'
		| 'positive'
		| 'negative'
		| 'inherit';

	export interface TextProps extends HTMLAttributes<HTMLElement> {
		as?:
			| 'p'
			| 'span'
			| 'div'
			| 'label'
			| 'strong'
			| 'em'
			| 'small'
			| 'dt'
			| 'dd'
			| 'li'
			| 'figcaption';
		size?: TextSize;
		weight?: TextWeight;
		tone?: TextTone;
		align?: 'start' | 'center' | 'end';
		/** Monospace family. */
		mono?: boolean;
		/** Tabular numerals — use for any column of figures. */
		numeric?: boolean;
		/** Single-line ellipsis truncation. */
		truncate?: boolean;
		/** Clamp to N lines. */
		lines?: number;
		children?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	let {
		as = 'p',
		size = 'md',
		weight = 'regular',
		tone = 'default',
		align,
		mono = false,
		numeric = false,
		truncate = false,
		lines,
		children,
		class: className,
		...rest
	}: TextProps = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={['db-text', className]}
	data-size={size}
	data-weight={weight}
	data-tone={tone}
	data-mono={mono || undefined}
	data-numeric={numeric || undefined}
	data-truncate={truncate || undefined}
	data-clamp={lines ? true : undefined}
	style:text-align={align}
	style:--_lines={lines}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.db-text {
		/* Set explicitly (not as a fallback) so a nested default Text resets its colour
		   instead of inheriting the parent's --_color. */
		--_color: var(--color-text);
		margin: 0;
		font-family: var(--font-body);
		line-height: var(--leading-normal);
		color: var(--_color);
		text-wrap: pretty;
	}
	.db-text[data-size='xs'] {
		font-size: var(--text-xs);
	}
	.db-text[data-size='sm'] {
		font-size: var(--text-sm);
	}
	.db-text[data-size='md'] {
		font-size: var(--text-md);
	}
	.db-text[data-size='lg'] {
		font-size: var(--text-lg);
	}
	.db-text[data-size='xl'] {
		font-size: var(--text-xl);
		line-height: var(--leading-snug);
	}
	.db-text[data-weight='regular'] {
		font-weight: var(--weight-regular);
	}
	.db-text[data-weight='medium'] {
		font-weight: var(--weight-medium);
	}
	.db-text[data-weight='semibold'] {
		font-weight: var(--weight-semibold);
	}
	.db-text[data-weight='bold'] {
		font-weight: var(--weight-bold);
	}
	.db-text[data-tone='muted'] {
		--_color: var(--color-text-muted);
	}
	.db-text[data-tone='subtle'] {
		--_color: var(--color-text-subtle);
	}
	.db-text[data-tone='accent'] {
		--_color: var(--color-accent-text);
	}
	.db-text[data-tone='success'] {
		--_color: var(--color-success-text);
	}
	.db-text[data-tone='warning'] {
		--_color: var(--color-warning-text);
	}
	.db-text[data-tone='danger'] {
		--_color: var(--color-danger-text);
	}
	.db-text[data-tone='info'] {
		--_color: var(--color-info-text);
	}
	.db-text[data-tone='positive'] {
		--_color: var(--color-positive-text);
	}
	.db-text[data-tone='negative'] {
		--_color: var(--color-negative-text);
	}
	.db-text[data-tone='inherit'] {
		/* `inherit` inside var() would inherit the custom property, not the colour. */
		color: inherit;
	}
	.db-text[data-mono] {
		font-family: var(--font-mono);
		font-size: 0.925em;
	}
	.db-text[data-numeric] {
		font-variant-numeric: var(--font-numeric);
	}
	.db-text[data-truncate] {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		min-width: 0;
	}
	.db-text[data-clamp] {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--_lines);
		line-clamp: var(--_lines);
		overflow: hidden;
	}
</style>
