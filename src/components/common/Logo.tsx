interface LogoProps {
  size?: number
}

export function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="LendSwift logo"
      className="shadow-card rounded-2xl"
    >
      <defs>
        <linearGradient id="lendswift-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0e8a67" />
          <stop offset="1" stopColor="#084a37" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lendswift-g)" />
      <path
        d="M20 44V26l12-8 12 8v18"
        fill="none"
        stroke="#f7efd8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 44v-9a5 5 0 0 1 10 0v9"
        fill="none"
        stroke="#c9a227"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
