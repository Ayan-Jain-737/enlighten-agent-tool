#!/usr/bin/env node
/**
 * enlighten - Universal GitHub Repository Installer
 * Main entry point
 */

module.exports = {
  install: require('./skills/enlighten-installer/scripts/install.js').install,
  uninstall: require('./skills/enlighten-uninstaller/scripts/uninstall.js').uninstall,
  diagnose: require('./skills/enlighten-installer/scripts/scan-repo.js').diagnose,
  listInstalled: require('./skills/enlighten-installer/scripts/list-installed.js').listInstalled
};