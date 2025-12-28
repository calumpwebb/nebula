import { proxyActivities } from '@temporalio/workflow'
import { MissionPhase } from '@nebula/shared'
import type * as activities from '../activities'

const { updateMissionPhase, runBrainstormPhase, runDesignPhase, runPlanPhase, runExecutePhase } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '10 minutes',
  })

export interface MissionWorkflowInput {
  missionId: string
  startPhase?: MissionPhase
}

export async function missionWorkflow(input: MissionWorkflowInput): Promise<void> {
  const { missionId, startPhase = MissionPhase.Brainstorm } = input

  // Run through phases starting from startPhase
  const phases = [
    MissionPhase.Brainstorm,
    MissionPhase.Design,
    MissionPhase.Plan,
    MissionPhase.Execute,
  ]

  const startIndex = phases.indexOf(startPhase)

  for (let i = startIndex; i < phases.length; i++) {
    const phase = phases[i]!
    await updateMissionPhase(missionId, phase)

    switch (phase) {
      case MissionPhase.Brainstorm:
        await runBrainstormPhase(missionId)
        break
      case MissionPhase.Design:
        await runDesignPhase(missionId)
        break
      case MissionPhase.Plan:
        await runPlanPhase(missionId)
        break
      case MissionPhase.Execute:
        await runExecutePhase(missionId)
        break
    }
  }
}
