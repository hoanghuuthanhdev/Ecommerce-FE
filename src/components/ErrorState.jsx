export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-line bg-surface py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-danger">Request failed</p>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
        >
          Try again
        </button>
      )}
    </div>
  )
}
