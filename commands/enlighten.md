---
name: enlighten
description: Universal GitHub repository and skill installer for AI agent harnesses
usage: |
  /enlighten install <repo-url> -- Download/install repository and register skills globally
  /enlighten diagnose <repo-url> -- Analyze repository without installing
  /enlighten list-installed -- Show all managed installations and registered skills
  /enlighten uninstall <id> --force -- Safely remove installation and unregister skills
author: Ayan-Jain-737
version: 2.0.0
---

# Enlighten

Universal GitHub repository and skill installer for AI agent harnesses.

```bash
/enlighten install https://github.com/user/repo
/enlighten diagnose https://github.com/user/repo
/enlighten list-installed
/enlighten uninstall <id> --force
```

Automatically detects language, framework, dependencies, and agent skills from any GitHub repository, registers skills into global skill folders across agent harnesses, and configures executables for your environment.
