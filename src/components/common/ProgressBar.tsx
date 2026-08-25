interface ProgressBarProps {
  steps: Array<{ key: string; title: string }>
  currentIndex: number
}

export function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  const total = steps.length
  const pct = total > 0 ? Math.round(((Math.min(currentIndex, total) ) / total) * 100) : 0

  return (
    <nav aria-label="Application progress" className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Step {Math.min(currentIndex + 1, total)} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Step ${currentIndex + 1} of ${total}, ${pct}% complete`}>
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-3 flex gap-1" aria-label="Steps">
        {steps.map((step, i) => {
          const status = i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'upcoming'
          return (
            <li
              key={step.key}
              aria-current={status === 'current' ? 'step' : undefined}
              className={`flex-1 rounded py-1 text-center text-[10px] font-medium ${
                status === 'current'
                  ? 'bg-blue-600 text-white'
                  : status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
              }`}
              title={step.title}
            >
              {step.title}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
