const TONE_BY_STATUS = {
  "In Force": "bg-forest/10 text-forest",
  "Active Implementation": "bg-gold/15 text-gold",
  "Early Stage": "bg-charcoal/10 text-charcoal/70",
  Stalled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  const tone = TONE_BY_STATUS[status] || "bg-charcoal/10 text-charcoal/70";
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {status}
    </span>
  );
}
