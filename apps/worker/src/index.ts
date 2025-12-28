import { Worker } from '@temporalio/worker'
import * as activities from './activities'

async function run() {
  const worker = await Worker.create({
    workflowsPath: new URL('./workflows/index.js', import.meta.url).pathname,
    activities,
    taskQueue: 'nebula-missions',
  })

  console.log('Temporal worker started')
  await worker.run()
}

run().catch((err) => {
  console.error('Worker failed:', err)
  process.exit(1)
})
