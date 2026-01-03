// ⚠️  SERVER ONLY - Do not import React or client code here

import { buildMiddleware, customQuery, customMutation, customAction } from './factory'
import { appVersion } from './configs/appVersion'
import { auth } from './configs/auth'
import {
  query as baseQuery,
  mutation as baseMutation,
  action as baseAction,
} from '../_generated/server'

// Middleware runs top-to-bottom
const appVersionMw = buildMiddleware(appVersion)
// TODO(NEBULA-xxx): Implement proper middleware composition

const _authMw = buildMiddleware(auth) // Reserved for composition

// TODO(NEBULA-xxx): Implement proper middleware composition
// Currently exporting just the appVersion middleware to verify type-checking works.
// Full composition will be implemented after fixing type issues with chaining.
export const query = customQuery(baseQuery, appVersionMw.server!.query)
export const mutation = customMutation(baseMutation, appVersionMw.server!.mutation)
export const action = customAction(baseAction, appVersionMw.server!.action)
