import { useEffect, useState } from 'react'

interface Dot {
  x: number
  y: number
  radius: number
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

function generateDotsForCell(cellX: number, cellY: number, cellSize: number): Dot[] {
  const seed = hashCode(`${cellX},${cellY}`)
  const random = seededRandom(seed)

  // Much lower density - about 0.5% coverage instead of 8%
  const dotsPerCell = Math.floor((cellSize * cellSize * 0.005) / (Math.PI * 1.5 * 1.5))
  const dots: Dot[] = []

  for (let i = 0; i < dotsPerCell; i++) {
    dots.push({
      x: cellX * cellSize + random() * cellSize,
      y: cellY * cellSize + random() * cellSize,
      radius: 1.5,
    })
  }

  return dots
}

function getVisibleCells(
  windowWidth: number,
  windowHeight: number,
  cellSize: number
): [number, number][] {
  const centerX = windowWidth / 2
  const centerY = windowHeight / 2

  const cellsX = Math.ceil(centerX / cellSize) + 1
  const cellsY = Math.ceil(centerY / cellSize) + 1

  const cells: [number, number][] = []
  for (let x = -cellsX; x <= cellsX; x++) {
    for (let y = -cellsY; y <= cellsY; y++) {
      cells.push([x, y])
    }
  }

  return cells
}

function createSVG(dots: Dot[], windowWidth: number, windowHeight: number): string {
  const circles = dots
    .map((d) => `<circle cx="${d.x}" cy="${d.y}" r="${d.radius}" fill="black" />`)
    .join('')

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${windowWidth}" height="${windowHeight}">
      <g transform="translate(${windowWidth / 2}, ${windowHeight / 2})">
        ${circles}
      </g>
    </svg>
  `)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

export function StippleBackground() {
  const [backgroundImage, setBackgroundImage] = useState<string>('')

  useEffect(() => {
    const generatePattern = () => {
      console.log('🎨 Generating stipple pattern...')
      console.log('Window size:', window.innerWidth, 'x', window.innerHeight)
      const cellSize = 500
      const cells = getVisibleCells(window.innerWidth, window.innerHeight, cellSize)
      console.log('Generated cells:', cells.length)
      const allDots = cells.flatMap(([x, y]) => generateDotsForCell(x, y, cellSize))
      console.log('Generated dots:', allDots.length)
      const svg = createSVG(allDots, window.innerWidth, window.innerHeight)
      console.log('SVG length:', svg.length)
      console.log('SVG preview:', svg.substring(0, 200))
      setBackgroundImage(svg)
    }

    generatePattern()

    const debouncedResize = debounce(generatePattern, 250)
    window.addEventListener('resize', debouncedResize)
    return () => window.removeEventListener('resize', debouncedResize)
  }, [])

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundImage: backgroundImage ? `url("${backgroundImage}")` : undefined }}
    />
  )
}
