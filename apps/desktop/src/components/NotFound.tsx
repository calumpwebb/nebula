import { Link } from '@tanstack/react-router'
import { HomeIcon } from '@heroicons/react/24/outline'

export function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground font-mono">404</h1>
          <p className="text-xl text-foreground-secondary">Page not found</p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Take me home</span>
        </Link>
      </div>
    </div>
  )
}
