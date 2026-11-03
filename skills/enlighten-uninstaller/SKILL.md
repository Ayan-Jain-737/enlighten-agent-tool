---
name: enlighten-uninstaller
description: Safely removes enlighten-managed installations. Cleans up files, configs, CLI aliases, and hooks. Includes dependency checks and user confirmation.
tags:
  - uninstaller
  - cleanup
  - profile-management
  - system-tools
author: Ayan-Jain-737
version: "2.0.0"
---

# Enlighten Uninstaller

The **Enlighten Uninstaller** provides safe, complete removal of any enlighten-managed installation. It's designed to be as reliable as the installer itself.

## Usage

```bash
/enlighten uninstall <identifier>
/enlighten uninstall --list
/enlighten uninstall <identifier> --dry-run
/enlighten uninstall <identifier> --force
```

## Command Line

```bash
# List all installed items
./enlighten-uninstaller --list

# Interactive uninstall
./enlighten-uninstaller --interactive

# Silent uninstall
./enlighten-uninstaller my-plugin-xyz --force
```

## Uninstall Workflow

```
1. Verify Installation
   ↓
2. Check Dependencies (what else uses it?)
   ↓
3. Show Impact Report
   ↓
4. Ask for Confirmation
   ↓
5. Execute Uninstall
   ↓
6. Verify Cleanup
   ↓
7. Report Success/Failure
```

## Safety Features

### Pre-Uninstall Checks
- ✅ **Dependency Audit** - Will anything break if removed?
- ✅ **Impact Report** - What files/configs will be affected?
- ✅ **User Confirmation** - Explicit approval required
- ✅ **Backup Option** - Optional backup before removal

### Dry Run Mode
```bash
/enlighten uninstall my-repo --dry-run
```
Shows exactly what would happen without making changes:
```
PRE-UNINSTALL CHECK
===================
✓ Installation found: my-repo (v1.2.3)
✓ No dependencies using this
✓ Harness detected: hermes

IMPACT REPORT
=============
Files to remove:
  • ~/.hermes/plugins/my-repo/
  • ~/.hermes/skills/my-repo/*/
  • ~/.hermes/commands/my-repo.md
  • ~/.hermes/profiles/default/profile.json (modified)

Configs to restore:
  • backup ~/.hermes/config.yaml.bak → config.yaml

Proceed? (y/N)
```

## What Gets Removed

### For Plugin Installations
- Plugin directory in harness
- Skill files
- Command definitions
- Hook configurations
- Profile modifications
- Cache and logs

### For Tool Installations
- Binary/executable
- Configuration files
- Aliases/shell functions
- Environment variables
- Data directories

## Post-Uninstall Actions

After removal, the system:
1. **Verifies** all files are cleaned
2. **Restores** any backed-up configs
3. **Updates** installation registry
4. **Reports** final status

## Examples

### List all enlighten installations
```bash
/enlighten uninstall --list
```
```
INSTALLED BY ENLIGHTEN
======================
my-plugin      github:user/my-plugin (v1.0.0)
ECC-profiles   local installation
enlighten-tool self-managed

Total: 3 installations
```

### Uninstall with full report
```bash
/enlighten uninstall my-plugin
```
```
🔍 Verifying installation...
✓ Found: github:user/my-plugin

📋 Impact Analysis
==================
• 12 files to remove
• 1 directory to delete  
• 2 config files modified
• CLI: 1 alias to remove

⚠️  WARNING: This will affect 2 other installed tools

🔄 Backup created: ~/.enlighten/backups/my-plugin-2024-01-15.tar.gz

🗑️  Removing files...
[1/12] Deleting plugin directory...
[2/12] Removing skill files...
[3/12] Cleaning config...
...
[12/12] Cleanup complete

✅ Successfully uninstalled my-plugin
```

## Configuration

```bash
# Set backup retention
ENLIGHTEN_BACKUP_RETENTION=7  # days

# Auto-confirm non-destructive removes
ENLIGHTEN_AUTO_CONFIRM=true

# Verbose logging
ENLIGHTEN_LOG_LEVEL=debug
```

## Force Uninstall

```bash
/enlighten uninstall broken-install --force
```
Skips all checks and removes immediately. **Use with caution!**

## Recovery

If something goes wrong:
```bash
# List backups
/enlighten uninstall --backups

# Restore specific backup  
/enlighten uninstall --restore my-plugin-2024-01-15.tar.gz
```

## Error Handling

| Error | Solution |
|-------|----------|
| `Not an enlighten installation` | Only removes self-managed installs |
| `Files in use` | Close programs, retry |
| `Permission denied` | Run with sudo or check permissions |
| `Backup failed` | Proceed without backup (risky) |

## Related

- `/enlighten list-installed` - See what's installed
- `/enlighten diagnose` - Check installation health
- `/enlighten repair` - Fix broken installations