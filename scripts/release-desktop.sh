#!/bin/bash
set -e

# Parse arguments
VERSION=""
NOTES=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --version) VERSION="$2"; shift 2 ;;
        --notes) NOTES="$2"; shift 2 ;;
        *) shift ;;
    esac
done

# Must be on main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "Error: Must be on main branch (currently on $BRANCH)"
    exit 1
fi

# Must be clean
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory not clean"
    git status --short
    exit 1
fi

# Show current state (version derived from git tag, not source files)
LATEST_TAG=$(git tag -l "desktop-v*" --sort=-v:refname | head -1)
LATEST_VERSION=${LATEST_TAG#desktop-v}
echo "Latest release: ${LATEST_VERSION:-(none)}"

# Get version (from arg or prompt)
if [ -z "$VERSION" ]; then
    # Calculate next patch version as suggestion
    if [ -n "$LATEST_VERSION" ]; then
        IFS='.' read -r MAJOR MINOR PATCH <<< "$LATEST_VERSION"
        NEXT_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
    else
        NEXT_VERSION="0.1.0"
    fi
    echo ""
    read -p "New version [$NEXT_VERSION]: " VERSION
    VERSION=${VERSION:-$NEXT_VERSION}
fi

# Validate
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid semver"
    exit 1
fi

TAG="desktop-v$VERSION"
if git tag -l | grep -q "^$TAG$"; then
    echo "Error: Tag $TAG exists"
    exit 1
fi

# Confirm (skip if notes provided = non-interactive mode)
echo ""
echo "Tag: $TAG"
echo "Commit: $(git rev-parse --short HEAD)"
if [ -z "$NOTES" ]; then
    read -p "Create and push? [Y/n] " CONFIRM
    [[ "$CONFIRM" =~ ^[nN]$ ]] && exit 0
fi

# Create tag (annotated if notes provided, lightweight otherwise)
if [ -n "$NOTES" ]; then
    git tag -a "$TAG" -m "$NOTES"
else
    git tag "$TAG"
fi
git push origin "$TAG"

echo ""
echo "Done. Watch: https://github.com/calumpwebb/nebula/actions"
