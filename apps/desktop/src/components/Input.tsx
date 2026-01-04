export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoFocus,
  autoComplete,
  name,
  id,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  autoComplete?: string
  name?: string
  id?: string
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        name={name}
        id={id}
        className="w-full px-3.5 py-2.5 text-sm bg-background border border-input rounded-md transition-colors focus:outline-none focus:border-input-focus focus:ring-1 focus:ring-ring placeholder:text-foreground-tertiary"
      />
    </div>
  )
}
