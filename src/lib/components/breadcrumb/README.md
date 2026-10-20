# Breadcrumb

Shows where the current page sits in a hierarchy and lets the user jump back up. Long trails collapse the middle into an ellipsis that expands on click.

```svelte
<script>
	import { Breadcrumb } from '@ethan/designbook';
</script>

<Breadcrumb
	items={[
		{ label: 'Home', href: '/' },
		{ label: 'Accounts', href: '/accounts' },
		{ label: 'Brokerage', href: '/accounts/brokerage' },
		{ label: 'MSFT' }
	]}
/>
```

## Props

| Prop       | Type                                 | Default        | Description                                                         |
| ---------- | ------------------------------------ | -------------- | ------------------------------------------------------------------- |
| `items`    | `{ label: string; href?: string }[]` | —              | **Required.** The last item is the current page; omit its `href`.   |
| `maxItems` | `number`                             | `4`            | Collapse the middle into an ellipsis when there are more than this. |
| `label`    | `string`                             | `'Breadcrumb'` | Accessible name of the `<nav>` landmark.                            |
| `class`    | `string`                             | —              |                                                                     |

## Keyboard

Plain links and one button — `Tab` moves through them, `Enter` follows a link or expands the ellipsis.

## Accessibility

- `<nav aria-label>` containing an ordered list, the WAI-ARIA breadcrumb pattern.
- The current page is rendered as text with `aria-current="page"`, never as a link to itself.
- Separators are `aria-hidden` icons, so screen readers announce only the trail.
- The ellipsis is a real button labelled "Show all breadcrumbs".

## Tokens used

`--color-text*`, `--color-component`, `--space-*`, `--text-sm`, `--weight-medium`, `--radius-xs`, `--focus-ring`, `--transition-colors`

## Anatomy

```
<nav class="db-breadcrumb" aria-label>
  <ol class="db-breadcrumb__list">
    <li class="db-breadcrumb__item">
      <a class="db-breadcrumb__link"> | <button class="db-breadcrumb__ellipsis"> | <span class="db-breadcrumb__current" aria-current="page">
      <svg class="db-breadcrumb__sep">
```
