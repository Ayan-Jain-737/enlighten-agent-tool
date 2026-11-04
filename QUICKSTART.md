# enlighten-agent-tool - Quick Start Guide

## 🚀 1-Command Installation

Anyone can install Enlighten in one command:

```bash
# 1-command curl installer (installs CLI to ~/.local/bin and registers skills across all harnesses)
curl -fsSL https://raw.githubusercontent.com/Ayan-Jain-737/enlighten-agent-tool/main/scripts/install.sh | bash
```

Or via `skills` CLI:
```bash
npx skills add Ayan-Jain-737/enlighten-agent-tool -g -y
```

Or via `npm`:
```bash
npm install -g enlighten-agent-tool
```

---

## ⚡ Using Enlighten in Agent Harnesses

Once installed, Enlighten is registered in all agent harnesses:
- **Antigravity / Gemini**: `~/.gemini/skills/enlighten`
- **Open Agents**: `~/.agents/skills/enlighten`
- **Claude Code**: `~/.claude/skills/enlighten` & `/enlighten` command
- **Hermes**: `~/.hermes/skills/enlighten` & `/enlighten` command
- **OpenCode**: `~/.config/opencode/skills/enlighten`
- **Codex / Cursor / Zed**: global skills

Ask your agent:
> *"Use enlighten to install https://github.com/vercel-labs/agent-skills"*

Or run directly:
```bash
enlighten install vercel-labs/agent-skills
```

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `enlighten install <url>` | Download repository, register skills globally, run setup |
| `enlighten diagnose <url>` | Scan repository (language, framework, skills, binaries) |
| `enlighten list-installed` | List all installed repositories and registered skills |
| `enlighten uninstall <id> --force` | Safe removal of repository, binaries, and registered skills |
| `enlighten --help` | Show command line options |

### Examples

```bash
# Install a multi-skill repository (all skills registered globally)
enlighten install vercel-labs/agent-skills

# Install a tool repository (auto-synthesizes skill and exposes binaries)
enlighten install Graphify-Labs/graphify

# Preview what would happen (dry-run)
enlighten install https://github.com/user/repo --dry-run

# Output JSON for agent automation
enlighten install https://github.com/user/repo --json

# Analyze before installing
enlighten diagnose https://github.com/vercel/next.js

# List all installations
enlighten list-installed

# Safely uninstall
enlighten uninstall vercel-labs-agent-skills --force
```

---

## 🧠 What Happens Behind the Scenes

When an agent runs `enlighten install <repo-url>`:
1. Clones the repository to `~/.enlighten/repos/<owner>/<repo>`.
2. Scans for any `SKILL.md` files (in root, `skills/`, `.agents/skills/`, etc.).
3. Registers every found skill into all global agent skill directories (`~/.gemini/skills/`, `~/.agents/skills/`, `~/.claude/skills/`, `~/.hermes/skills/`, etc.).
4. If no skills exist, generates a tailored `SKILL.md` agent skill wrapper for the tool.
5. Runs package manager and build steps as suggested by the repo (`npm install`, `pip install`, `cargo build`, etc.).
6. Links tool binaries into `~/.local/bin/`.
7. Records the installation in `~/.enlighten/cache/installed.json` and updates `~/.agents/.skill-lock.json`.
