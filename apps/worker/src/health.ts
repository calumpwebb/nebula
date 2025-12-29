import { createServer } from 'node:http'

export function createHealthServer(port: number) {
  let isReady = false

  const server = createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      const code = isReady ? 200 : 503
      res.writeHead(code, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: isReady ? 'ok' : 'starting' }))
    } else {
      res.writeHead(404)
      res.end()
    }
  })

  server.listen(port, () => {
    console.log(`  Health endpoint: http://localhost:${port}/health`)
  })

  return {
    ready: () => { isReady = true },
    close: () => server.close(),
  }
}
