#!/usr/bin/env node
/**
 * enlighten-agent-tool postinstall script
 * Sets up skills and commands for various agent frameworks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 Setting up Enlighten Agent Tool...\n');

const SKILLS_TO_INSTALL = [
  'enlighten',
  'enlighten-installer', 
  'enlighten-uninstaller'
];

const COMMAND_FILES = [
  'enlighten.md'
];

function getConfigDirs() {
  const dirs = [];
  
  // Check for Hermes
  if (process.env.HERMES_CONFIG_DIR || fs.existsSync(path.join(os.homedir(), '.hermes'))) {
    dirs.push({
      name: 'Hermes',
      skills: path.join(os.homedir(), '.hermes', 'skills'),
      commands: path.join(os.homedir(), '.hermes', 'commands')
    });
  }
  
  // Check for Claude Code
  const claudeHome = process.env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
  if (fs.existsSync(claudeHome)) {
    dirs.push({
      name: 'Claude Code',
      skills: path.join(claudeHome, 'skills'),
      commands: path.join(claudeHome, 'commands')
    });
  }
  
  // Check for Opencode
  const opencodeDir = process.env.OPENCODE_CONFIG_DIR || 
                      path.join(os.homedir(), '.config', 'opencode');
  if (fs.existsSync(opencodeDir)) {
    dirs.push({
      name: 'Opencode',
      skills: opencodeDir,
      commands: opencodeDir
    });
  }
  
  return dirs;
}

function installForFramework(hermesPath, projectRoot) {
  const skillsSrc = path.join(projectRoot, 'skills');
  const commandsSrc = path.join(projectRoot, 'commands');
  
  SKILLS_TO_INSTALL.forEach(skill => {
    const src = path.join(skillsSrc, skill);
    const dest = path.join(hermesPath.skills, skill);
    
    if (fs.existsSync(src)) {
      try {
        // Create parent directory
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        
        // Remove existing if present
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true });
        }
        
        // Copy skill
        fs.cpSync(src, dest, { recursive: true });
        console.log(`  ✅ Installed skill: ${skill}`);
      } catch (err) {
        console.log(`  ⚠️  Could not install skill: ${skill} - ${err.message}`);
      }
    }
  });
  
  // Copy commands (for frameworks that support them)
  COMMAND_FILES.forEach(cmd => {
    const src = path.join(commandsSrc, cmd);
    if (fs.existsSync(src)) {
      const dest = path.join(hermesPath.commands || hermesPath.skills, cmd);
      try {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        console.log(`  ✅ Installed command: /enlighten`);
      } catch (err) {
        console.log(`  ⚠️  Could not install command: ${cmd}`);
      }
    }
  });
}

function main() {
  const projectRoot = __dirname;
  const configDirs = getConfigDirs();
  
  if (configDirs.length === 0) {
    console.log('ℹ️  No agent frameworks detected.');
    console.log('Skills and commands are available at:');
    console.log('  ~/.hermes/skills/enlighten');
    console.log('  ~/.hermes/skills/enlighten-installer');
    console.log('  ~/.hermes/skills/enlighten-uninstaller');
    console.log('\nRun manually: node scripts/postinstall.js');
    return;
  }
  
  configDirs.forEach(dir => {
    console.log(`\n🔧 Installing for ${dir.name}...`);
    // Create directories if they don't exist
    if (!fs.existsSync(dir.skills)) {
      fs.mkdirSync(dir.skills, { recursive: true });
    }
    if (dir.commands && !fs.existsSync(dir.commands)) {
      fs.mkdirSync(dir.commands, { recursive: true });
    }
    
    installForFramework(dir, projectRoot);
  });
  
  console.log('\n✅ Installation complete!');
  console.log('\n📖 Usage:');
  console.log('  /enlighten install <repo-url>');
  console.log('  /enlighten diagnose <repo-url>');
  console.log('  /enlighten list-installed');
}

if (require.main === module) {
  main();
}

module.exports = { installForFramework, getConfigDirs };