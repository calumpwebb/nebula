import { useEffect, useState } from 'react'

export type ToastType = 'error' | 'warning' | 'success' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  message: string
  duration: number
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

const typeStyles: Record<ToastType, { bg: string; text: string; label: string }> = {
  error: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    label: 'Error',
  },
  warning: {
    bg: 'bg-warning',
    text: 'text-warning-foreground',
    label: 'Warning',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    label: 'Success',
  },
  info: {
    bg: 'bg-info',
    text: 'text-info-foreground',
    label: 'Info',
  },
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const styles = typeStyles[toast.type]

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, toast.duration - 200)

    const dismissTimer = setTimeout(() => {
      onDismiss(toast.id)
    }, toast.duration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(dismissTimer)
    }
  }, [toast.id, toast.duration, onDismiss])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 200)
  }

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-md shadow-lg
        font-sans text-sm select-none
        transition-all duration-200 ease-out
        ${styles.bg} ${styles.text}
        ${isExiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
    >
      <div className="flex-1 flex items-center gap-2">
        <span className="font-semibold">{styles.label}</span>
        <span>{toast.message}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
