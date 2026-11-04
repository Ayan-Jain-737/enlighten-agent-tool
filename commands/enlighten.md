---
name: enlighten
description: Universal GitHub repository and skill installer for AI agent harnesses
usage: |
  /enlighten find <query> -- Discover agent skills, packages, and CLI tool repositories
  /enlighten install <repo-url> [--agent <name>] [--all-agents] -- Download/install repository and register skills for active agent and global store
  /enlighten diagnose <repo-url> -- Analyze repository without installing
  /enlighten list-installed -- Show all managed installations and registered skills
  /enlighten uninstall <id> --force -- Safely remove installation and unregister skills
author: Ayan-Jain-737
version: 2.0.0
---

# Enlighten

Universal GitHub repository and skill installer for AI agent harnesses.

```bash
/enlighten find react
/enlighten install https://github.com/user/repo
/enlighten diagnose https://github.com/user/repo
/enlighten list-installed
/enlighten uninstall <id> --force
```

Automatically detects language, framework, dependencies, and agent skills from any GitHub repository, registers skills into the calling agent's folder (e.g. `~/.gemini/skills/` for AGY) and global canonical storage (`~/.agents/skills/`), and configures executables for your environment without modifying unused agent folders.
