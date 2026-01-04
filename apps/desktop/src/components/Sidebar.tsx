import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { authClient } from '../lib/auth-client'

type NavItem = {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

type NavSection = {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { name: 'Home', to: '/', icon: HomeIcon },
      { name: 'Threads', to: '/threads', icon: ChatBubbleLeftRightIcon },
    ],
  },
]

export function Sidebar() {
  const router = useRouterState()
  const currentPath = router.location.pathname
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await authClient.signOut()

      // Clear any stored session data
      localStorage.clear()
      sessionStorage.clear()

      // Force reload to clear all state
      window.location.href = '/login'
    } catch (error) {
      console.error('[sign-out] Sign out failed:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="w-[200px] h-full bg-white rounded-lg shadow-lg flex flex-col p-3">
      {/* Title */}
      <div className="px-4 py-2 mb-2">
        <h1 className="text-xl font-semibold text-foreground font-mono">Nebula</h1>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 space-y-6">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div className="px-4 mb-2 text-xs font-semibold text-foreground-tertiary uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = currentPath === item.to
                const Icon = item.icon

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground-secondary hover:bg-surface-hover'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto pt-3 space-y-1">
        <Link
          to="/settings"
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors
            ${
              currentPath === '/settings'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground-secondary hover:bg-surface-hover'
            }
          `}
        >
          <Cog6ToothIcon className="w-5 h-5" />
          <span>Settings</span>
        </Link>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-foreground-secondary hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>{isSigningOut ? 'Signing out...' : 'Log out'}</span>
        </button>
      </div>
    </div>
  )
}
