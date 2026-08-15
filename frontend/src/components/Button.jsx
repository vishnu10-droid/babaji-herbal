export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary:
      'bg-[#0B6B3A] text-white shadow-[0_10px_30px_rgba(11,107,58,0.25)] hover:-translate-y-0.5',
    secondary:
      'bg-[#F8B133] text-[#1B1B1B] shadow-[0_10px_30px_rgba(248,177,51,0.22)] hover:-translate-y-0.5',
    ghost: 'border border-[#0B6B3A] text-[#0B6B3A] bg-white hover:bg-[#f0f8f3]',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
