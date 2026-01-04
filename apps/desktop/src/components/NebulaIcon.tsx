export function NebulaIcon({
  className,
  size = 48,
  showText = false,
}: {
  className?: string
  size?: number
  showText?: boolean
}) {
  if (showText) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple N shape with modern styling */}
          <path
            d="M14 12 L14 36 M14 12 L34 36 M34 12 L34 36"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-3xl font-semibold tracking-tight">NEBULA</span>
      </div>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simple N shape with modern styling */}
      <path
        d="M14 12 L14 36 M14 12 L34 36 M34 12 L34 36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
