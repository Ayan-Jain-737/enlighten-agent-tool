---
name: enlighten
description: >-
  Universal GitHub repository and skill installer for AI agent harnesses.
  Use this skill whenever asked to install, download, import, or set up any GitHub repository,
  tool, library, or agent skill. It automatically detects project types, scans for skills,
  registers discovered skills into global agent skill folders across harnesses (Antigravity,
  Claude Code, Hermes, OpenCode, Codex, Cursor), and executes build/install instructions suggested by the repository.
---

# Enlighten - Universal Agent Skill & Repository Installer

Enlighten allows AI agents and developers to download and install any GitHub repository in one command.
It automatically discovers skills inside repositories and registers them globally across all supported AI agent harnesses.

## Capabilities

1. **Auto-Discovery of Skills**: Detects `SKILL.md` files at repository roots or in subdirectories (`skills/*/SKILL.md`, `.agents/skills/*`, etc.).
2. **Global Skill Registration**: Instantly registers all found skills into:
   - Antigravity / Gemini (`~/.gemini/skills/`)
   - Open Agents (`~/.agents/skills/` & `~/.agents/.skill-lock.json`)
   - Claude Code (`~/.claude/skills/` & `~/.claude/commands/`)
   - Hermes (`~/.hermes/skills/` & `~/.hermes/commands/`)
   - OpenCode (`~/.config/opencode/skills/`)
   - Codex (`~/.codex/skills/`)
   - Cursor (`~/.cursor/skills/`)
   - Zed (`~/.zed/skills/`)
3. **Automatic Skill Synthesis**: If a repository is a tool without an existing `SKILL.md`, Enlighten generates an agent skill wrapper so agents can discover and use the newly installed tool.
4. **Executes Repo Suggestions**: Detects package managers (`npm`, `pip`, `cargo`, `go`, etc.) and suggested build/install commands from `README.md`, executes them, and links binaries to `~/.local/bin`.
5. **Full Lifecycle Management**: Includes diagnosis, installation, listing, and clean uninstallation.

---

## Agent Usage Instructions

When the user asks you to install, import, or set up a repository or skill, run the following:

### 1. Install Repository & Register Skills Globally
```bash
enlighten install <repo-url-or-shorthand>
```
*Fallback if CLI is not directly in PATH:*
```bash
node ~/.gemini/skills/enlighten/scripts/dispatch.js install <repo-url-or-shorthand>
```

**Examples:**
```bash
# Install by GitHub shorthand:
enlighten install vercel-labs/agent-skills

# Install by full URL:
enlighten install https://github.com/affaan-m/ECC

# Machine-readable JSON output:
enlighten install https://github.com/user/repo --json

# Preview without making changes:
enlighten install https://github.com/user/repo --dry-run
```

### 2. Inspect Repository Before Installing (Diagnose)
```bash
enlighten diagnose https://github.com/user/repo
```
Analyzes language, framework, dependencies, and skills without installing anything permanently.

### 3. List All Managed Installations
```bash
enlighten list-installed
```

### 4. Safe Removal (Uninstall)
```bash
enlighten uninstall <identifier> --force
```
Removes the cloned repository and unregisters all associated skills from all global agent skill folders.

---

## What Happens During Installation

```
1. Clone / Fetch Repo  → Downloaded into ~/.enlighten/repos/<owner>/<repo>
2. Scan & Classify    → Detects language, framework, package manager & profile
3. Skill Registration → All skills found in the repo are linked into ~/.gemini/skills/,
                         ~/.agents/skills/, ~/.claude/skills/, etc.
4. Repo Setup         → Runs repo-suggested commands (npm install, pip install, cargo build)
5. Expose Binaries    → Symlinks tool executables into ~/.local/bin
6. Registry Update    → Recorded in ~/.enlighten/cache/installed.json
```

## JSON Output Format

When run with `--json`:
```json
{
  "status": "success",
  "identifier": "owner-repo",
  "repo_url": "https://github.com/owner/repo.git",
  "install_dir": "/home/user/.enlighten/repos/owner/repo",
  "profile": "web-developer",
  "skills_registered": [
    {
      "name": "my-skill",
      "path": "/home/user/.enlighten/repos/owner/repo/skills/my-skill",
      "registeredHarnesses": ["Antigravity / Gemini", "Open Agents", "Claude Code", "Hermes"]
    }
  ],
  "exposed_binaries": ["my-cli"],
  "commands_run": ["npm install", "npm run build"]
}
```

## Troubleshooting

- **Permission error**: Ensure write access to `~/.gemini/skills/` and `~/.agents/skills/`.
- **Command not found**: Ensure `~/.local/bin` is in your `PATH`:
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```
- **Reinstall existing repo**: Add the `--force` flag:
  ```bash
  enlighten install <repo-url> --force
  ```
