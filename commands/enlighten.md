---
name: enlighten
description: Universal GitHub repository installer for AI agent harnesses
usage: |
  /enlighten install <repo-url> -- Install a GitHub repository automatically
  /enlighten diagnose <repo-url> -- Analyze repository without installing
  /enlighten list-installed -- Show all managed installations
  /enlighten uninstall <id> -- Remove an installation
author: Ayan-Jain-737
version: 1.0.0
---

# Enlighten

Universal GitHub repository installer for AI agent harnesses.

```bash
/enlighten install https://github.com/user/repo
/enlighten diagnose https://github.com/user/repo
/enlighten list-installed
/enlight uninstall <id> --force
```

Automatically detects language, framework, and dependencies from any GitHub repository and configures it for your agent harness.