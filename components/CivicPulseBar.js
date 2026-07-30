// A segmented progress bar styled after a parliamentary seat-distribution
// chart — the recurring visual motif for "how far along" across the app
// (quiz mastery, regional integration progress, engagement levels).
export default function CivicPulseBar({ value, segments = 10, label, tone = "gold" }) {
  const filled = Math.round((value / 100) * segments);
  const toneClass = tone === "forest" ? "bg-forest" : "bg-gold";

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
            {label}
          </span>
          <span className="font-mono text-xs text-charcoal/70">{value}%</span>
        </div>
      )}
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-sm ${i < filled ? toneClass : "bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}
