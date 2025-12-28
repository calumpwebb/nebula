#!/usr/bin/env tsx
/**
 * Script to trigger a mission workflow for testing.
 *
 * Usage:
 *   pnpm trigger:workflow [missionId]
 *
 * If no missionId is provided, a random one will be generated.
 */

import { Connection, Client } from '@temporalio/client'
import { missionWorkflow } from '../src/workflows'
import { randomUUID } from 'crypto'

// 12-factor: Configuration via environment variables
const config = {
  temporalAddress: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  taskQueue: process.env.TASK_QUEUE || 'default',
  namespace: process.env.TEMPORAL_NAMESPACE || 'default',
}

async function main() {
  const missionId = process.argv[2] || `mission-${randomUUID().slice(0, 8)}`

  console.log('Connecting to Temporal...')
  console.log(`  Address: ${config.temporalAddress}`)
  console.log(`  Namespace: ${config.namespace}`)
  console.log(`  Task Queue: ${config.taskQueue}`)

  const connection = await Connection.connect({
    address: config.temporalAddress,
  })

  const client = new Client({
    connection,
    namespace: config.namespace,
  })

  console.log(`\nStarting workflow for mission: ${missionId}`)

  const handle = await client.workflow.start(missionWorkflow, {
    taskQueue: config.taskQueue,
    workflowId: `mission-workflow-${missionId}`,
    args: [{ missionId }],
  })

  console.log(`Workflow started!`)
  console.log(`  Workflow ID: ${handle.workflowId}`)
  console.log(`  Run ID: ${handle.firstExecutionRunId}`)
  console.log(`\nWaiting for workflow to complete...`)

  try {
    const result = await handle.result()
    console.log(`\nWorkflow completed successfully!`)
    console.log(`  Result:`, result)
  } catch (err) {
    console.error(`\nWorkflow failed:`, err)
    process.exit(1)
  }

  await connection.close()
}

main().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
