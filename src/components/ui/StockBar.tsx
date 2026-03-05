interface StockBarProps {
  current: number
  threshold: number
}

export function StockBar({ current, threshold }: StockBarProps) {
  const isLow = current <= threshold
  const percentage = threshold > 0 ? Math.min((current / (threshold * 3)) * 100, 100) : 100
  const bgColor = isLow ? 'bg-danger' : 'bg-success'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-sand-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isLow && <span className="text-danger text-xs font-bold">!</span>}
    </div>
  )
}
