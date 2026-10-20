# Claude Code kit

What a consuming project needs so Claude Code reaches for the Design Book instead of inventing UI.

| File                    | Goes where                                       | How                        |
| ----------------------- | ------------------------------------------------ | -------------------------- |
| `skills/designbook/`    | `~/.claude/skills/designbook` (once per machine) | `npm run skill:install`    |
| `CLAUDE.snippet.md`     | the app's `CLAUDE.md`                            | paste, fill in the profile |
| `settings.snippet.json` | the app's `.claude/settings.json`                | paste / merge              |

The skill is symlinked, not copied, so editing it here updates every project. Full guide: `../USING.md`.
