---
name: ias
description: >-
  Universal GitHub repository and skill installer for AI agent harnesses (Install Anything Skill).
  Use this skill whenever asked to install, download, import, or set up any GitHub repository,
  tool, library, or agent skill. It automatically detects project types, scans for skills,
  registers discovered skills into the active caller agent's skill folder (e.g., Antigravity / Gemini)
  and global canonical storage (~/.agents/skills/), without modifying or creating unused agent directories,
  and executes build/install instructions suggested by the repository.
---

# ias (Install Anything Skill) - Universal Agent Skill & Repository Installer

`ias` allows AI agents and developers to download and install any GitHub repository in one command.
It automatically discovers skills inside repositories and registers them for the active agent harness and global storage.

## Capabilities

1. **Auto-Discovery of Skills**: Detects `SKILL.md` files at repository roots or in subdirectories (`skills/*/SKILL.md`, `.agents/skills/*`, etc.).
2. **Active Agent & Global Registration**: Intelligently detects the calling agent and installs skills only for the active agent and global storage:
   - Antigravity / Gemini (`~/.gemini/skills/`)
   - Open Agents (`~/.agents/skills/` & `~/.agents/.skill-lock.json`)
   - Avoids creating or touching unused directories for other agents (like Codex, Zed, Cursor, etc.).
   - Can optionally target any specific harness with `--agent <name>` or all harnesses with `--all-agents`.
3. **Automatic Skill Synthesis**: If a repository is a tool without an existing `SKILL.md`, `ias` generates an agent skill wrapper so agents can discover and use the newly installed tool.
4. **Executes Repo Suggestions**: Detects package managers (`npm`, `pip`, `cargo`, `go`, etc.) and suggested build/install commands from `README.md`, executes them, and links binaries to `~/.local/bin`.
5. **Full Lifecycle Management**: Includes diagnosis, installation, listing, and clean uninstallation.

---

## Agent Usage Instructions

When the user asks you to install, import, or set up a repository or skill, run the following:

### 1. Discover Skills & Tool Repositories (Find)
```bash
ias find <query>
```
Searches the open registry (`skills.sh`), curated battle-tested skills, and developer tool repositories.

**Examples:**
```bash
# Find skills or tools for React:
ias find react

# Find testing tools (Playwright, Vitest, Jest):
ias find testing

# Machine-readable output for agent consumption:
ias find <query> --json
```

### 2. Install Repository & Register Skills
```bash
ias install <repo-url-or-shorthand>
```
*Fallback if CLI is not directly in PATH:*
```bash
node ~/.gemini/skills/ias/scripts/dispatch.js install <repo-url-or-shorthand>
```

**Examples:**
```bash
# Install by GitHub shorthand:
ias install vercel-labs/agent-skills

# Install by full URL:
ias install https://github.com/affaan-m/ECC

# Machine-readable JSON output:
ias install https://github.com/user/repo --json

# Preview without making changes:
ias install https://github.com/user/repo --dry-run
```

### 3. Inspect Repository Before Installing (Diagnose)
```bash
ias diagnose https://github.com/user/repo
```
Analyzes language, framework, dependencies, and skills without installing anything permanently.

### 4. List All Managed Installations
```bash
ias list-installed
```

### 5. Safe Removal (Uninstall)
```bash
ias uninstall <identifier> --force
```
Removes the cloned repository and unregisters all associated skills from all global agent skill folders.

---

## What Happens During Installation

```
1. Clone / Fetch Repo  → Downloaded into ~/.install-anything/repos/<owner>/<repo>
2. Scan & Classify    → Detects language, framework, package manager & profile
3. Skill Registration → Skills are linked into the active agent folder (~/.gemini/skills/)
                         and canonical global storage (~/.agents/skills/)
4. Repo Setup         → Runs repo-suggested commands (npm install, pip install, cargo build)
5. Expose Binaries    → Symlinks tool executables into ~/.local/bin
6. Registry Update    → Recorded in ~/.install-anything/cache/installed.json
```

## JSON Output Format

When run with `--json`:
```json
{
  "status": "success",
  "identifier": "owner-repo",
  "repo_url": "https://github.com/owner/repo.git",
  "install_dir": "/home/user/.install-anything/repos/owner/repo",
  "profile": "web-developer",
  "skills_registered": [
    {
      "name": "my-skill",
      "path": "/home/user/.install-anything/repos/owner/repo/skills/my-skill",
      "registeredHarnesses": ["Open Agents", "Antigravity / Gemini"]
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
  ias install <repo-url> --force
  ```
