<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export type CourtMarkerKind = 'me' | 'partner' | 'correct' | 'ball' | 'point';
	export type CourtMarkerTone = 'accent' | 'neutral' | 'warning' | 'danger' | 'success' | 'info';

	/** A dot on the court. Coordinates are court metres: x 0–10 across, y 0–20 down; your side is the bottom half (y 10–20). */
	export interface CourtMarker {
		id: string;
		x: number;
		y: number;
		kind?: CourtMarkerKind;
		tone?: CourtMarkerTone;
		/** Short text inside the dot ("me", "P"). */
		label?: string;
		/** Accessible description (read in place of the generated one). */
		title?: string;
	}

	/** An arrow from one marker to another, or between two points. */
	export interface CourtArrow {
		from: string | { x: number; y: number };
		to: string | { x: number; y: number };
		tone?: CourtMarkerTone;
		dashed?: boolean;
	}

	export interface CourtMapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		markers?: CourtMarker[];
		arrows?: CourtArrow[];
		/** `edit`: taps place or move markers; `view`: read-only. */
		mode?: 'edit' | 'view';
		/** Which marker a tap places next (edit mode). `null` means taps do nothing. */
		placing?: CourtMarkerKind | null;
		/** Marker drawn with a focus ring. */
		selected?: string | null;
		/** Draw markers small and translucent: many points read as a heat map. */
		heat?: boolean;
		/** Width in CSS px; height follows the 1:2 court. */
		width?: number | string;
		/** Labels at the ends. */
		topLabel?: string;
		bottomLabel?: string;
		/** A tap on an empty spot in edit mode. */
		onPlace?: (x: number, y: number) => void;
		/** A marker was tapped. */
		onSelect?: (id: string) => void;
		/** A marker was dragged or nudged to a new spot (edit mode). */
		onMove?: (id: string, x: number, y: number) => void;
		/** Accessible name of the drawing. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	// A padel court, 10 m × 20 m, drawn to scale: net across the middle, service
	// lines 6.95 m from the net, a centre line on each half, glass walls as a
	// soft frame. Points are stored in metres, so a heat map is comparable
	// across phones and screens.
	//
	// Accessibility: in view mode the drawing is one image and a visually
	// hidden list names every marker; in edit mode the drawing is a group and
	// every marker is a focusable button that the arrow keys nudge.
	let {
		markers = [],
		arrows = [],
		mode = 'view',
		placing = null,
		selected = null,
		heat = false,
		width = '100%',
		topLabel = 'Opponents',
		bottomLabel = 'You',
		onPlace,
		onSelect,
		onMove,
		label = 'Padel court',
		class: className,
		...rest
	}: CourtMapProps = $props();

	const W = 10;
	const H = 20;
	const PAD = 0.6; // metres of margin for the glass and labels
	const vb = `${-PAD} ${-PAD} ${W + 2 * PAD} ${H + 2 * PAD}`;

	let svg = $state<SVGSVGElement | null>(null);
	let dragging = $state<string | null>(null);
	const listId = $props.id();

	function toCourt(e: PointerEvent): { x: number; y: number } | null {
		if (!svg) return null;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const ctm = svg.getScreenCTM();
		if (!ctm) return null;
		const p = pt.matrixTransform(ctm.inverse());
		const x = Math.min(W, Math.max(0, p.x));
		const y = Math.min(H, Math.max(0, p.y));
		return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
	}

	function tapCourt(e: PointerEvent) {
		if (mode !== 'edit' || !placing || dragging) return;
		const p = toCourt(e);
		if (p) onPlace?.(p.x, p.y);
	}
	function down(e: PointerEvent, id: string) {
		e.stopPropagation();
		onSelect?.(id);
		if (mode !== 'edit') return;
		dragging = id;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const p = toCourt(e);
		if (p) onMove?.(dragging, p.x, p.y);
	}
	function up() {
		dragging = null;
	}
	function nudge(e: KeyboardEvent, m: CourtMarker) {
		const d = e.shiftKey ? 1 : 0.25;
		const dx = e.key === 'ArrowLeft' ? -d : e.key === 'ArrowRight' ? d : 0;
		const dy = e.key === 'ArrowUp' ? -d : e.key === 'ArrowDown' ? d : 0;
		if (dx || dy) {
			e.preventDefault();
			onMove?.(
				m.id,
				Math.round(Math.min(W, Math.max(0, m.x + dx)) * 100) / 100,
				Math.round(Math.min(H, Math.max(0, m.y + dy)) * 100) / 100
			);
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect?.(m.id);
		}
	}

	function resolve(ref: string | { x: number; y: number }) {
		if (typeof ref === 'string') {
			const m = markers.find((k) => k.id === ref);
			return m ? { x: m.x, y: m.y } : null;
		}
		return ref;
	}
	const resolvedArrows = $derived(
		arrows
			.map((a) => ({ a, from: resolve(a.from), to: resolve(a.to) }))
			.filter((x) => x.from && x.to) as {
			a: CourtArrow;
			from: { x: number; y: number };
			to: { x: number; y: number };
		}[]
	);

	const r = $derived(heat ? 0.22 : 0.45);
	const defaultTone: Record<CourtMarkerKind, CourtMarkerTone> = {
		me: 'warning',
		partner: 'neutral',
		correct: 'accent',
		ball: 'info',
		point: 'neutral'
	};
	const defaultLabel: Record<CourtMarkerKind, string> = {
		me: 'me',
		partner: 'P',
		correct: '',
		ball: '',
		point: ''
	};

	function describe(m: CourtMarker) {
		if (m.title) return m.title;
		const side = m.y >= H / 2 ? 'your side' : 'their side';
		const depth =
			m.y >= H / 2
				? m.y > 16.5
					? 'at the back'
					: m.y > 13.05
						? 'mid-court'
						: 'at the net'
				: m.y < 3.5
					? 'at the back'
					: m.y < 6.95
						? 'mid-court'
						: 'at the net';
		const lr = m.x < W / 2 ? 'left' : 'right';
		return `${m.kind ?? 'point'}: ${side}, ${lr}, ${depth}`;
	}
	const kindOf = (m: CourtMarker) => m.kind ?? 'point';
</script>

{#snippet dot(m: CourtMarker)}
	<circle cx={m.x} cy={m.y} r={kindOf(m) === 'correct' ? r * 0.8 : r} />
	{#if !heat && (m.label ?? defaultLabel[kindOf(m)])}
		<text x={m.x} y={m.y + 0.16} class="db-court-map__dot-label"
			>{m.label ?? defaultLabel[kindOf(m)]}</text
		>
	{/if}
{/snippet}

<div
	{...rest}
	class={['db-court-map', className]}
	data-mode={mode}
	data-heat={heat || undefined}
	style:width={typeof width === 'number' ? `${width}px` : width}
>
	<svg
		bind:this={svg}
		viewBox={vb}
		role={mode === 'edit' ? 'group' : 'img'}
		aria-label={label}
		aria-describedby={mode === 'view' && !heat && markers.length ? listId : undefined}
		class="db-court-map__svg"
		onpointerdown={tapCourt}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
	>
		<!-- glass -->
		<rect
			x={-0.25}
			y={-0.25}
			width={W + 0.5}
			height={H + 0.5}
			rx="0.4"
			class="db-court-map__glass"
		/>
		<!-- turf -->
		<rect x="0" y="0" width={W} height={H} class="db-court-map__turf" />
		<!-- lines: service lines 6.95 m from the net, centre lines, net -->
		<line x1="0" y1={H / 2 - 6.95} x2={W} y2={H / 2 - 6.95} class="db-court-map__line" />
		<line x1="0" y1={H / 2 + 6.95} x2={W} y2={H / 2 + 6.95} class="db-court-map__line" />
		<line x1={W / 2} y1={H / 2 - 6.95} x2={W / 2} y2={H / 2} class="db-court-map__line" />
		<line x1={W / 2} y1={H / 2} x2={W / 2} y2={H / 2 + 6.95} class="db-court-map__line" />
		<line x1="0" y1={H / 2} x2={W} y2={H / 2} class="db-court-map__net" />
		<text x={W / 2} y="1" class="db-court-map__label">{topLabel}</text>
		<text x={W / 2} y={H - 0.5} class="db-court-map__label">{bottomLabel}</text>

		<defs>
			<marker
				id="db-court-arrow-{listId}"
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="4"
				markerHeight="4"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
			</marker>
		</defs>
		{#each resolvedArrows as { a, from, to }, k (k)}
			<line
				x1={from.x}
				y1={from.y}
				x2={to.x}
				y2={to.y}
				class="db-court-map__arrow"
				data-tone={a.tone ?? 'accent'}
				data-dashed={a.dashed ?? true}
				marker-end="url(#db-court-arrow-{listId})"
			/>
		{/each}

		{#each markers as m (m.id)}
			{#if mode === 'edit'}
				<g
					class="db-court-map__marker"
					data-kind={kindOf(m)}
					data-tone={m.tone ?? defaultTone[kindOf(m)]}
					data-selected={selected === m.id || undefined}
					role="button"
					tabindex="0"
					aria-label={describe(m)}
					onpointerdown={(e) => down(e, m.id)}
					onkeydown={(e) => nudge(e, m)}
				>
					{@render dot(m)}
				</g>
			{:else}
				<g
					class="db-court-map__marker"
					data-kind={kindOf(m)}
					data-tone={m.tone ?? defaultTone[kindOf(m)]}
					data-selected={selected === m.id || undefined}
				>
					{@render dot(m)}
				</g>
			{/if}
		{/each}
	</svg>
	{#if mode === 'view' && !heat && markers.length}
		<ul id={listId} class="db-court-map__sr">
			{#each markers as m (m.id)}<li>{describe(m)}</li>{/each}
		</ul>
	{/if}
</div>

<style>
	.db-court-map {
		--_turf: var(--color-success-subtle);
		--_glass: var(--color-border);
		--_line: var(--color-text-subtle);
		display: block;
		max-width: 100%;
		user-select: none;
		touch-action: none;
	}
	.db-court-map__svg {
		display: block;
		width: 100%;
		height: auto;
		font-family: var(--font-body);
	}
	.db-court-map[data-mode='edit'] .db-court-map__svg {
		cursor: crosshair;
	}
	.db-court-map__glass {
		fill: none;
		stroke: var(--_glass);
		stroke-width: 0.5;
		opacity: 0.8;
	}
	.db-court-map__turf {
		fill: var(--_turf);
		stroke: var(--color-success-border);
		stroke-width: 0.08;
	}
	.db-court-map__line {
		stroke: var(--_line);
		stroke-width: 0.08;
	}
	.db-court-map__net {
		stroke: var(--color-text);
		stroke-width: 0.14;
	}
	.db-court-map__label {
		fill: var(--color-text-muted);
		font-size: 0.55px;
		letter-spacing: 0.08px;
		text-anchor: middle;
		text-transform: uppercase;
	}
	.db-court-map__arrow {
		stroke-width: 0.12;
		fill: none;
		stroke: var(--color-accent);
	}
	.db-court-map__arrow[data-dashed='true'] {
		stroke-dasharray: 0.35 0.25;
	}
	.db-court-map__arrow[data-tone='warning'] {
		stroke: var(--color-warning);
	}
	.db-court-map__arrow[data-tone='danger'] {
		stroke: var(--color-danger);
	}
	.db-court-map__arrow[data-tone='neutral'] {
		stroke: var(--color-text-muted);
	}
	.db-court-map__marker circle {
		fill: var(--color-accent);
		stroke: var(--color-text);
		stroke-width: 0.08;
	}
	.db-court-map__marker[data-tone='warning'] circle {
		fill: var(--color-warning);
	}
	.db-court-map__marker[data-tone='danger'] circle {
		fill: var(--color-danger);
	}
	.db-court-map__marker[data-tone='success'] circle {
		fill: var(--color-success);
	}
	.db-court-map__marker[data-tone='info'] circle {
		fill: var(--color-info);
	}
	.db-court-map__marker[data-tone='neutral'] circle {
		fill: var(--color-surface);
		stroke: var(--color-text);
		stroke-dasharray: 0.18 0.12;
	}
	.db-court-map__marker[data-kind='correct'] circle {
		fill: var(--color-accent);
	}
	.db-court-map__marker[data-selected] circle {
		stroke: var(--color-focus);
		stroke-width: 0.18;
	}
	.db-court-map[data-mode='edit'] .db-court-map__marker {
		cursor: grab;
	}
	.db-court-map__marker:focus-visible {
		outline: none;
	}
	.db-court-map__marker:focus-visible circle {
		stroke: var(--color-focus);
		stroke-width: 0.2;
	}
	.db-court-map[data-heat] .db-court-map__marker circle {
		opacity: 0.45;
		stroke-width: 0.04;
	}
	.db-court-map__dot-label {
		fill: var(--color-text-inverse);
		font-size: 0.4px;
		font-weight: 600;
		text-anchor: middle;
		pointer-events: none;
	}
	.db-court-map__marker[data-tone='neutral'] .db-court-map__dot-label {
		fill: var(--color-text);
	}
	.db-court-map__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
