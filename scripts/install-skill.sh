#!/usr/bin/env sh
# Symlink the Design Book skill into Claude Code's personal skills folder, so every
# Claude Code session on this machine knows to use the Book for UI work.
set -e
here="$(cd "$(dirname "$0")/.." && pwd)"
src="$here/claude-code/skills/designbook"
dest="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/designbook"
mkdir -p "$(dirname "$dest")"
if [ -L "$dest" ] || [ -e "$dest" ]; then
	if [ "$(readlink "$dest" 2>/dev/null)" = "$src" ]; then
		echo "already installed: $dest -> $src"
		exit 0
	fi
	echo "exists and is not this skill: $dest — remove it first" >&2
	exit 1
fi
ln -s "$src" "$dest"
echo "installed: $dest -> $src"
echo "Next: paste claude-code/CLAUDE.snippet.md into your project's CLAUDE.md and"
echo "      claude-code/settings.snippet.json into its .claude/settings.json"
