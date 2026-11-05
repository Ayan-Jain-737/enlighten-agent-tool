# NPM Package Deprecation Notice

## Overview
The package **`enlighten-agent-tool`** has been renamed to **`install-anything-skill`**.

## Deprecation Command
To deprecate the legacy package on npm with a custom redirection message, run:

```bash
npm deprecate enlighten-agent-tool "Package has been renamed to 'install-anything-skill'. Please install 'install-anything-skill' instead: npm install -g install-anything-skill"
```

## Publishing the New Package
1. Ensure your npm login is active:
   ```bash
   npm whoami
   ```
2. Publish `install-anything-skill`:
   ```bash
   npm publish --access public
   ```
3. Once published, deprecate `enlighten-agent-tool` using the command above.
