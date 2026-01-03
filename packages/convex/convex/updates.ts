import { httpAction } from './_generated/server'

const GITHUB_RELEASES_URL =
  'https://github.com/calumpwebb/nebula/releases/latest/download/latest.json'

/**
 * Proxy for desktop app update checks.
 * Fetches latest.json from GitHub releases and forwards it to the client.
 */
export const latest = httpAction(async () => {
  const response = await fetch(GITHUB_RELEASES_URL)

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch update info' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
    },
  })
})
