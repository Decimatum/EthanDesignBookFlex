# Link

An inline text link. Use it inside prose and tables; use `Button` with `href` for call-to-action links that should look like buttons.

```svelte
<script>
	import { Link } from '@ethan/designbook';
</script>

<p>Read the <Link href="/docs/orders">order guide</Link> before trading.</p>
<Link href="https://sec.gov" external>SEC filings</Link>
<Link href="/settings" tone="muted" subtle>Settings</Link>
```

## Props

| Prop       | Type                               | Default    | Description                                                             |
| ---------- | ---------------------------------- | ---------- | ----------------------------------------------------------------------- |
| `href`     | `string`                           | —          | **Required.**                                                           |
| `tone`     | `'accent' \| 'inherit' \| 'muted'` | `'accent'` | `inherit` keeps the surrounding colour and only underlines.             |
| `subtle`   | `boolean`                          | `false`    | Underline only on hover.                                                |
| `external` | `boolean`                          | `false`    | `target="_blank"`, `rel="noopener noreferrer"`, an icon and an SR note. |
| `class`    | `string`                           | —          |                                                                         |

Snippets: `children` (label), `trailing` (icon after the label; replaces the external icon). All other anchor attributes are forwarded; explicit `target`/`rel` win over `external`.

## Accessibility

- Links are underlined by default so they are not identified by colour alone; `subtle` should be reserved for navigation lists where the context makes links obvious.
- External links append a visually hidden "(opens in a new tab)".
- Focus shows the shared focus ring.

## Tokens used

`--color-accent-text`, `--color-accent-hover`, `--color-text*`, `--radius-xs`, `--focus-ring`, `--duration-fast`, `--ease-standard`, `--transition-colors`

## Anatomy

```
<a class="db-link" data-tone [data-subtle]>label <span class="db-link__icon"> <span class="sr-only">
```
