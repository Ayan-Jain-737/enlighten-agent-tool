#!/usr/bin/env node
/**
 * enlighten-agent-tool postinstall
 * Automatically called on npm install / global install to register skills
 */

const { SelfInstaller } = require('./install');

try {
  const installer = new SelfInstaller();
  installer.install();
} catch (err) {
  console.log(`⚠️  postinstall notice: ${err.message}`);
}
