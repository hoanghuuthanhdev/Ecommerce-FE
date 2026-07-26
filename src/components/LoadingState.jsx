export default function LoadingState({ label = 'Loading catalog…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand" />
      <p className="font-mono text-xs uppercase tracking-widest">{label}</p>
    </div>
  )
}
