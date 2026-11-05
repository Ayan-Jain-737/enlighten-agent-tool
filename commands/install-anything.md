---
name: install-anything
description: Universal GitHub repository and skill installer for AI agent harnesses
usage: |
  /install-anything find <query> -- Discover agent skills, packages, and CLI tool repositories
  /install-anything install <repo-url> [--agent <name>] [--all-agents] -- Download/install repository and register skills for active agent and global store
  /install-anything diagnose <repo-url> -- Analyze repository without installing
  /install-anything list-installed -- Show all managed installations and registered skills
  /install-anything uninstall <id> --force -- Safely remove installation and unregister skills
author: Ayan-Jain-737
version: 2.0.0
---

# install-anything

Universal GitHub repository and skill installer for AI agent harnesses.

```bash
/install-anything find react
/install-anything install https://github.com/user/repo
/install-anything diagnose https://github.com/user/repo
/install-anything list-installed
/install-anything uninstall <id> --force
```

Automatically detects language, framework, dependencies, and agent skills from any GitHub repository, registers skills into the calling agent's folder (e.g. `~/.gemini/skills/` for AGY) and global canonical storage (`~/.agents/skills/`), and configures executables for your environment without modifying unused agent folders.
