---
name: install-anything-uninstaller
description: >-
  Safely uninstalls install-anything-managed repositories.
  Removes cloned repository directories, unregisters all corresponding skills from global agent
  skill folders across all harnesses, and unlinks exposed binaries.
---

# install-anything Uninstaller

The **install-anything Uninstaller** safely removes any repository installed by install-anything.

## Features

- ✅ **Complete Skill Unregistration**: Unregisters skills from Antigravity, Open Agents, Claude Code, Hermes, etc.
- ✅ **Binary Cleanup**: Removes symlinks from `~/.local/bin`
- ✅ **Repository Removal**: Deletes repo clones from `~/.install-anything/repos/`
- ✅ **Registry Maintenance**: Updates `~/.install-anything/cache/installed.json` and `~/.agents/.skill-lock.json`
- ✅ **Dry Run Support**: Test what will be removed before committing

## CLI Commands

```bash
# List all installed items to find identifier:
install-anything list-installed

# Preview uninstall (dry-run):
install-anything uninstall <identifier> --dry-run

# Safe removal:
install-anything uninstall <identifier> --force
```
