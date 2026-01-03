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

const typeStyles: Record<
  ToastType,
  { border: string; labelText: string; messageText: string; label: string }
> = {
  error: {
    border: 'border-red-500',
    labelText: 'text-red-400',
    messageText: 'text-red-300',
    label: 'error',
  },
  warning: {
    border: 'border-yellow-500',
    labelText: 'text-yellow-400',
    messageText: 'text-yellow-300',
    label: 'warning',
  },
  success: {
    border: 'border-green-500',
    labelText: 'text-green-400',
    messageText: 'text-green-300',
    label: 'success',
  },
  info: {
    border: 'border-gray-500',
    labelText: 'text-gray-300',
    messageText: 'text-gray-400',
    label: 'info',
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
        flex items-center gap-2 px-3 py-2 border bg-black
        font-mono text-sm select-none
        transition-all duration-200 ease-out
        ${styles.border}
        ${isExiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}
      `}
    >
      <div className="flex-1">
        <span className={`${styles.labelText} font-bold`}>{styles.label}: </span>
        <span className={styles.messageText}>{toast.message}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="text-gray-600 hover:text-gray-400 transition-colors"
      >
        [x]
      </button>
    </div>
  )
}
