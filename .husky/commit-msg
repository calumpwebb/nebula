#!/bin/bash
set -e

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

# Pattern: type(NEBULA-xxx) or type(NEBULA-xxx, NEBULA-yyy, ...): message
pattern='^(feat|fix|chore|docs|refactor|test|ci|perf|build)\((NEBULA-[a-zA-Z0-9]+(,\s*NEBULA-[a-zA-Z0-9]+)*)\):\s+.+'

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "ERROR: Invalid commit message format."
  echo ""
  echo "Expected: type(NEBULA-xxx): description"
  echo "      or: type(NEBULA-xxx, NEBULA-yyy): description"
  echo ""
  echo "Valid types: feat, fix, chore, docs, refactor, test, ci, perf, build"
  echo ""
  echo "Examples:"
  echo "  feat(NEBULA-r4k): add pre-commit hooks"
  echo "  fix(NEBULA-123, NEBULA-456): resolve race condition"
  echo ""
  echo "Your message: $commit_msg"
  exit 1
fi
