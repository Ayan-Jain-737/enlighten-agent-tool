#!/usr/bin/env bash
# ==============================================================================
# install-anything-skill: Universal 1-Command Installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Ayan-Jain-737/install-anything-skill/main/scripts/install.sh | bash
#   or from a local clone: ./scripts/install.sh
# ==============================================================================

set -e

REPO_URL="https://github.com/Ayan-Jain-737/install-anything-skill.git"
INSTALL_DIR="${HOME}/.install-anything/install-anything-skill"

echo ""
echo "⚡ ======================================================"
echo "⚡ install-anything - Universal Installer"
echo "⚡ ======================================================"
echo ""

# 1. Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is required but not installed."
    echo "   Please install Node.js (v18 or newer) from https://nodejs.org/"
    exit 1
fi

NODE_MAJOR=$(node -v | cut -d'.' -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "⚠️  Warning: Node.js v18+ is recommended (found $(node -v))."
fi

# 2. Check Git
if ! command -v git >/dev/null 2>&1; then
    echo "❌ Error: git is required but not installed."
    echo "   Please install git to continue."
    exit 1
fi

# 3. Determine source directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || echo "")"
if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/../package.json" ]; then
    PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
    echo "📦 Installing from local repository: ${PROJECT_DIR}"
else
    PROJECT_DIR="$INSTALL_DIR"
    echo "📦 Cloning install-anything-skill repository to: ${PROJECT_DIR}..."
    mkdir -p "$(dirname "$PROJECT_DIR")"
    if [ -d "$PROJECT_DIR/.git" ]; then
        echo "   Updating existing installation..."
        git -C "$PROJECT_DIR" pull --ff-only || true
    else
        rm -rf "$PROJECT_DIR"
        git clone --depth 1 "$REPO_URL" "$PROJECT_DIR"
    fi
fi

# 4. Run installer
echo ""
echo "🚀 Registering skills and configuring agent harnesses..."
node "$PROJECT_DIR/scripts/install.js"

# 5. PATH check
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo ""
    echo "💡 Note: ~/.local/bin is not in your current PATH."
    echo "   Add it by running:"
    echo '   export PATH="$HOME/.local/bin:$PATH"'
    echo "   or add that line to your ~/.bashrc or ~/.zshrc."
fi

echo ""
echo "✨ Installation finished successfully!"
echo "   Test with: ias --help (or install-anything --help)"
echo "   Install any repo: ias install <repo-url>"
echo ""
