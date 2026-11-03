#!/usr/bin/env node
/**
 * enlighten install script
 * Installs enlighten skills globally or for the current project
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS = [
  'enlighten-installer',
  'enlighten-uninstaller',
  'enlighten'
];

const COMMANDS = [
  '/enlighten'
];

function getInstallDir() {
  // Try to detect current harness
  if (process.env.HERMES_CONFIG_DIR) {
    return process.env.HERMES_CONFIG_DIR;
  }
  if (process.env.CLAUDE_HOME) {
    return path.join(process.env.CLAUDE_HOME, 'skills');
  }
  if (process.env.OPENCODE_CONFIG_DIR) {
    return process.env.OPENCODE_CONFIG_DIR;
  }
  
  // Default to hermes-style
  return path.join(os.homedir(), '.hermes', 'skills');
}

function install() {
  const targetDir = getInstallDir();
  const projectDir = __dirname; // Where this script lives
  
  console.log(`Installing enlighten to: ${targetDir}\n`);
  
  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy skills
  for (const skill of SKILLS) {
    const src = path.join(projectDir, 'skills', skill);
    const dest = path.join(targetDir, skill);
    
    if (fs.existsSync(src)) {
      // Remove existing
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true });
      }
      // Copy
      fs.cpSync(src, dest, { recursive: true });
      console.log(`✓ Installed skill: ${skill}`);
    }
  }
  
  // Copy scripts
  const binSrc = path.join(projectDir, 'bin');
  const binDest = path.join(os.homedir(), '.local', 'bin');
  
  if (fs.existsSync(binSrc) && fs.existsSync(binDest)) {
    fs.copyFileSync(
      path.join(binSrc, 'enlighten'),
      path.join(binDest, 'enlighten')
    );
    console.log('✓ Installed CLI binary');
  }
  
  console.log('\n✅ Installation complete!');
  console.log('Usage: /enlighten install <repo-url>');
}

if (require.main === module) {
  install();
}

module.exports = { install, getInstallDir };