export function Button({
  children,
  onClick,
  type = 'button',
  disabled,
  loading,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'link'
  className?: string
}) {
  const baseStyles =
    'px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-ring',
    secondary:
      'bg-secondary text-secondary-foreground border border-border hover:bg-secondary-hover hover:border-border-hover focus:ring-ring',
    link: 'text-accent hover:text-accent-hover underline-offset-4 hover:underline focus:ring-accent',
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${className ?? ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
