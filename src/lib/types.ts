/** Shared prop vocabularies. Components import these so the API stays consistent. */

/** Keys of the spacing scale (`--space-*`). */
export const SPACES = [
	'0',
	'px',
	'0-5',
	'1',
	'1-5',
	'2',
	'2-5',
	'3',
	'4',
	'5',
	'6',
	'8',
	'10',
	'12',
	'16',
	'20',
	'24',
	'32'
] as const;
export type Space = (typeof SPACES)[number];

export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/** Status/intent colours shared by Badge, Alert, Text, etc. */
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export type Size = 'sm' | 'md' | 'lg';

/** CSS value for a spacing key, e.g. space('4') → 'var(--space-4)'. */
export function space(key: Space | undefined): string | undefined {
	return key === undefined ? undefined : `var(--space-${key})`;
}

const JUSTIFY: Record<Justify, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	between: 'space-between',
	around: 'space-around',
	evenly: 'space-evenly'
};
const ALIGN: Record<Align, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	stretch: 'stretch',
	baseline: 'baseline'
};
export function justifyValue(j: Justify | undefined): string | undefined {
	return j === undefined ? undefined : JUSTIFY[j];
}
export function alignValue(a: Align | undefined): string | undefined {
	return a === undefined ? undefined : ALIGN[a];
}
