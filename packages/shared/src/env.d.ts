interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT?: string
}

declare global {
  interface ImportMeta {
    readonly env?: ImportMetaEnv
  }
}

export {}
