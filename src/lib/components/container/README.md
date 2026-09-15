# Container

Centres content with a max width from the `--container-*` scale and page-level horizontal padding.

```svelte
<script>
	import { Container } from '@ethan/designbook';
</script>

<Container as="main" size="md">
	<article>…</article>
</Container>
```

## Props

| Prop     | Type                                                                | Default | Description                                |
| -------- | ------------------------------------------------------------------- | ------- | ------------------------------------------ |
| `as`     | `'div' \| 'section' \| 'main' \| 'article' \| 'header' \| 'footer'` | `'div'` |                                            |
| `size`   | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                            | `'lg'`  | Max width (`40 / 48 / 64 / 80rem / none`). |
| `padded` | `boolean`                                                           | `true`  | Apply `--page-px` horizontally.            |
| `class`  | `string`                                                            | —       |                                            |

All other props are forwarded to the root element.

## Snippets

| Snippet    | Description |
| ---------- | ----------- |
| `children` | Content.    |

## Keyboard

Not interactive.

## Accessibility

- Pure layout. Prefer `as="main"` for the page's primary content region.

## Tokens used

`--container-*`, `--page-px`

## Anatomy

```
<div class="db-container" data-size [data-padded]>
```
