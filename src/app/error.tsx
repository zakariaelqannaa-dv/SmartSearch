"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-unit-lg">
      <div className="glass-card rounded-xl p-unit-xl max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <svg className="text-error" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-headline-md font-bold text-on-surface mb-2">Something went wrong</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
