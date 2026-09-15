/**
 * Toast store. Import `toast` anywhere and call it; render one `<Toaster />` near the root.
 *
 *   toast('Saved');
 *   toast.success('Order filled', { description: '100 AAPL @ 189.20' });
 *   toast.error('Failed to save', { action: { label: 'Retry', onClick: retry }, duration: 0 });
 */
import type { Snippet } from 'svelte';

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
	tone?: ToastTone;
	description?: string;
	/** Auto-dismiss after this many ms. `0` keeps it until dismissed. */
	duration?: number;
	action?: { label: string; onClick: () => void };
	/** Reuse an id to update an existing toast in place (e.g. loading → success). */
	id?: string;
	dismissible?: boolean;
	icon?: Snippet;
}

export interface ToastItem extends Required<
	Pick<ToastOptions, 'tone' | 'duration' | 'dismissible'>
> {
	id: string;
	title: string;
	description?: string;
	action?: ToastOptions['action'];
	icon?: Snippet;
	createdAt: number;
	/** Monotonic; changes on every add/update so the Toaster can re-time an updated toast. */
	seq: number;
}

const DEFAULT_DURATION = 5000;
let counter = 0;
let seq = 0;

class ToastStore {
	items = $state<ToastItem[]>([]);
	/** Maximum visible at once; older ones are dropped. */
	max = 5;

	add(title: string, options: ToastOptions = {}): string {
		const id = options.id ?? `toast-${++counter}`;
		const item: ToastItem = {
			id,
			title,
			description: options.description,
			tone: options.tone ?? 'neutral',
			duration: options.duration ?? DEFAULT_DURATION,
			dismissible: options.dismissible ?? true,
			action: options.action,
			icon: options.icon,
			createdAt: Date.now(),
			seq: ++seq
		};
		const existing = this.items.findIndex((t) => t.id === id);
		if (existing >= 0) this.items[existing] = item;
		else this.items = [...this.items, item].slice(-this.max);
		return id;
	}

	dismiss(id: string) {
		this.items = this.items.filter((t) => t.id !== id);
	}

	clear() {
		this.items = [];
	}
}

export const toasts = new ToastStore();

type ToastFn = ((title: string, options?: ToastOptions) => string) & {
	[K in Exclude<ToastTone, 'neutral'>]: (
		title: string,
		options?: Omit<ToastOptions, 'tone'>
	) => string;
} & {
	dismiss: (id: string) => void;
	clear: () => void;
	/** Track a promise: shows loading, then success or error. */
	promise: <T>(
		p: Promise<T>,
		messages: {
			loading: string;
			success: string | ((v: T) => string);
			error: string | ((e: unknown) => string);
		}
	) => Promise<T>;
};

const base = ((title, options) => toasts.add(title, options)) as ToastFn;
base.info = (t, o) => toasts.add(t, { ...o, tone: 'info' });
base.success = (t, o) => toasts.add(t, { ...o, tone: 'success' });
base.warning = (t, o) => toasts.add(t, { ...o, tone: 'warning' });
base.danger = (t, o) => toasts.add(t, { ...o, tone: 'danger' });
base.dismiss = (id) => toasts.dismiss(id);
base.clear = () => toasts.clear();
base.promise = async (p, messages) => {
	const id = toasts.add(messages.loading, { tone: 'neutral', duration: 0, dismissible: false });
	try {
		const value = await p;
		toasts.add(
			typeof messages.success === 'function' ? messages.success(value) : messages.success,
			{
				id,
				tone: 'success'
			}
		);
		return value;
	} catch (err) {
		toasts.add(typeof messages.error === 'function' ? messages.error(err) : messages.error, {
			id,
			tone: 'danger'
		});
		throw err;
	}
};

export const toast = base;
