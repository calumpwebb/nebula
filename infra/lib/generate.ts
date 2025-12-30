// infra/lib/generate.ts

import { App } from 'cdk8s'
import { glob } from 'glob'
import * as fs from 'fs'
import * as path from 'path'
import { generateK8sResources } from './k8s'
import { generateTiltfile } from './tiltfile'
import type { ManifestDefinition } from './types'

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..')
const APPS_DIR = path.join(PROJECT_ROOT, 'apps')
const DIST_DIR = path.join(PROJECT_ROOT, 'infra/dist')

async function main() {
  console.log('🔍 Discovering manifests...')

  // Find all manifest.ts files
  const manifestFiles = await glob('*/deploy/manifest.ts', { cwd: APPS_DIR })
  console.log(`   Found ${manifestFiles.length} manifests`)

  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }

  const allDefinitions: ManifestDefinition[] = []
  const appDirs = new Map<string, string>()

  // Load and process each manifest
  for (const file of manifestFiles) {
    const appName = path.dirname(path.dirname(file))
    const appDir = path.join(APPS_DIR, appName)
    const manifestPath = path.join(APPS_DIR, file)

    console.log(`📦 Processing ${appName}...`)

    // Dynamic import of manifest
    const module = await import(manifestPath)
    const exports = module.default

    // Handle array of definitions or single definition
    const definitions: ManifestDefinition[] = Array.isArray(exports) ? exports : [exports]

    for (const def of definitions) {
      allDefinitions.push(def)
      appDirs.set(def.name, appDir)

      // Generate K8s YAML for app definitions
      if (def.type === 'app') {
        console.log(`   ⚙️  Generating K8s resources for ${def.name}`)
        const cdk8sApp = new App({ outdir: DIST_DIR })
        generateK8sResources(cdk8sApp, def, path.join(appDir, 'deploy'))
        cdk8sApp.synth()

        // cdk8s outputs to a folder, we want flat files
        const chartDir = path.join(DIST_DIR, def.name)
        if (fs.existsSync(chartDir)) {
          const files = fs.readdirSync(chartDir)
          for (const f of files) {
            const content = fs.readFileSync(path.join(chartDir, f), 'utf-8')
            fs.writeFileSync(path.join(DIST_DIR, `${def.name}.yaml`), content)
          }
          fs.rmSync(chartDir, { recursive: true })
        }
      }
    }
  }

  // Generate Tiltfile
  console.log('📝 Generating Tiltfile...')
  const tiltfile = generateTiltfile(allDefinitions, appDirs, PROJECT_ROOT)
  fs.writeFileSync(path.join(DIST_DIR, 'Tiltfile.generated'), tiltfile)

  console.log('✅ Done!')
  console.log(`   Output: ${DIST_DIR}`)
}

main().catch(console.error)
