interface SparklineProps {
  values: number[];
  labels?: string[];
  height?: number;
}

/**
 * Tiny stand-alone SVG sparkline — quiet, not chart-heavy. Used on the
 * owner insight view to show the last 7 days' cumulative sold-today.
 */
export function Sparkline({ values, labels, height = 80 }: SparklineProps) {
  if (values.length === 0) return null;

  const max = Math.max(1, ...values);
  const stepX = 100 / Math.max(1, values.length - 1);

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = 100 - (v / max) * 100;
    return [x, y] as const;
  });

  const pathD = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        role="img"
        aria-label="Sales over the last 7 days"
      >
        <defs>
          <linearGradient id="crumb-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--crust-gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--crust-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#crumb-spark)" stroke="none" />
        <path
          d={pathD}
          fill="none"
          stroke="var(--crust-gold)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill="var(--crust-gold)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: "var(--soft-ash)" }}>
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
