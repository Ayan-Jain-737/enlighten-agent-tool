---
name: ias
description: Universal GitHub repository and skill installer for AI agent harnesses (Install Anything Skill)
usage: |
  /ias find <query> -- Discover agent skills, packages, and CLI tool repositories
  /ias install <repo-url> [--agent <name>] [--all-agents] -- Download/install repository and register skills for active agent and global store
  /ias diagnose <repo-url> -- Analyze repository without installing
  /ias list-installed -- Show all managed installations and registered skills
  /ias uninstall <id> --force -- Safely remove installation and unregister skills
author: Ayan-Jain-737
version: 2.0.0
---

# ias (Install Anything Skill)

Universal GitHub repository and skill installer for AI agent harnesses.

```bash
/ias find react
/ias install https://github.com/user/repo
/ias diagnose https://github.com/user/repo
/ias list-installed
/ias uninstall <id> --force
```

Automatically detects language, framework, dependencies, and agent skills from any GitHub repository, registers skills into the calling agent's folder (e.g. `~/.gemini/skills/` for AGY) and global canonical storage (`~/.agents/skills/`), and configures executables for your environment without modifying unused agent folders.
