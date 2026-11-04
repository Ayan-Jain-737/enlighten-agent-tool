---
name: enlighten-uninstaller
description: >-
  Safely uninstalls enlighten-managed repositories.
  Removes cloned repository directories, unregisters all corresponding skills from global agent
  skill folders across all harnesses, and unlinks exposed binaries.
---

# Enlighten Uninstaller

The **Enlighten Uninstaller** safely removes any repository installed by Enlighten.

## Features

- ✅ **Complete Skill Unregistration**: Unregisters skills from Antigravity, Open Agents, Claude Code, Hermes, etc.
- ✅ **Binary Cleanup**: Removes symlinks from `~/.local/bin`
- ✅ **Repository Removal**: Deletes repo clones from `~/.enlighten/repos/`
- ✅ **Registry Maintenance**: Updates `~/.enlighten/cache/installed.json` and `~/.agents/.skill-lock.json`
- ✅ **Dry Run Support**: Test what will be removed before committing

## CLI Commands

```bash
# List all installed items to find identifier:
enlighten list-installed

# Preview uninstall (dry-run):
enlighten uninstall <identifier> --dry-run

# Safe removal:
enlighten uninstall <identifier> --force
```
