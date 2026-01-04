export function Button({
  children,
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
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

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
