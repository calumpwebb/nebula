// Note: JS not TS because eslint.config.js is loaded by Node directly

/**
 * ESLint rule: require-skip-auth-reason
 *
 * Enforces that any query/mutation/action with `skipAuth: true` must have
 * a @skip-auth-reason comment explaining why authentication is skipped.
 *
 * Example:
 * ```ts
 * // @skip-auth-reason: Public health check endpoint
 * export const health = query({
 *   skipAuth: true,
 *   args: {},
 *   handler: async (ctx) => ({ ok: true })
 * })
 * ```
 */
export const requireSkipAuthReason = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require @skip-auth-reason comment when using skipAuth: true',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingReason:
        'skipAuth: true requires a @skip-auth-reason comment above the export.\n' +
        'Example:\n' +
        '  // @skip-auth-reason: Health check for load balancer\n' +
        '  export const health = query({ skipAuth: true, ... })',
    },
    schema: [],
  },

  create(context) {
    return {
      Property(node) {
        // Check if this is a `skipAuth: true` property
        if (
          node.key.type === 'Identifier' &&
          node.key.name === 'skipAuth' &&
          node.value.type === 'Literal' &&
          node.value.value === true
        ) {
          // Find the parent export declaration
          const exportDeclaration = findParentExport(node)

          if (!exportDeclaration) {
            // Not in an export, skip
            return
          }

          // Check for @skip-auth-reason comment
          const hasReason = hasSkipAuthReasonComment(context, exportDeclaration)

          if (!hasReason) {
            context.report({
              node: node,
              messageId: 'missingReason',
            })
          }
        }
      },
    }
  },
}

/**
 * Find the parent export declaration for a node
 */
function findParentExport(node) {
  let current = node

  while (current) {
    if (current.type === 'ExportNamedDeclaration') {
      return current
    }
    current = current.parent
  }

  return null
}

/**
 * Check if a node has a @skip-auth-reason comment above it
 */
function hasSkipAuthReasonComment(context, node) {
  const sourceCode = context.getSourceCode()
  const comments = sourceCode.getCommentsBefore(node)

  return comments.some((comment) => comment.value.includes('@skip-auth-reason'))
}
