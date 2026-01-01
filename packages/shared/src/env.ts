/// <reference path="./env.d.ts" />

export type Environment = 'local' | 'production'

// Const object for autocompletion
export const Environment = {
  Local: 'local',
  Production: 'production',
} as const satisfies Record<string, Environment>

function parse(value: string | undefined): Environment {
  if (value === 'production') return 'production'
  return 'local' // Default to local for safety
}

/** Get the current environment. Checks ENVIRONMENT, falls back to VITE_ENVIRONMENT. */
export function getEnvironment(): Environment {
  const value =
    process.env.ENVIRONMENT ??
    import.meta.env?.VITE_ENVIRONMENT
  return parse(value)
}
