const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' }

export default function PriceTag({ price, currency = 'USD', productAvailable = true }) {
  const symbol = CURRENCY_SYMBOLS[currency] || ''
  return (
    <div className="relative inline-flex items-center gap-2 bg-brand px-3 py-1.5 text-surface">
      {/* corner fold */}
      <span className="absolute -left-2 top-0 h-0 w-0 border-y-[14px] border-r-[8px] border-y-transparent border-r-brand" />
      <span className="font-mono text-sm">
        {symbol}
        {price.toFixed(2)}
      </span>
      {!productAvailable && (
        <span className="rounded-sm bg-danger px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          Sold out
        </span>
      )}
    </div>
  )
}
