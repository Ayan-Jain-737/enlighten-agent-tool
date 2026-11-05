#!/usr/bin/env node
/**
 * install.js - Self-Registering Skill Installer for install-anything-skill
 * Automatically registers install-anything in all agent harnesses (Antigravity, Open Agents,
 * Claude Code, Hermes, OpenCode, Codex, Cursor, Zed) and links CLI binary.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { SkillRegistry } = require('../skills/install-anything-installer/scripts/skill-registry');

class SelfInstaller {
  constructor() {
    this.projectDir = path.resolve(__dirname, '..');
    this.homedir = os.homedir();
    this.registry = new SkillRegistry({ homedir: this.homedir });
    this.installedSkills = [];
    this.installedCommands = [];
    this.binaryLinked = false;
  }

  install() {
    console.log('\n========================================================');
    console.log('✨ Installing install-anything Skills & CLI');
    console.log('========================================================\n');

    // 1. Link CLI binary to ~/.local/bin/install-anything
    this.linkBinary();

    // 2. Discover and register skills from this project
    this.registerProjectSkills();

    // 3. Register slash commands
    this.registerCommands();

    // 4. Update .skill-lock.json
    this.updateSkillLock();

    console.log('\n========================================================');
    console.log('🎉 install-anything Skills Registration Complete!');
    console.log('========================================================\n');
    console.log('Available Commands & Skills:');
    console.log('  • CLI: install-anything install <repo-url>');
    console.log('  • Slash Command: /install-anything install <repo-url>');
    console.log('  • Registered Skills:');
    this.installedSkills.forEach(s => {
      console.log(`    - ${s.name} (${s.harnesses.length} agent harnesses)`);
    });
    console.log('\nRegistered In:');
    const registeredHarnesses = new Set();
    this.installedSkills.forEach(s => s.harnesses.forEach(h => registeredHarnesses.add(h)));
    registeredHarnesses.forEach(h => {
      console.log(`  ✓ ${h}`);
    });
    console.log('\n💡 Tip: Your active AI agent can now use the skill to install any repository,');
    console.log('and skills will register for your active agent and global store automatically!\n');
  }

  linkBinary() {
    const binSrc = path.join(this.projectDir, 'bin', 'install-anything');
    const localBin = path.join(this.homedir, '.local', 'bin');
    const binDest = path.join(localBin, 'install-anything');
    const aliasDest = path.join(localBin, 'install-anything-skill');
    const legacyDest = path.join(localBin, 'enlighten');

    try {
      if (!fs.existsSync(localBin)) {
        fs.mkdirSync(localBin, { recursive: true });
      }
      fs.chmodSync(binSrc, 0o755);

      for (const dest of [binDest, aliasDest, legacyDest]) {
        try {
          if (fs.existsSync(dest) || fs.lstatSync(dest, { throwIfNoEntry: false })) {
            fs.rmSync(dest, { force: true });
          }
          fs.symlinkSync(binSrc, dest);
        } catch {}
      }

      this.binaryLinked = true;
      console.log(`✅ Linked CLI executable: ~/.local/bin/install-anything -> ${binSrc}`);
    } catch (e) {
      console.log(`⚠️  Could not link ~/.local/bin/install-anything: ${e.message}`);
    }
  }

  registerProjectSkills() {
    const skillsDir = path.join(this.projectDir, 'skills');
    const skillNames = ['install-anything', 'install-anything-installer', 'install-anything-uninstaller'];
    const isAllHarnesses = process.argv.includes('--all') || process.argv.includes('--all-agents');

    for (const name of skillNames) {
      const dir = path.join(skillsDir, name);
      const skillFile = path.join(dir, 'SKILL.md');
      if (fs.existsSync(dir) && fs.existsSync(skillFile)) {
        const parsed = this.registry.parseSkillMd(skillFile) || {};
        const skillInfo = {
          name,
          description: parsed.description || 'install-anything agent skill',
          version: parsed.version || '2.0.0',
          skillDir: dir,
          skillFilePath: skillFile,
          relativePath: `skills/${name}`
        };

        const result = this.registry.registerSkill(skillInfo, {
          repoUrl: 'https://github.com/Ayan-Jain-737/install-anything-skill.git',
          allHarnesses: isAllHarnesses
        });

        this.installedSkills.push({
          name,
          harnesses: result.registeredHarnesses.map(h => h.harness)
        });
        console.log(`✅ Registered skill "${name}" in [${result.registeredHarnesses.map(h => h.harness).join(', ')}]`);
      }
    }
  }

  registerCommands() {
    const commandsDir = path.join(this.projectDir, 'commands');
    const isAllHarnesses = process.argv.includes('--all') || process.argv.includes('--all-agents');
    const registered = this.registry.registerCommands(commandsDir, { allHarnesses: isAllHarnesses });
    for (const item of registered) {
      console.log(`✅ Registered slash command "/${item.file.replace('.md', '')}" in ${item.harness}`);
    }
    this.installedCommands = registered;
  }

  updateSkillLock() {
    for (const skill of this.installedSkills) {
      this.registry.updateSkillLock('https://github.com/Ayan-Jain-737/install-anything-skill.git', {
        name: skill.name,
        relativePath: `skills/${skill.name}`
      });
    }
  }
}

if (require.main === module) {
  const installer = new SelfInstaller();
  installer.install();
}

module.exports = { SelfInstaller };
