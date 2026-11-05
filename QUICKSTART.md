# install-anything-skill - Quick Start Guide

## 🚀 1-Command Installation

Anyone can install install-anything in one command:

```bash
# 1-command curl installer (installs CLI to ~/.local/bin and registers skills across all harnesses)
curl -fsSL https://raw.githubusercontent.com/Ayan-Jain-737/install-anything-skill/main/scripts/install.sh | bash
```

Or via `skills` CLI:
```bash
npx skills add Ayan-Jain-737/install-anything-skill -g -y
```

Or via `npm`:
```bash
npm install -g install-anything-skill
```

---

## ⚡ Using install-anything in Agent Harnesses

Once installed, install-anything is registered in all agent harnesses:
- **Antigravity / Gemini**: `~/.gemini/skills/install-anything`
- **Open Agents**: `~/.agents/skills/install-anything`
- **Claude Code**: `~/.claude/skills/install-anything` & `/install-anything` command
- **Hermes**: `~/.hermes/skills/install-anything` & `/install-anything` command
- **OpenCode**: `~/.config/opencode/skills/install-anything`
- **Codex / Cursor / Zed**: global skills

Ask your agent:
> *"Use install-anything to install https://github.com/vercel-labs/agent-skills"*

Or run directly:
```bash
install-anything install vercel-labs/agent-skills
```

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `install-anything install <url>` | Download repository, register skills globally, run setup |
| `install-anything diagnose <url>` | Scan repository (language, framework, skills, binaries) |
| `install-anything list-installed` | List all installed repositories and registered skills |
| `install-anything uninstall <id> --force` | Safe removal of repository, binaries, and registered skills |
| `install-anything --help` | Show command line options |

---

## 💡 Quick Examples

```bash
# Install a skill repo by shorthand
install-anything install vercel-labs/agent-skills

# Install a tool repository
install-anything install Graphify-Labs/graphify

# Dry run (see what would happen without making changes)
install-anything install https://github.com/user/repo --dry-run

# Output JSON for agents
install-anything install https://github.com/user/repo --json

# Diagnose a repository
install-anything diagnose https://github.com/vercel/next.js

# View installed repositories
install-anything list-installed

# Remove an installation
install-anything uninstall vercel-labs-agent-skills --force
```

---

## 🔍 How it Works

When an agent runs `install-anything install <repo-url>`:
1. Clones the repository to `~/.install-anything/repos/<owner>/<repo>`.
2. Scans for language, framework, dependencies, and existing `SKILL.md` files.
3. Automatically registers discovered skills into `~/.gemini/skills/` (for Antigravity) and canonical `~/.agents/skills/`.
4. If no skills exist, auto-synthesizes a tailored `SKILL.md` tool wrapper.
5. Runs suggested install commands (`npm install`, `pip install`, `cargo build`, etc.).
6. Symlinks any tool binaries to `~/.local/bin/`.
7. Records the installation in `~/.install-anything/cache/installed.json` and updates `~/.agents/.skill-lock.json`.
