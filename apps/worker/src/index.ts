import { NativeConnection, Worker } from '@temporalio/worker'
import * as activities from './activities'
import { createHealthServer } from './health'

const config = {
  temporalAddress: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  taskQueue: process.env.TASK_QUEUE || 'default',
  namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  healthPort: parseInt(process.env.HEALTH_PORT || '8080'),
}

async function run() {
  console.log('Starting Temporal worker...')
  console.log(`  Temporal address: ${config.temporalAddress}`)
  console.log(`  Task queue: ${config.taskQueue}`)
  console.log(`  Namespace: ${config.namespace}`)

  const health = createHealthServer(config.healthPort)

  const connection = await NativeConnection.connect({
    address: config.temporalAddress,
  })

  const worker = await Worker.create({
    connection,
    namespace: config.namespace,
    workflowsPath: new URL('./workflows/index.ts', import.meta.url).pathname,
    activities,
    taskQueue: config.taskQueue,
  })

  health.ready()

  const shutdown = async () => {
    console.log('Shutting down worker...')
    health.close()
    await worker.shutdown()
    await connection.close()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  console.log('Worker connected and listening for tasks')
  await worker.run()
}

run().catch((err) => {
  console.error('Worker failed:', err)
  process.exit(1)
})
