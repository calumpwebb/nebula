# Marketing Website Design

## Overview

Terminal-themed landing page for Nebula, matching the desktop app's aesthetic. Built with Astro for static output, self-hosted in our k3d/Tilt infrastructure.

## Stack

- **Framework:** Astro (static output mode)
- **Styling:** Tailwind CSS (reuse desktop theme tokens)
- **Fonts:** Geist + Geist Mono (same as desktop)
- **Hosting:** nginx in k8s via Tilt

## Structure

```
apps/website/
├── src/
│   ├── layouts/
│   │   └── Base.astro           # HTML shell, fonts, meta tags
│   ├── pages/
│   │   └── index.astro          # Landing page
│   ├── components/
│   │   └── DownloadButton.astro # Platform-aware download dropdown
│   └── styles/
│       └── globals.css          # Tailwind + theme tokens
├── public/
│   └── favicon.ico
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

## Visual Design

### Theme (from desktop)

| Token      | Value                               |
| ---------- | ----------------------------------- |
| Background | `hsl(0 0% 0%)` - pure black         |
| Foreground | `hsl(0 0% 95%)` - near white        |
| Primary    | `hsl(270 100% 70%)` - purple accent |
| Border     | `hsl(0 0% 15%)`                     |
| Radius     | `0.5rem`                            |

### Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  [Purple ASCII NEBULA logo]             │
│                                         │
│  $ developer_hud --for ai-coding        │
│                                         │
│  // track context. ship faster.         │
│                                         │
│  [ Download for macOS ▾ ]               │
│    > Apple Silicon (M1/M2/M3)           │
│    > Intel                              │
│                                         │
│  > view on github                       │
│                                         │
└─────────────────────────────────────────┘
```

### UI Patterns

- **Prompts:** `$ command` style for headings
- **Comments:** `// text` for secondary text
- **Buttons:** `[ action ]` with purple border
- **Links:** `> link text` style
- **Font:** Geist Mono throughout

## Download Button

### Platform Detection

1. Detect OS from `navigator.platform` / `navigator.userAgent`
2. Show appropriate dropdown:
   - **macOS:** Dropdown with Apple Silicon / Intel options
   - **Linux:** Direct download (x64 only currently)
   - **Windows/Unknown:** Link to GitHub releases page

### Release Fetching

```javascript
// Fetch latest release
const release = await fetch('https://api.github.com/repos/calumpwebb/nebula/releases/latest').then(
  (r) => r.json()
)

// Asset mapping
const assets = {
  'macos-arm64': `Nebula_${version}_aarch64.dmg`,
  'macos-x64': `Nebula_${version}_x64.dmg`,
  'linux-x64': `nebula_${version}_amd64.AppImage`,
}
```

### Fallback

If detection fails or platform unsupported, show "View all downloads" linking to:
`https://github.com/calumpwebb/nebula/releases/latest`

## Deployment

### Build

```bash
cd apps/website
pnpm build  # outputs to dist/
```

### K8s Manifest

Add `apps/website/deploy/manifest.ts` with:

- nginx deployment serving static files
- Service + Ingress for routing

### Tilt Integration

Add to `Tiltfile`:

```python
docker_build('website', 'apps/website')
k8s_yaml(...)
```

## Future Expansion

This design supports growth into:

1. **Lead capture:** Add email signup form
2. **Product showcase:** Add screenshots/demo sections
3. **Documentation:** Astro has built-in MDX support for docs
