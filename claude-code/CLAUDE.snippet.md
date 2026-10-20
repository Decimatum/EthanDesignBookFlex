<!-- Paste into the consuming project's CLAUDE.md. Fill in the profile line. -->

## UI: Design Book

- All UI comes from `@ethan/designbook` (the Design Book at
  `/Users/ethanpak/ProgrammingLab/WebDesignFramework`). Use the `designbook` skill before any
  `.svelte` or CSS work; it points at `llms.txt`, the component READMEs and the rules.
- **Profile:** `public` | `app` | both (route groups `(public)` + `(app)`) — pick one, delete the others.
- **Theme:** `slate` | `folio` | `terminal`; density default `comfortable` | `compact`.
- Missing component → file it in the Book's `REQUESTS.md` and use a stub in `src/lib/_pending/`;
  never build a bespoke component here.
- Exact exports: `node_modules/@ethan/designbook/dist/index.d.ts`.
