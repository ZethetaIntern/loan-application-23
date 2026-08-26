interface ProgressBarProps {
  steps: Array<{ key: string; title: string }>
  currentIndex: number
}

function shortTitle(title: string): string {
  return title.split('&')[0].trim();
}

export function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  const total = steps.length;
  const pct = total > 0 ? Math.round((Math.min(currentIndex, total) / total) * 100) : 0;

  return (
    <nav aria-label="Application progress" className="w-full">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-ink">
          Step
          {' '}
          {Math.min(currentIndex + 1, total)}
          {' '}
          of
          {' '}
          {total}
        </p>
        <p className="text-xs font-medium text-mist" aria-hidden="true">
          {pct}
          % complete
        </p>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${currentIndex + 1} of ${total}, ${pct}% complete`}
      >
        <div
          className="from-primary to-gold h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-4 hidden items-start gap-0 sm:flex" aria-label="Steps">
        {steps.map((step, i) => {
          const status = i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'upcoming';
          return (
            <li
              key={step.key}
              aria-current={status === 'current' ? 'step' : undefined}
              className="relative flex flex-1 flex-col items-center gap-1.5 px-0.5"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-[11px] right-1/2 -z-0 h-0.5 w-full ${
                    status === 'upcoming' ? 'bg-line' : 'bg-primary/40'
                  }`}
                />
              )}
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                  status === 'current'
                    ? 'border-primary bg-primary text-white ring-primary/20 ring-4'
                    : status === 'completed'
                      ? 'border-primary/30 bg-primary-soft text-primary'
                      : 'border-line bg-white text-mist'
                }`}
              >
                {status === 'completed' ? '✓' : i + 1}
              </span>
              <span
                className={`text-center text-[10px] leading-tight font-medium ${
                  status === 'upcoming' ? 'text-mist/70' : 'text-ink'
                }`}
              >
                {shortTitle(step.title)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
